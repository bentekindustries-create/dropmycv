import Link from "next/link";
import type { Metadata } from "next";
import { PrivacyFlow } from "@/components/privacy-flow";
import { StripDemo } from "@/components/strip-demo";

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
            <strong>stored on their servers</strong>. Your name, email, phone number, work history
            and salary expectations become a record they hold — and many platforms monetise through
            recruiter products, promoted listings, advertising, data-driven services or related
            employer tools. Once your CV is in, you rarely control where it goes.
          </p>

          <h2 className="text-xl font-semibold text-navy pt-2">A more private way to find a job</h2>
          <p>
            dropmycv was built to flip that model. There&apos;s <strong>no account and no sign-up</strong>,
            and your CV never sits on our servers:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Read in your browser.</strong>{" "}Your CV file is opened and parsed locally on
              your own device — the file itself is never uploaded.
            </li>
            <li>
              <strong>Contact details stripped first.</strong>{" "}Your email, phone number and web
              links are removed before any text is sent. Your name stays in the CV text used to
              find matches, but it&apos;s never stored.
            </li>
            <li>
              <strong>Nothing stored.</strong>{" "}Each search is stateless. There&apos;s no profile, no
              saved CV, and no recruiter database — we have nothing to sell or leak.
            </li>
            <li>
              <strong>No cookies or cross-site tracking.</strong>{" "}We use only privacy-preserving,
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

          <h2 className="text-xl font-semibold text-navy pt-2">How your CV flows through dropmycv</h2>
          <PrivacyFlow />
          <StripDemo />

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

          <h2 className="text-xl font-semibold text-navy pt-2">What &ldquo;nothing stored&rdquo; actually means</h2>
          <p>
            It&apos;s worth being precise, because trust depends on it. When you use dropmycv:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The CV <strong>file</strong>{" "}never leaves your device — it&apos;s parsed in your browser.</li>
            <li>Your <strong>email, phone number and web links</strong>{" "}are removed from the text before anything is sent.</li>
            <li>The remaining text (which still includes your name and experience) is sent over an encrypted connection <strong>only to generate your matches</strong>, then discarded. It isn&apos;t saved to a database, logged, or used to build a profile.</li>
            <li>There are <strong>no accounts and no cookies</strong>, so there&apos;s nothing tying one search to another or to you.</li>
          </ul>
          <p>
            In other words: we designed the service so there&apos;s nothing for us to sell, leak, or
            be compelled to hand over. The full detail is in our{" "}
            <Link href="/privacy" className="text-teal hover:underline">Privacy Policy</Link>.
          </p>

          <h2 className="text-xl font-semibold text-navy pt-2">Who private job search is for</h2>
          <p>
            It matters most if you&apos;re <strong>job-searching while employed</strong>{" "}and
            don&apos;t want your current employer or their recruiters stumbling across your CV in a
            database; if you&apos;re <strong>senior</strong>{" "}and tired of being harvested by agencies;
            or if you simply <strong>don&apos;t want your data sold</strong>. You still get the upside
            — see{" "}
            <Link href="/what-jobs-can-i-get-with-my-cv" className="text-teal hover:underline">what jobs you can get with your CV</Link>{" "}
            or jump straight to{" "}
            <Link href="/match-my-cv-to-jobs" className="text-teal hover:underline">matching your CV to jobs</Link>.
          </p>

          <h2 className="text-xl font-semibold text-navy pt-2">Frequently asked</h2>
          <p>
            <strong>Do you store my CV?</strong>{" "}No. It&apos;s read in your browser and the stripped
            text is processed only to return matches, then discarded. See our{" "}
            <Link href="/privacy" className="text-teal hover:underline">Privacy Policy</Link>.
          </p>
          <p>
            <strong>Do recruiters see my CV?</strong>{" "}No. There&apos;s no candidate database — we
            don&apos;t store your CV, so there&apos;s nothing for a recruiter to search.
          </p>
          <p>
            <strong>Do I need an account?</strong>{" "}No — there&apos;s no sign-up or login of any kind.
          </p>
          <p>
            <strong>Is it free?</strong>{" "}Yes, matching is free. Two optional paid extras exist: a
            one-off A$9 AI{" "}
            <Link href="/cv-review" className="text-teal hover:underline">CV review</Link>, and a
            A$19 Application Pack tailored to a specific role you matched to. You can also try a{" "}
            <Link href="/cv-checker" className="text-teal hover:underline">free CV check</Link>{" "}first.
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
