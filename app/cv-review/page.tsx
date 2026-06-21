import Link from "next/link";
import type { Metadata } from "next";
import { CvReviewCard } from "@/components/cv-review";
import type { CvReview } from "@/lib/types";

export const metadata: Metadata = {
  title: "AI CV Review — checked against the live jobs you match to",
  description:
    "Get an instant expert AI review of your CV, checked against the real, live roles you actually match. See the exact keyword gaps, stronger rewrites and priorities. One-off A$9 — nothing stored.",
  alternates: { canonical: "/cv-review" },
};

const SAMPLE: CvReview = {
  overallScore: 64,
  verdict:
    "Real experience and the right skills are here, but generic phrasing and a few missing keywords are holding this CV back from the senior roles it's matching to.",
  strengths: [
    "Strong, relevant tech stack (React, Node.js, AWS) that aligns with the matched roles",
    "8 years of experience clearly stated up front",
    "Fintech domain experience — a plus for several of your matches",
  ],
  improvements: [
    { issue: "Bullets describe duties, not impact", fix: "Quantify outcomes — users served, latency cut, revenue or time saved" },
    { issue: "No evidence of senior scope", fix: "Add technical leadership, mentoring or system-design examples" },
    { issue: "Filler phrases ('various tasks', 'helped the team')", fix: "Replace with specific, measurable accomplishments" },
  ],
  atsKeywords: {
    present: ["React", "Node.js", "AWS", "TypeScript", "PostgreSQL"],
    missing: ["CI/CD", "Kubernetes", "System Design", "Mentoring", "REST/GraphQL APIs"],
  },
  rewrites: [
    {
      before: "Responsible for the frontend.",
      after:
        "Owned the React/TypeScript frontend for a fintech platform, defining the component standards adopted across the engineering team.",
    },
    {
      before: "Worked on various backend tasks.",
      after:
        "Built and scaled Node.js services handling 2M+ daily requests, cutting p95 latency by 40%.",
    },
  ],
  topPriorities: [
    "Rewrite every bullet to lead with a quantified result",
    "Add the senior-level signals (leadership, system design) your matched roles ask for",
    "Work in the missing keywords — Kubernetes, CI/CD, system design",
  ],
};

// A non-tech sample so the page doesn't read as tech-only
const SAMPLE_NONTECH: CvReview = {
  overallScore: 71,
  verdict:
    "A capable marketing CV with clear campaign experience — but it under-sells results and misses some keywords the roles you matched are asking for.",
  strengths: [
    "Clear progression from coordinator to manager over 6 years",
    "Hands-on across the channels employers want — SEO, content, social and email",
    "One genuinely strong, quantified result (a 38% lift in qualified leads)",
  ],
  improvements: [
    { issue: "Most achievements aren't quantified", fix: "Add numbers — budget managed, % growth, leads, ROI — to every campaign bullet" },
    { issue: "No mention of analytics tooling", fix: "Name the platforms you use (GA4, HubSpot, Meta Ads) — recruiters and ATS scan for them" },
    { issue: "Summary is generic", fix: "Lead with your strongest result and the kind of role you want" },
  ],
  atsKeywords: {
    present: ["SEO", "Content Marketing", "Social Media", "Email Marketing", "Brand"],
    missing: ["Google Analytics (GA4)", "HubSpot", "Marketing Automation", "Paid Media / SEM", "Conversion Rate Optimisation"],
  },
  rewrites: [
    {
      before: "Managed social media accounts.",
      after:
        "Grew the brand's organic social audience 45% in 12 months and drove a 22% increase in referral traffic across LinkedIn and Instagram.",
    },
    {
      before: "Helped with email campaigns.",
      after:
        "Owned a 20k-subscriber email program, lifting open rates from 18% to 31% through segmentation and A/B testing.",
    },
  ],
  topPriorities: [
    "Quantify every campaign with a number or %",
    "Add the analytics & automation tools your matched roles list",
    "Rewrite the summary to lead with your best result",
  ],
};

export default function CvReviewLanding() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-2xl font-extrabold tracking-tight transition-colors group">
            <span className="text-teal">drop</span><span className="text-white group-hover:text-teal">mycv</span><span className="text-teal">.app</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-3">
          <p className="text-xs font-semibold text-teal uppercase tracking-widest">AI CV review · A$9</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
            Know exactly why you&apos;re not getting interviews
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Get an instant, expert AI review of your CV — checked against the{" "}
            <span className="font-medium text-navy">real, live roles you actually match</span>. Not
            generic feedback: the exact keywords those jobs want, the lines to rewrite, and what to
            fix first.
          </p>
          <div className="pt-2">
            <Link
              href="/#upload"
              className="inline-block text-sm px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
            >
              Drop your CV to start →
            </Link>
            <p className="text-xs text-slate-400 mt-2">Free match first · review is an optional A$9 add-on</p>
          </div>
        </section>

        {/* Why us, not a chatbot */}
        <section className="rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-6">
          <h2 className="text-lg font-serif font-bold text-navy mb-2">
            Why not just paste it into a chatbot?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            A chatbot can give you generic CV tips — but it has no idea which jobs you&apos;re
            actually applying for or what&apos;s in demand right now. We do. Your review is built
            from the <span className="font-medium text-navy">live job listings you just matched
            to</span>, so the keyword gaps and fixes reflect real, current market demand — not
            guesswork. That&apos;s something you can&apos;t get anywhere else.
          </p>
        </section>

        {/* What you get */}
        <section>
          <h2 className="text-lg font-serif font-bold text-navy text-center mb-5">
            What you get for A$9
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              { icon: "📊", t: "An honest score & verdict", d: "Where your CV stands for the roles you're targeting" },
              { icon: "🔍", t: "Real ATS keyword gaps", d: "The exact skills your matched jobs want that you're missing" },
              { icon: "✍️", t: "Stronger rewrites", d: "Weak lines from your CV, rewritten to land" },
              { icon: "🎯", t: "A priority action list", d: "The highest-impact fixes, in order" },
            ].map((f) => (
              <div key={f.t} className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="font-semibold text-slate-700">{f.icon} {f.t}</p>
                <p className="text-slate-500 mt-1">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sample */}
        <section>
          <h2 className="text-lg font-serif font-bold text-navy text-center mb-1">
            Here&apos;s what a review looks like
          </h2>
          <p className="text-xs text-slate-400 text-center mb-5">Samples — yours is tailored to your CV and your live matches</p>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Sample 1 — a software engineer CV</p>
          <CvReviewCard review={SAMPLE} />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 mt-8">Sample 2 — a marketing CV</p>
          <CvReviewCard review={SAMPLE_NONTECH} />
        </section>

        {/* Guarantee + CTA */}
        <section className="text-center space-y-3">
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            <span className="font-medium text-navy">One-off A$9. No subscription. Nothing stored.</span>{" "}
            Paid securely via Stripe — we never see your card details. If a review isn&apos;t delivered
            or there&apos;s a genuine issue, email{" "}
            <a href="mailto:info@dropmycv.app" className="text-teal hover:underline">info@dropmycv.app</a>{" "}
            and we&apos;ll make it right in line with Australian Consumer Law.
          </p>
          <Link
            href="/#upload"
            className="inline-block text-sm px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
          >
            Match my CV &amp; get my review →
          </Link>
        </section>
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
