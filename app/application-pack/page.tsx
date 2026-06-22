import Link from "next/link";
import type { Metadata } from "next";
import { MarketingShell, CtaBlock } from "@/components/marketing-shell";

export const metadata: Metadata = {
  title: "Application Pack — apply faster to one of your matched jobs · A$19",
  description:
    "Pick one role from your matches and get a tailored application pack: a cover-letter draft, reworded CV bullets, the keywords to include, and likely interview questions. One-off A$19, instant download, nothing stored.",
  alternates: { canonical: "/application-pack" },
};

const WHATS_IN = [
  { icon: "🎯", t: "Your positioning angle", d: "Why you're a strong fit for this specific role, drawn from your real experience" },
  { icon: "✉️", t: "A cover-letter draft", d: "A complete, ready-to-edit letter written for this role and company" },
  { icon: "✍️", t: "Reworded CV bullets", d: "Your experience rewritten to foreground what this listing actually values" },
  { icon: "🔍", t: "Keywords to include", d: "The skills and terms this listing screens for that you should make sure appear" },
  { icon: "💬", t: "Likely interview questions", d: "Questions you can expect for this role — with how to answer each using your background" },
  { icon: "✅", t: "Application tips", d: "Concrete, role-specific pointers for standing out in this application" },
];

const STEPS = [
  { n: "1", t: "Match your CV — free", d: "Drop your CV and get your ranked shortlist of live roles." },
  { n: "2", t: "Pick one role", d: "Choose the job from your matches you most want to land." },
  { n: "3", t: "Get your pack — A$19", d: "We build it instantly, tailored to that exact listing and your CV." },
  { n: "4", t: "Download & apply", d: "Print, save as PDF, or have a copy emailed — then apply with confidence." },
];

export default function ApplicationPackLanding() {
  return (
    <MarketingShell>
      <div className="space-y-12">
        {/* Hero */}
        <section className="text-center space-y-3">
          <p className="text-xs font-semibold text-teal uppercase tracking-widest">Application Pack · A$19</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
            Apply faster to one of your matched jobs
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            You&apos;ve seen the roles you match. Now pick the one you really want, and we&apos;ll
            build a <span className="font-medium text-navy">complete, tailored application pack</span>{" "}
            for that exact job — cover letter, CV tweaks, keywords and interview prep — in seconds.
          </p>
          <CtaBlock label="Match my CV — free →" sub="The pack is built after you match — start with a free CV match." />
        </section>

        {/* Why it's different */}
        <section className="rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-6">
          <h2 className="text-lg font-serif font-bold text-navy mb-2">Built for one specific job — not generic advice</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            A generic cover-letter template or a chatbot doesn&apos;t know the role you&apos;re
            applying for. Your Application Pack is generated from{" "}
            <span className="font-medium text-navy">the actual listing you matched to and your real
            CV</span>, so every line speaks to what that employer is asking for right now. It only
            claims things your CV genuinely supports — no invented achievements.
          </p>
        </section>

        {/* What's in it */}
        <section>
          <h2 className="text-lg font-serif font-bold text-navy text-center mb-5">What&apos;s in your pack</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {WHATS_IN.map((f) => (
              <div key={f.t} className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="font-semibold text-slate-700">{f.icon} {f.t}</p>
                <p className="text-slate-500 mt-1">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sample peek */}
        <section>
          <h2 className="text-lg font-serif font-bold text-navy text-center mb-1">A peek at the output</h2>
          <p className="text-xs text-slate-400 text-center mb-5">Example — yours is written for your CV and your chosen role</p>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 text-sm">
            <div>
              <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-2">Reworded CV bullet</p>
              <p className="text-slate-400 line-through">Managed project stakeholders.</p>
              <p className="text-slate-700 font-medium mt-1">
                Led weekly governance with 12 internal and external stakeholders, keeping a $2.4m
                delivery program on track and cutting decision delays.
              </p>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-2">Likely interview question</p>
              <p className="text-slate-700 font-medium">&ldquo;Tell me about a time a project was slipping — what did you do?&rdquo;</p>
              <p className="text-slate-500 mt-1">
                Lead with the $2.4m program: name the early warning signs you spotted, the governance
                cadence you introduced, and the measurable recovery.
              </p>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-2">Keywords to include for this listing</p>
              <div className="flex flex-wrap gap-1.5">
                {["Stakeholder Management", "Risk Management", "PRINCE2", "Budget Management", "Change Management"].map((k) => (
                  <span key={k} className="text-xs font-medium text-teal bg-teal-light px-2.5 py-1 rounded-full">{k}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-lg font-serif font-bold text-navy text-center mb-5">How it works</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-9 h-9 mx-auto rounded-full bg-navy text-white font-bold flex items-center justify-center mb-2">{s.n}</div>
                <p className="font-semibold text-slate-700 text-sm">{s.t}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* A$9 vs A$19 */}
        <section>
          <h2 className="text-lg font-serif font-bold text-navy text-center mb-5">Which one do I need?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">A$9 · CV Review</p>
              <p className="font-serif font-bold text-navy mt-1">Sharpen your CV overall</p>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Best when you&apos;re applying across several similar roles and want your CV stronger
                for all of them — score, keyword gaps, rewrites and priorities. See the{" "}
                <Link href="/cv-review" className="text-teal hover:underline">CV review</Link>.
              </p>
            </div>
            <div className="rounded-xl border-2 border-[#c8ecea] bg-teal-light/30 p-5">
              <p className="text-xs font-semibold text-teal uppercase tracking-widest">A$19 · Application Pack</p>
              <p className="font-serif font-bold text-navy mt-1">Get ready for one specific job</p>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Best when you&apos;ve found the role you really want and you&apos;re about to apply —
                a cover letter, tailored bullets, keywords and interview prep for that exact listing.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing + CTA */}
        <section className="text-center space-y-3">
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            <span className="font-medium text-navy">One-off A$19. No subscription. Nothing stored.</span>{" "}
            Paid securely via Stripe — we never see your card details. You download the pack instantly,
            with an optional emailed copy. If a pack isn&apos;t delivered or there&apos;s a genuine
            issue, email{" "}
            <a href="mailto:info@dropmycv.app" className="text-teal hover:underline">info@dropmycv.app</a>{" "}
            and we&apos;ll make it right in line with Australian Consumer Law.
          </p>
          <Link
            href="/#upload"
            className="inline-block text-sm px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
          >
            Match my CV to get started →
          </Link>
          <p className="text-xs text-slate-400">Free match first · pick a role · the pack is the optional A$19 add-on</p>
        </section>
      </div>
    </MarketingShell>
  );
}
