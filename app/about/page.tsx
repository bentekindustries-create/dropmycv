import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — who's behind dropmycv",
  description:
    "dropmycv is a privacy-first job matcher built by an independent Australian developer. No accounts, no stored CVs, no recruiter database — here's who's behind it and why it exists.",
  alternates: { canonical: "/about" },
};

export default function About() {
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
        <article className="space-y-6 text-slate-600 leading-relaxed">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
            About dropmycv
          </h1>
          <p className="text-lg text-slate-500">
            A private way to find the jobs your CV already matches — built by an independent
            Australian developer, not a data company.
          </p>

          <h2 className="text-xl font-semibold text-navy pt-2">Why it exists</h2>
          <p>
            Finding a job usually means handing your CV to sites that make you create an account,
            store your details, and monetise through recruiter products, advertising and data-driven
            services. dropmycv was built on a simple idea: <strong>you shouldn&apos;t have to give up
            your privacy to find work.</strong>{" "}Your CV is read in your browser, your contact details are
            stripped before anything is sent, and nothing is stored — there&apos;s no database to
            sell or leak.
          </p>

          <h2 className="text-xl font-semibold text-navy pt-2">Who&apos;s behind it</h2>
          <p>
            dropmycv is made by an independent Australian developer, operating as{" "}
            <strong>BenTek Industries</strong>. It&apos;s a focused, self-funded product — not a
            venture-backed platform trying to maximise data collection. That independence is exactly
            what lets it stay account-free and storage-free.
          </p>
          <p className="border-l-2 border-teal/40 pl-4 italic text-slate-500">
            &ldquo;I built dropmycv because job search has become too noisy, too manual and too
            data-hungry. The goal is simple: help people see where they fit in the live market —
            without turning their CV into a recruiter lead.&rdquo;
          </p>

          <h2 className="text-xl font-semibold text-navy pt-2">What we do — and don&apos;t</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>We do</strong>{" "}match your CV to live roles across many job sources and rank them with AI, for free.</li>
            <li><strong>We do</strong>{" "}offer two optional paid extras — a one-off A$9 AI CV review, and a A$19 Application Pack tailored to a specific role — both checked against the live jobs you match. They&apos;re how we cover costs; you never have to buy either to get your matches.</li>
            <li><strong>We don&apos;t</strong>{" "}require an account, store your CV, build a recruiter-searchable profile, use cookies, or sell your data.</li>
          </ul>

          <h2 className="text-xl font-semibold text-navy pt-2">Honest status</h2>
          <p>
            dropmycv is live and actively improved. It&apos;s a young product, so if something looks
            off or you have an idea, we genuinely want to hear it.
          </p>

          <h2 className="text-xl font-semibold text-navy pt-2">Contact &amp; support</h2>
          <p>
            Email <a href="mailto:info@dropmycv.app" className="text-teal hover:underline">info@dropmycv.app</a> —
            a real person reads every message. For refunds on a CV review, just ask: under Australian
            Consumer Law you&apos;re covered. See our{" "}
            <Link href="/privacy" className="text-teal hover:underline">Privacy Policy</Link>{" "}and{" "}
            <Link href="/terms" className="text-teal hover:underline">Terms</Link>.
          </p>

          <div className="not-prose rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-6 text-center mt-8">
            <Link
              href="/#upload"
              className="inline-block text-sm px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
            >
              Match my CV — free →
            </Link>
          </div>
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
