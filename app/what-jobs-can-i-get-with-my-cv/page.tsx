import Link from "next/link";
import type { Metadata } from "next";
import { MarketingShell, CtaBlock } from "@/components/marketing-shell";

export const metadata: Metadata = {
  title: "What jobs can I get with my CV?",
  description:
    "Not sure what roles your experience qualifies you for? Drop your CV and instantly see the live jobs you actually match — ranked by AI, with the reasons. No account, nothing stored. Free.",
  alternates: { canonical: "/what-jobs-can-i-get-with-my-cv" },
};

export default function WhatJobs() {
  return (
    <MarketingShell>
      <article className="space-y-6 text-slate-600 leading-relaxed">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
          What jobs can I get with my CV?
        </h1>
        <p className="text-lg text-slate-500">
          It&apos;s one of the hardest questions in a job search — and guessing keywords on a job
          board won&apos;t answer it. The fastest way to find out is to let your CV show you.
        </p>

        <CtaBlock label="Find out — match my CV free →" sub="See the live roles your experience matches, in seconds." />

        <h2 className="text-xl font-semibold text-navy pt-2">Let your experience point the way</h2>
        <p>
          Most people undersell themselves because they only search for their current job title. But
          your CV holds skills and achievements that map to <em>many</em>{" "}roles — often ones you
          wouldn&apos;t think to search for. dropmycv reads your whole CV and surfaces live roles you
          genuinely match, each with a score and a reason, so you can see the realistic range of
          what you could move into right now.
        </p>

        <h2 className="text-xl font-semibold text-navy pt-2">Roles your CV might reveal</h2>
        <p>
          The same experience often opens more doors than you&apos;d expect. A few examples of the
          adjacent roles a CV can surface:
        </p>
        <div className="space-y-3">
          {[
            { type: "Project Manager", roles: "Project Manager · Delivery Lead · Program Coordinator · Implementation Manager · Customer Success Manager" },
            { type: "Registered Nurse", roles: "Registered Nurse · Clinical Nurse · Aged Care Coordinator · Practice Nurse · Case Manager" },
            { type: "Marketing Coordinator", roles: "Marketing Coordinator · Digital Marketing Specialist · Content Manager · Campaign Manager · Brand Coordinator" },
            { type: "Accountant", roles: "Accountant · Financial Analyst · Management Accountant · Finance Business Partner · Bookkeeper" },
          ].map((ex) => (
            <div key={ex.type} className="bg-white rounded-xl border border-slate-100 p-4 text-sm">
              <p className="font-semibold text-navy">A {ex.type} CV might surface:</p>
              <p className="text-slate-500 mt-0.5">{ex.roles}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Illustrative — your actual matches depend on your CV and live demand.
        </p>

        <h2 className="text-xl font-semibold text-navy pt-2">Especially useful if you&apos;re…</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Changing careers</strong> — see which roles your transferable skills already qualify you for.</li>
          <li><strong>Returning to work</strong> — find roles that match your prior experience without trawling boards.</li>
          <li><strong>Unsure of your level</strong> — the match scores show where you fit, from mid to senior.</li>
          <li><strong>Just curious</strong> — check your options privately, without recruiters seeing your CV.</li>
        </ul>

        <h2 className="text-xl font-semibold text-navy pt-2">See the reasons, not just a list</h2>
        <p>
          Every match comes with a plain-English reason — which of your skills line up, whether the
          seniority fits, and where the role is. If something&apos;s holding your CV back, a{" "}
          <Link href="/cv-checker" className="text-teal-ink hover:underline">free CV check</Link>{" "}gives
          you an instant score, and the full{" "}
          <Link href="/cv-review" className="text-teal-ink hover:underline">AI CV review</Link> (A$9)
          shows the exact keyword gaps your matched roles want.
        </p>

        <h2 className="text-xl font-semibold text-navy pt-2">No CV handy?</h2>
        <p>
          You can also{" "}
          <Link href="/" className="text-teal-ink hover:underline">answer a few quick questions</Link>{" "}
          instead, and we&apos;ll find roles from your answers. Either way: no account, and nothing
          stored.
        </p>

        <CtaBlock label="Show me my matches — free →" sub="Drop your CV and find out what you can get." />
      </article>
    </MarketingShell>
  );
}
