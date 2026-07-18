import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  LANDING_COUNTRIES,
  LANDING_ROLES,
  countryBySlug,
  citiesForCountry,
  landingSlug,
} from "@/lib/landing-data";

export function generateStaticParams() {
  return LANDING_COUNTRIES.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const c = countryBySlug(country);
  if (!c) return { title: "Jobs" };
  return {
    title: `Jobs in ${c.name} matched to your CV`,
    description: `Find jobs in ${c.name} matched to your CV in seconds — ranked by AI across multiple job sources, no account, nothing stored. Free.`,
    alternates: { canonical: `/jobs-in/${c.slug}` },
  };
}

export default async function CountryHub({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const c = countryBySlug(country);
  if (!c) notFound();

  const cities = citiesForCountry(c.code);
  const topRoles = LANDING_ROLES.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-2xl font-extrabold tracking-tight transition-colors group">
            <span className="text-teal">drop</span><span className="text-white group-hover:text-teal">mycv</span><span className="text-teal">.app</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
            Jobs in {c.name}, matched to your CV
          </h1>
          <p className="text-slate-500">
            Stop scrolling endless listings. Drop your CV and dropmycv ranks live roles across{" "}
            {c.name} against your actual skills — pulling from multiple job sources and company
            career pages — and hands you a short, relevant shortlist with a match score and reason
            for each. No account, and your CV is never stored.
          </p>
        </div>

        <div className="rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-5 sm:p-6 text-center">
          <h2 className="text-lg font-serif font-bold text-navy mb-1">Match my CV to {c.name} jobs</h2>
          <p className="text-sm text-slate-500 mb-4">Free, in seconds — no account, nothing stored.</p>
          <Link
            href="/#upload"
            className="inline-block text-sm px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
          >
            Match my CV — free →
          </Link>
        </div>

        {cities.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Popular searches in {c.name}
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {cities.map((city) => (
                <div key={city}>
                  <p className="font-semibold text-navy mb-1.5">{city}</p>
                  <ul className="space-y-1">
                    {topRoles.map((role) => (
                      <li key={role}>
                        <Link
                          href={`/jobs/${landingSlug(role, city)}`}
                          className="text-sm text-slate-500 hover:text-teal-ink transition-colors"
                        >
                          {role} jobs in {city}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-100 text-sm text-slate-500 space-y-2">
          <p>
            <strong className="text-slate-700">Why dropmycv for {c.name}?</strong>{" "}Most job boards make
            you create an account and store your CV. We don&apos;t — your CV is read in your browser,
            your contact details are stripped before anything is sent, and nothing is kept.
          </p>
          <p>
            More:{" "}
            <Link href="/private-job-search" className="text-teal-ink hover:underline">private job search</Link>{" "}
            ·{" "}
            <Link href="/cv-review" className="text-teal-ink hover:underline">AI CV review</Link>{" "}
            ·{" "}
            <Link href="/compare/dropmycv-vs-job-boards" className="text-teal-ink hover:underline">vs job boards</Link>
          </p>
        </div>
      </main>

      <footer className="bg-navy py-5 text-center text-xs text-white/70 mt-8">
        <Link href="/" className="hover:text-white/80 transition-colors">← Back to dropmycv</Link>
        <span className="mx-3">·</span>
        <Link href="/privacy" className="hover:text-white/80 transition-colors">Privacy</Link>
        <span className="mx-2">·</span>
        <Link href="/terms" className="hover:text-white/80 transition-colors">Terms</Link>
      </footer>
    </div>
  );
}
