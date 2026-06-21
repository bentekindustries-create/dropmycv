import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private job search — find jobs without giving up your CV data",
  description:
    "Worried about uploading your CV online? Most job sites store your data and sell access to it. dropmycv matches you to live jobs without an account — your CV is read in your browser and never stored.",
  alternates: { canonical: "/private-job-search" },
};

export default function PrivateJobSearch() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-2xl font-extrabold tracking-tight transition-colors group">
            <span className="text-teal">drop</span><span className="text-white group-hover:text-teal">mycv</span><span className="text-teal">.app</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <article className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
            How to job-search without handing over your data
          </h1>
          <p className="text-lg text-slate-500">
            Uploading your CV shouldn&apos;t mean signing away your privacy. Here&apos;s what most
            job sites actually do with your data — and how to find roles without any of it.
          </p>

          <h2 className="text-xl font-semibold text-navy pt-2">Is it safe to upload your CV online?</h2>
          <p>
            Usually, not as safe as you&apos;d think. To use most job boards and &ldquo;AI job
            match&rdquo; tools you have to create an account and upload your CV, which is then{" "}
            <strong>stored on their servers indefinitely</strong>. Your name, email, phone number,
            work history and salary expectations become a record they hold — and many platforms make
            money by giving recruiters paid access to that database, or by marketing to you. Once
            your CV is in, you rarely control where it goes.
          </p>

          <h2 className="text-xl font-semibold text-navy pt-2">A more private way to find a job</h2>
          <p>
            dropmycv was built to flip that model. There&apos;s <strong>no account and no sign-up</strong>,
            and your CV never sits on our servers:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Read in your browser.</strong> Your CV file is opened and parsed locally on
              your own device — the file itself is never uploaded.
            </li>
            <li>
              <strong>Contact details stripped first.</strong> Your email, phone number and web
              links are removed before any text is sent. Your name stays in the CV text used to
              find matches, but it&apos;s never stored.
            </li>
            <li>
              <strong>Nothing stored.</strong> Each search is stateless. There&apos;s no profile, no
              saved CV, and no recruiter database — we have nothing to sell or leak.
            </li>
            <li>
              <strong>No cookies or cross-site tracking.</strong> We use only privacy-preserving,
              anonymous visitor counts.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-navy pt-2">You still get better results</h2>
          <p>
            Privacy doesn&apos;t mean worse matches. dropmycv searches{" "}
            <strong>across multiple job-search providers and company career pages at once</strong> —
            surfacing roles from Seek, LinkedIn, Indeed, Greenhouse, Lever, Jora and more — and uses
            AI to rank them against your actual skills, so you get a short, relevant shortlist with a
            match score and reason for each role, instead of hundreds of listings to wade through.
          </p>

          <div className="not-prose rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-6 text-center my-8">
            <h2 className="text-lg font-serif font-bold text-navy mb-1">Try a private job search</h2>
            <p className="text-sm text-slate-500 mb-4">Drop your CV, get matched in seconds. No account, nothing stored.</p>
            <Link
              href="/#upload"
              className="inline-block text-sm px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
            >
              Match my CV — free →
            </Link>
          </div>

          <h2 className="text-xl font-semibold text-navy pt-2">Frequently asked</h2>
          <p>
            <strong>Do you store my CV?</strong> No. It&apos;s read in your browser and the stripped
            text is processed only to return matches, then discarded. See our{" "}
            <Link href="/privacy" className="text-teal hover:underline">Privacy Policy</Link>.
          </p>
          <p>
            <strong>Do I need an account?</strong> No — there&apos;s no sign-up or login of any kind.
          </p>
          <p>
            <strong>Is it free?</strong> Yes, matching is free. An optional AI{" "}
            <Link href="/cv-review" className="text-teal hover:underline">CV review</Link> is
            available for a one-off A$9.
          </p>
        </article>
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
