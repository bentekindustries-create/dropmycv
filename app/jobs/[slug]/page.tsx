import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { parseSlug, allLandingSlugs } from "@/lib/landing-data";
import { searchLandingJobs } from "@/lib/landing-jobs";

export const revalidate = 86400; // refresh live job data daily

export function generateStaticParams() {
  return allLandingSlugs().map((slug) => ({ slug }));
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
  return {
    title: `${role} jobs in ${city} — matched to your CV`,
    description: `Find ${role} jobs in ${city} and get matched to the best ones for your CV in seconds — ranked by AI, no account, nothing stored. Free.`,
    alternates: { canonical: `/jobs/${slug}` },
  };
}

function fmtSalary(min?: number, max?: number): string {
  if (!min && !max) return "";
  const f = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);
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

  const { jobs, total } = await searchLandingJobs(role, city);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-2xl font-extrabold tracking-tight transition-colors group">
            <span className="text-teal">drop</span><span className="text-white group-hover:text-teal">mycv</span><span className="text-teal">.app</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
            {role} jobs in {city}
          </h1>
          <p className="text-slate-500">
            {total > 0
              ? `Browsing live ${role} roles in ${city}. `
              : `Looking for ${role} roles in ${city}? `}
            Instead of scrolling endlessly, drop your CV and we&apos;ll rank the best matches for{" "}
            <em>your</em> skills in seconds — across Seek, LinkedIn, Indeed and more. No account,
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
                const salary = fmtSalary(j.salaryMin, j.salaryMax);
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
              Listings via Adzuna, refreshed daily. Drop your CV above to search all six of our
              sources and get them ranked for you.
            </p>
          </div>
        )}

        {/* Secondary internal links for crawlability */}
        <div className="pt-6 border-t border-slate-100 text-sm text-slate-500">
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
