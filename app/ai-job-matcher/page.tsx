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
          <li><strong>Many sources, one shortlist.</strong>{" "}It searches multiple job-search providers and company career pages at once, not a single board.</li>
          <li><strong>A match score and reason</strong>{" "}on every role — no black box.</li>
          <li><strong>Private by design.</strong>{" "}No account, no stored CV, no recruiter database. Your contact details are stripped in your browser first.</li>
          <li><strong>Free.</strong>{" "}Matching costs nothing; an optional <Link href="/cv-review" className="text-teal hover:underline">AI CV review</Link>{" "}is A$9.</li>
        </ul>

        <h2 className="text-xl font-semibold text-navy pt-2">How your match score works</h2>
        <p>
          Each role is scored out of 100 so the strongest fits rise to the top. There&apos;s no black
          box — the score weighs six things:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Title alignment</strong> — how closely the role matches what you do or would consider</li>
          <li><strong>Skills overlap</strong> — how many of your skills the role actually calls for</li>
          <li><strong>Seniority fit</strong> — whether the level suits your experience, neither too junior nor too senior</li>
          <li><strong>Location fit</strong> — whether it&apos;s in or near your location, or remote</li>
          <li><strong>Industry &amp; relevance</strong> — sector fit and other context from your CV</li>
          <li><strong>Recency</strong> — fresher listings rank higher, since stale ones are likelier already filled</li>
        </ul>
        <p>
          Every match shows a one-line reason, so you see <em>why</em>{" "}it scored as it did before you
          click. Treat it as a strong starting point — always read the original listing before applying.
        </p>

        <h2 className="text-xl font-semibold text-navy pt-2">AI matcher vs a chatbot</h2>
        <p>
          You could paste your CV into a general chatbot and ask for job ideas — but it has no access
          to the live job market and can&apos;t tell you which real, current roles you match or what
          they pay. dropmycv is connected to live listings, so the matches (and the keyword gaps in
          the paid review) reflect what employers are actually hiring for right now.
        </p>

        <h2 className="text-xl font-semibold text-navy pt-2">AI job matcher vs job board vs chatbot</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="p-2.5 font-medium text-slate-400"></th>
                <th className="p-2.5 font-semibold text-navy">AI job matcher</th>
                <th className="p-2.5 font-semibold text-slate-500">Job board</th>
                <th className="p-2.5 font-semibold text-slate-500">Chatbot</th>
              </tr>
            </thead>
            <tbody>
              {[
                { f: "Reads your whole CV", a: "Yes", b: "No — you type keywords", c: "Yes" },
                { f: "Knows live, current jobs", a: "Yes", b: "Yes", c: "No" },
                { f: "Ranks roles to your skills", a: "Yes, with reasons", b: "Keyword match only", c: "No" },
                { f: "Finds adjacent roles you'd miss", a: "Yes", b: "Rarely", c: "Sometimes" },
                { f: "Needs no account / private", a: "Yes (dropmycv)", b: "Usually no", c: "Varies" },
              ].map((r, i) => (
                <tr key={r.f} className={i % 2 ? "" : "bg-slate-50/40"}>
                  <td className="p-2.5 text-slate-600 font-medium align-top">{r.f}</td>
                  <td className="p-2.5 text-slate-700 align-top">{r.a}</td>
                  <td className="p-2.5 text-slate-500 align-top">{r.b}</td>
                  <td className="p-2.5 text-slate-500 align-top">{r.c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400">
          AI matching is a starting point — always read the original listing and use your own
          judgement before applying.
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
