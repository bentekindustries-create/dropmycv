import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "dropmycv vs traditional job boards — a private, AI-matched alternative",
  description:
    "How dropmycv compares to job boards like Indeed, Seek and LinkedIn: no account, nothing stored, six sources searched at once and ranked by AI. A faster, more private way to find jobs.",
  alternates: { canonical: "/compare/dropmycv-vs-job-boards" },
};

const ROWS: { feature: string; us: string; them: string }[] = [
  { feature: "Account / sign-up required", us: "No — drop your CV and go", them: "Usually yes" },
  { feature: "Your CV stored on their servers", us: "No — read in your browser, nothing stored", them: "Typically yes, indefinitely" },
  { feature: "Sources searched", us: "Six at once (Seek, LinkedIn, Indeed, Greenhouse, Lever & more)", them: "Usually one" },
  { feature: "Ranked to your actual skills", us: "Yes — AI match score + reason per role", them: "Keyword search; you do the filtering" },
  { feature: "Cookies / cross-site tracking", us: "None", them: "Commonly yes" },
  { feature: "Cost to you", us: "Free (optional A$9 CV review)", them: "Free" },
  { feature: "How they make money", us: "The optional CV review", them: "Selling recruiter access to candidates, and ads" },
];

export default function Compare() {
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
            dropmycv vs traditional job boards
          </h1>
          <p className="text-slate-500">
            Big job boards like Indeed, Seek and LinkedIn have huge inventory — but they make you
            create an account, keep your data, and leave you to wade through hundreds of results one
            source at a time. dropmycv takes a different approach: account-free, private, and
            AI-ranked across multiple sources at once.
          </p>
        </div>

        {/* Comparison table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="p-3 font-semibold text-slate-500"></th>
                <th className="p-3 font-semibold text-navy">dropmycv</th>
                <th className="p-3 font-semibold text-slate-500">Typical job board</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={r.feature} className={i % 2 ? "bg-white" : "bg-slate-50/40"}>
                  <td className="p-3 text-slate-600 font-medium align-top">{r.feature}</td>
                  <td className="p-3 text-slate-700 align-top">{r.us}</td>
                  <td className="p-3 text-slate-500 align-top">{r.them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400">
          Comparison reflects how most major job boards typically operate; individual platforms vary.
          We don&apos;t replace job boards — we search across them (and company career pages) and rank
          the results for you.
        </p>

        {/* When each wins */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <p className="font-semibold text-navy mb-1">Choose a job board when…</p>
            <p className="text-sm text-slate-500">You want to browse a single platform&apos;s full inventory, set up saved searches, or build a public profile recruiters can find.</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <p className="font-semibold text-navy mb-1">Choose dropmycv when…</p>
            <p className="text-sm text-slate-500">You want a fast, ranked shortlist across many sources, without an account, and without your CV being stored or your data sold.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-6 text-center">
          <h2 className="text-lg font-serif font-bold text-navy mb-1">See your matches in seconds</h2>
          <p className="text-sm text-slate-500 mb-4">Drop your CV — free, no account, nothing stored.</p>
          <Link
            href="/#upload"
            className="inline-block text-sm px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
          >
            Match my CV — free →
          </Link>
        </div>

        <p className="text-sm text-slate-500">
          More:{" "}
          <Link href="/private-job-search" className="text-teal hover:underline">how we keep your job search private</Link>{" "}
          ·{" "}
          <Link href="/cv-review" className="text-teal hover:underline">get an AI review of your CV</Link>
        </p>
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
