import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { parseSlug, locForCity, landingSlug, citiesForCountry, LANDING_COUNTRIES } from "@/lib/landing-data";
import { searchLandingJobs } from "@/lib/landing-jobs";
import { roleProfileFor } from "@/lib/landing-roles";

const SITE_URL = "https://www.dropmycv.app";

export const revalidate = 86400; // refresh live job data daily

// Generate on-demand on first request and cache (ISR). Keeps builds fast and
// avoids hammering the job API at build time; the sitemap lists all slugs so
// crawlers still discover and trigger them.
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: "Jobs" };
  const { role, city } = parsed;

  // A "find {role} jobs in {city}" page with zero live listings is a thin /
  // doorway page — keep it out of Google's index (still follow its links). This
  // fetch is memoized with the page's own searchLandingJobs call, so it adds no
  // extra API request (see Next's generateMetadata fetch memoization).
  const { country } = locForCity(city);
  const { total } = await searchLandingJobs(role, city, country);

  // Lead the title/description with freshness + a live count (when meaningful).
  // These are the levers that earn clicks once a page reaches page 1.
  const title =
    total >= 10
      ? `${role} jobs in ${city} — ${total.toLocaleString()}+ live roles, updated daily`
      : total > 0
        ? `${role} jobs in ${city} — live roles, updated daily`
        : `${role} jobs in ${city} — matched to your CV`;
  const description =
    total > 0
      ? `${total >= 10 ? `${total.toLocaleString()}+ live ` : "Live "}${role} jobs in ${city}, refreshed daily. Drop your CV and our AI ranks the best matches for your skills in seconds — no account, nothing stored. Free.`
      : `Find ${role} jobs in ${city} and match your CV to the best ones in seconds — ranked by AI, no account, nothing stored. Free.`;

  return {
    title,
    description,
    alternates: { canonical: `/jobs/${slug}` },
    ...(total < 1 ? { robots: { index: false, follow: true } } : {}),
  };
}

function fmtSalary(cur: string, min?: number, max?: number): string {
  if (!min && !max) return "";
  const f = (n: number) => (n >= 1000 ? `${cur}${Math.round(n / 1000)}k` : `${cur}${n}`);
  if (min && max) return `${f(min)} – ${f(max)}`;
  if (min) return `${f(min)}+`;
  return `Up to ${f(max!)}`;
}

export default async function JobsLanding({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();
  const { role, city } = parsed;
  const { country, currency } = locForCity(city);
  const profile = roleProfileFor(role);

  const { jobs, total } = await searchLandingJobs(role, city, country);

  // Honest, live salary range — only from listings that actually publish one.
  const salaried = jobs.filter((j) => j.salaryMin || j.salaryMax);
  let salaryRange = "";
  if (salaried.length >= 3) {
    const lo = Math.min(...salaried.map((j) => j.salaryMin ?? j.salaryMax!));
    const hi = Math.max(...salaried.map((j) => j.salaryMax ?? j.salaryMin!));
    if (lo > 0 && hi > lo) salaryRange = fmtSalary(currency, lo, hi);
  }

  // Internal links: same role in nearby cities, related roles in this city, country hub.
  const otherCities = citiesForCountry(country).filter((c) => c.toLowerCase() !== city.toLowerCase()).slice(0, 8);
  const relatedRoles = (profile?.related ?? ["Project Manager", "Data Analyst", "Customer Service"]).slice(0, 3);
  const countryHub = LANDING_COUNTRIES.find((c) => c.code === country);

  // FAQ — built once, used for both the visible section and FAQPage structured data.
  const faqs: { q: string; a: string }[] = [
    {
      q: `How many ${role} jobs are there in ${city}?`,
      a: `We show live ${role} listings in ${city} pulled from Adzuna and refreshed daily${
        total > 0 ? `, with ${total.toLocaleString()}+ currently live` : ""
      }. Drop your CV and dropmycv searches multiple job sources at once and ranks the best matches for your skills.`,
    },
    {
      q: `What do ${role} jobs in ${city} pay?`,
      a: salaryRange
        ? `Across the live ${city} listings here that publish a salary, ${role} roles currently range around ${salaryRange}. Pay varies with experience, sector, and whether the role is permanent or contract.`
        : `Pay varies with experience, sector, and whether the role is permanent or contract. Many ${role} listings in ${city} publish a salary range — drop your CV to see the roles that fit your level.`,
    },
    {
      q: `What skills do ${role} jobs ask for?`,
      a: profile
        ? `Listings for ${role} roles commonly ask for ${profile.skills.slice(0, 6).join(", ")}. Making sure the ones you genuinely have appear on your CV helps you pass keyword screening.`
        : `Most ${role} listings name the specific tools, certifications or licences they need, plus evidence of results. Mirror the exact terms used in the listings you're targeting so your CV passes keyword screening.`,
    },
    {
      q: `How do I match my CV to ${role} jobs in ${city}?`,
      a: `Drop your CV on the dropmycv homepage. It's read in your browser, your email, phone and links are stripped, and our AI ranks live ${role} roles by how well they fit your actual skills and seniority — with a match score and reason for each. No account, nothing stored.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // Breadcrumb trail (Home › Jobs in {country} › {role} in {city}) — improves how
  // the page appears in search results and reinforces the crawl path.
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "dropmycv", item: SITE_URL },
      ...(countryHub
        ? [{ "@type": "ListItem", position: 2, name: `Jobs in ${countryHub.name}`, item: `${SITE_URL}/jobs-in/${countryHub.slug}` }]
        : []),
      { "@type": "ListItem", position: countryHub ? 3 : 2, name: `${role} jobs in ${city}`, item: `${SITE_URL}/jobs/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <header className="bg-navy px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-2xl font-extrabold tracking-tight transition-colors group">
            <span className="text-teal">drop</span><span className="text-white group-hover:text-teal">mycv</span><span className="text-teal">.app</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 space-y-10">
        <div className="space-y-2">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
            <Link href="/" className="hover:text-teal transition-colors">Home</Link>
            {countryHub && (
              <>
                <span className="mx-1.5">›</span>
                <Link href={`/jobs-in/${countryHub.slug}`} className="hover:text-teal transition-colors">
                  Jobs in {countryHub.name}
                </Link>
              </>
            )}
            <span className="mx-1.5">›</span>
            <span className="text-slate-500">{role} in {city}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
            {role} jobs in {city}, matched to your CV
          </h1>
          <p className="text-slate-500">
            {total > 0
              ? `Browsing live ${role} roles in ${city}. `
              : `Looking for ${role} roles in ${city}? `}
            Instead of scrolling endlessly, drop your CV and we&apos;ll rank the best matches for{" "}
            <em>your</em>{" "}skills in seconds — across Seek, LinkedIn, Indeed and more. No account,
            nothing stored.
          </p>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-5 sm:p-6 text-center">
          <h2 className="text-lg font-serif font-bold text-navy mb-1">Match my CV to {role} jobs</h2>
          <p className="text-sm text-slate-500 mb-4">Get a ranked shortlist tailored to you — free, in seconds.</p>
          <Link
            href="/#upload"
            className="inline-block text-sm px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
          >
            Match my CV — free →
          </Link>
        </div>

        {/* Live sample listings */}
        {jobs.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Live {role} roles in {city}
            </h2>
            <div className="space-y-3">
              {jobs.map((j) => {
                const salary = fmtSalary(currency, j.salaryMin, j.salaryMax);
                return (
                  <a
                    key={j.id}
                    href={j.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-xl border border-slate-200 p-4 hover:border-teal transition-colors"
                  >
                    <p className="font-semibold text-slate-800 leading-snug">{j.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {j.company}
                      {j.location ? ` · ${j.location}` : ""}
                    </p>
                    {salary && (
                      <span className="inline-block text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mt-2">
                        💰 {salary}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Listings via Adzuna, refreshed daily. Drop your CV above to search all of our
              sources and get them ranked for you.
            </p>
          </div>
        )}

        {/* What these roles ask for */}
        <section className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-navy">
            What {role} jobs in {city} usually ask for
          </h2>
          {profile ? (
            <>
              <p className="text-slate-600 leading-relaxed">{profile.blurb}</p>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Common skills &amp; keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
                    <span key={s} className="text-xs font-medium text-teal bg-teal-light px-2.5 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5 pt-1">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Who&apos;s usually hiring</p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {profile.sectors.map((s) => (
                      <li key={s} className="flex gap-2"><span className="text-teal">•</span>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Related job titles</p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {profile.titles.map((t) => (
                      <li key={t} className="flex gap-2"><span className="text-teal">•</span>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-600 leading-relaxed">
              Most {role} listings in {city} name the specific tools, certifications or licences they
              need, plus clear evidence of results. The fastest way to stand out is to mirror the exact
              terms used in the roles you&apos;re targeting — which is exactly what dropmycv surfaces
              when it ranks your CV against the live listings.
            </p>
          )}
        </section>

        {/* Salary & seniority */}
        <section className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-navy">Salary &amp; seniority in {city}</h2>
          <p className="text-slate-600 leading-relaxed">
            {salaryRange ? (
              <>
                Among the live {city} listings above that publish a figure, {role} salaries currently
                sit around <span className="font-semibold text-navy">{salaryRange}</span>. Treat that
                as a snapshot of what&apos;s advertised right now, not a fixed benchmark —
              </>
            ) : (
              <>Advertised pay for {role} roles in {city} varies widely, and many listings don&apos;t publish a figure — </>
            )}{" "}
            it moves with your experience level, the sector, and whether a role is permanent, contract
            or casual. Drop your CV and dropmycv ranks roles to your actual seniority, so you spend
            time on the ones that genuinely fit.
          </p>
        </section>

        {/* How we rank */}
        <section className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-navy">How dropmycv ranks these roles</h2>
          <p className="text-slate-600 leading-relaxed">
            Rather than a keyword search you filter yourself, dropmycv reads your whole CV and scores
            each live {role} role on title fit, skills overlap, seniority and location — then shows you
            a short, ranked shortlist with a plain-English reason for each match. You see why a role
            fits before you click, and your CV is never stored.
          </p>
        </section>

        {/* Related searches — internal linking */}
        <section className="pt-2">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Related searches</h2>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {otherCities.length > 0 && (
              <div>
                <p className="text-slate-500 mb-1.5">{role} jobs elsewhere</p>
                <ul className="space-y-1">
                  {otherCities.map((c) => (
                    <li key={c}>
                      <Link href={`/jobs/${landingSlug(role, c)}`} className="text-teal hover:underline">
                        {role} jobs in {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="text-slate-500 mb-1.5">Other roles in {city}</p>
              <ul className="space-y-1">
                {relatedRoles.map((r) => (
                  <li key={r}>
                    <Link href={`/jobs/${landingSlug(r, city)}`} className="text-teal hover:underline">
                      {r} jobs in {city}
                    </Link>
                  </li>
                ))}
                {countryHub && (
                  <li>
                    <Link href={`/jobs-in/${countryHub.slug}`} className="text-teal hover:underline">
                      All jobs in {countryHub.name}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pt-2">
          <h2 className="text-xl font-serif font-bold text-navy mb-4">{role} jobs in {city} — FAQ</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <p className="text-sm font-semibold text-slate-700">{f.q}</p>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy reassurance + secondary links */}
        <div className="pt-6 border-t border-slate-100 text-sm text-slate-500 space-y-2">
          <p className="text-xs text-slate-400">
            🔒 Your CV is parsed on your device, contact details stripped before matching, and discarded after — nothing stored.
          </p>
          <p>
            Also useful:{" "}
            <Link href="/cv-review" className="text-teal hover:underline">get an AI review of your CV</Link>{" "}
            ·{" "}
            <Link href="/private-job-search" className="text-teal hover:underline">how we keep your job search private</Link>
          </p>
        </div>
      </main>

      <footer className="bg-navy py-5 text-center text-xs text-white/40 mt-8">
        <Link href="/" className="hover:text-white/80 transition-colors">← Back to dropmycv</Link>
        <span className="mx-3">·</span>
        <Link href="/privacy" className="hover:text-white/80 transition-colors">Privacy</Link>
        <span className="mx-2">·</span>
        <Link href="/terms" className="hover:text-white/80 transition-colors">Terms</Link>
      </footer>
    </div>
  );
}
