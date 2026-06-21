import Link from "next/link";
import type { Metadata } from "next";
import { MarketingShell, CtaBlock } from "@/components/marketing-shell";

export const metadata: Metadata = {
  title: "AI job matcher — find jobs that fit your CV",
  description:
    "An AI job matcher reads your CV and ranks live roles by how well they fit your real skills — instead of you searching keywords. dropmycv does it free, with no account and nothing stored.",
  alternates: { canonical: "/ai-job-matcher" },
};

export default function AiJobMatcher() {
  return (
    <MarketingShell>
      <article className="space-y-6 text-slate-600 leading-relaxed">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
          AI job matcher
        </h1>
        <p className="text-lg text-slate-500">
          An AI job matcher does the searching for you: it reads your CV, understands your skills and
          seniority, and ranks live roles by how well they actually fit — so you get a shortlist
          instead of a search results page.
        </p>

        <CtaBlock />

        <h2 className="text-xl font-semibold text-navy pt-2">How an AI job matcher works</h2>
        <p>
          Traditional job search is keyword-based: you type a title, the board returns everything
          containing those words, and you filter by hand. An AI matcher works the other way around.
          It extracts the meaning of your CV — your real responsibilities, tools and level — then
          scores live roles against it, factoring in skills overlap, seniority fit and location. The
          result is ranked by relevance to <em>you</em>, with a reason for each match.
        </p>

        <h2 className="text-xl font-semibold text-navy pt-2">What makes dropmycv&apos;s matcher different</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Many sources, one shortlist.</strong> It searches multiple job-search providers and company career pages at once, not a single board.</li>
          <li><strong>A match score and reason</strong> on every role — no black box.</li>
          <li><strong>Private by design.</strong> No account, no stored CV, no recruiter database. Your contact details are stripped in your browser first.</li>
          <li><strong>Free.</strong> Matching costs nothing; an optional <Link href="/cv-review" className="text-teal hover:underline">AI CV review</Link> is A$9.</li>
        </ul>

        <h2 className="text-xl font-semibold text-navy pt-2">AI matcher vs a chatbot</h2>
        <p>
          You could paste your CV into a general chatbot and ask for job ideas — but it has no access
          to the live job market and can&apos;t tell you which real, current roles you match or what
          they pay. dropmycv is connected to live listings, so the matches (and the keyword gaps in
          the paid review) reflect what employers are actually hiring for right now.
        </p>

        <p className="text-sm text-slate-500">
          Related:{" "}
          <Link href="/match-my-cv-to-jobs" className="text-teal hover:underline">match my CV to jobs</Link>{" "}
          ·{" "}
          <Link href="/private-job-search" className="text-teal hover:underline">private job search</Link>{" "}
          ·{" "}
          <Link href="/compare/dropmycv-vs-job-boards" className="text-teal hover:underline">vs job boards</Link>
        </p>

        <CtaBlock label="Try the AI job matcher — free →" sub="Drop your CV and see your ranked matches." />
      </article>
    </MarketingShell>
  );
}
