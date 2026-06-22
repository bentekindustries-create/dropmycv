import Link from "next/link";
import type { Metadata } from "next";
import { MarketingShell, CtaBlock } from "@/components/marketing-shell";

export const metadata: Metadata = {
  title: "Match my CV to jobs — instant AI job matching",
  description:
    "Upload your CV and instantly see the live jobs it matches — ranked by AI against your real skills, with a match score and reason for each. No account, nothing stored. Free.",
  alternates: { canonical: "/match-my-cv-to-jobs" },
};

export default function MatchMyCv() {
  return (
    <MarketingShell>
      <article className="space-y-6 text-slate-600 leading-relaxed">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
          Match my CV to jobs
        </h1>
        <p className="text-lg text-slate-500">
          Instead of typing keywords into a job board and guessing, let your CV do the searching.
          Drop it in and dropmycv ranks live roles against your actual experience in seconds.
        </p>

        <CtaBlock />

        <h2 className="text-xl font-semibold text-navy pt-2">How CV-to-job matching works</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>You drop your CV.</strong>{" "}It&apos;s read in your browser, and your email, phone
            and links are stripped before anything is sent.
          </li>
          <li>
            <strong>We read your skills and experience.</strong>{" "}An AI model extracts your roles,
            skills and seniority — no forms to fill in.
          </li>
          <li>
            <strong>We search the live market.</strong>{" "}We query multiple job-search providers and
            company career pages at once, not just one board.
          </li>
          <li>
            <strong>We rank the results for you.</strong>{" "}Each role gets a match score and a plain
            reason — &ldquo;4 of 5 skills align, right seniority, your city&rdquo; — so you spend
            time applying, not filtering.
          </li>
        </ol>

        <h2 className="text-xl font-semibold text-navy pt-2">Why match by CV instead of keywords?</h2>
        <p>
          Keyword search makes <em>you</em>{" "}do the work: you guess the right title, scroll hundreds
          of listings, and still miss roles that use different wording for what you do. Matching by
          CV flips it — the tool reads everything you&apos;ve done and finds roles that fit, including
          adjacent titles you might not have searched for. Generic CV tools tell you how your CV
          looks; dropmycv shows you how it <strong>performs against live roles</strong>.
        </p>

        <h2 className="text-xl font-semibold text-navy pt-2">How your match score works</h2>
        <p>
          Each role is scored out of 100 from your <strong>title alignment, skills overlap, seniority
          fit, location and industry relevance</strong>, with fresher listings ranked higher. Every
          match shows a one-line reason, so it&apos;s never a black box — see the full breakdown on the{" "}
          <Link href="/ai-job-matcher" className="text-teal hover:underline">AI job matcher</Link>{" "}page.
          It&apos;s a strong starting point; always read the original listing before applying.
        </p>

        <h2 className="text-xl font-semibold text-navy pt-2">Private by default</h2>
        <p>
          No account, no sign-up, and your CV is never stored. Your contact details are stripped in
          your browser, and each search is stateless — there&apos;s no profile and no recruiter
          database. Read more about{" "}
          <Link href="/private-job-search" className="text-teal hover:underline">how we keep your job search private</Link>.
        </p>

        <h2 className="text-xl font-semibold text-navy pt-2">Want to know why you&apos;re not getting interviews?</h2>
        <p>
          After matching, you can unlock an{" "}
          <Link href="/cv-review" className="text-teal hover:underline">AI CV review</Link>{" "}for a
          one-off A$9 — checked against the live jobs you matched, showing the exact keyword gaps,
          stronger rewrites and what to fix first. Or start with a{" "}
          <Link href="/cv-checker" className="text-teal hover:underline">free CV check</Link>.
        </p>

        <h2 className="text-xl font-semibold text-navy pt-2">Who it helps</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Career changers</strong> — see which roles your transferable skills already qualify you for.</li>
          <li><strong>Senior professionals</strong> — find matched roles without recruiters harvesting your CV.</li>
          <li><strong>Graduates &amp; early-career</strong> — discover entry roles that fit your degree and any experience.</li>
          <li><strong>Returning to work</strong> — match your prior experience to current openings without trawling boards.</li>
        </ul>

        <h2 className="text-xl font-semibold text-navy pt-2">FAQ</h2>
        <p><strong className="text-slate-700">Do I need an account?</strong><br />No — no sign-up or login. Drop your CV and you get matches in seconds.</p>
        <p><strong className="text-slate-700">Is my CV stored?</strong><br />No. It&apos;s read in your browser, your email/phone/links are stripped first, and the text is used only to find matches, then discarded.</p>
        <p><strong className="text-slate-700">Which countries?</strong><br />Australia, the UK, US, Canada, NZ, Singapore, Germany, France and the Netherlands — see <Link href="/jobs-in/australia" className="text-teal hover:underline">country pages</Link>.</p>
        <p><strong className="text-slate-700">Is it really free?</strong><br />Yes. The optional <Link href="/cv-review" className="text-teal hover:underline">AI CV review</Link>{" "}is A$9; everything else is free.</p>

        <CtaBlock label="Match my CV now — free →" sub="Drop your CV and see your matches in seconds." />
      </article>
    </MarketingShell>
  );
}
