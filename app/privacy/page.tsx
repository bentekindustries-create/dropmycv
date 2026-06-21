import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — dropmycv",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <header className="bg-navy px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-2xl font-extrabold tracking-tight transition-colors group">
            <span className="text-teal">drop</span><span className="text-white group-hover:text-teal">mycv</span><span className="text-teal">.app</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-10">Last updated: June 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">About dropmycv</h2>
            <p>
              dropmycv is operated by an Australian individual and is subject to the
              Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
              dropmycv is intended for use in Australia. We do not target or actively market the
              service to individuals outside Australia. Where individuals outside Australia choose
              to use the service, we take reasonable steps to handle their information consistently
              with the APPs.
            </p>
            <p className="mt-3">
              For privacy enquiries, contact:{" "}
              <a href="mailto:privacy@dropmycv.app" className="text-teal hover:underline">
                privacy@dropmycv.app
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">What information we process</h2>
            <p>When you use dropmycv, the following occurs:</p>
            <ul className="list-disc pl-5 mt-3 space-y-3">
              <li>
                <strong>Your CV file</strong> (PDF, Word .docx, or plain text) is read locally
                in your browser using JavaScript. The file itself is never transmitted to our servers.
              </li>
              <li>
                <strong>PII stripping</strong> — before any text leaves your browser, dropmycv
                attempts, on a best-effort basis, to automatically remove common contact identifiers
                (email addresses, phone numbers, and web links) and replace them with placeholders.
                This automated stripping may not catch every format, so you should avoid including
                sensitive information you do not want processed. Your name, skills, and experience
                are preserved for matching.
              </li>
              <li>
                <strong>Extracted CV text</strong> (with contact identifiers already removed) is
                sent over an encrypted (HTTPS) connection to our server solely to perform job
                matching. This text is processed transiently and is not stored, logged, or retained
                after your results are returned.
              </li>
              <li>
                <strong>Your selected country</strong> is sent alongside the CV text to filter
                job search results geographically.
              </li>
            </ul>
            <p className="mt-3">
              We do not retain your name, and contact identifiers such as your email address and
              phone number are stripped client-side before transmission on a best-effort basis.
              Your name is preserved in the CV text used for matching but is not stored or logged
              by us. We do not use cookies. We use privacy-preserving, cookieless analytics to
              count anonymous page views — see <em>Analytics</em> below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">How your information is used</h2>
            <p>Your CV text is used exclusively to:</p>
            <ol className="list-decimal pl-5 mt-3 space-y-2">
              <li>Extract a skills and experience profile using an AI language model</li>
              <li>Search for relevant live job listings via several third-party job search APIs</li>
              <li>Rank the job results by relevance to your profile</li>
            </ol>
            <p className="mt-3">
              Once results are returned to your browser, your CV text is permanently discarded.
              No human at dropmycv reads your CV.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Third-party services and overseas disclosure</h2>
            <p>
              Processing your CV text requires disclosure to the following overseas services.
              Under Australian Privacy Principle 8, dropmycv takes reasonable steps to ensure
              these recipients handle your information in accordance with the APPs.
            </p>
            <div className="mt-4 space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-medium text-slate-700">Anthropic (United States)</p>
                <p className="text-sm mt-1">
                  Your CV text is sent to Anthropic&apos;s API to extract your skills profile, rank
                  job results, and — if you purchase an AI CV review — generate that review. Under
                  Anthropic&apos;s API terms, inputs submitted via the API
                  are not used to train its models, and Anthropic offers data-processing terms for
                  international transfers. These are Anthropic&apos;s terms rather than commitments
                  dropmycv can guarantee on Anthropic&apos;s behalf; please refer to Anthropic&apos;s
                  current{" "}
                  <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
                    Privacy Policy
                  </a>{" "}
                  and Data Processing Addendum.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-medium text-slate-700">Job search providers</p>
                <p className="text-sm mt-1">
                  A search query derived from your skills profile — your job titles, a few skills,
                  and your selected location — is sent to the job search services below to retrieve
                  live listings. <strong>None of these receive your raw CV text</strong>, your name,
                  or any contact details. Each operates under its own privacy policy:
                </p>
                <ul className="text-sm mt-2 space-y-1 list-disc pl-5">
                  <li>
                    <a href="https://www.adzuna.com/privacy" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">Adzuna</a>{" "}(United Kingdom)
                  </li>
                  <li>
                    <a href="https://www.careerjet.com/privacy.html" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">Careerjet</a>{" "}(United Kingdom)
                  </li>
                  <li>
                    <a href="https://jooble.org/privacy" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">Jooble</a>{" "}(Cyprus)
                  </li>
                  <li>
                    <a href="https://brave.com/privacy/browser/" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">Brave Search</a>{" "}(United States)
                  </li>
                  <li>
                    <a href="https://remotive.com/" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">Remotive</a>{" "}(France)
                  </li>
                  <li>
                    <a href="https://jobicy.com/" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">Jobicy</a>{" "}(United States)
                  </li>
                </ul>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-medium text-slate-700">Vercel (United States)</p>
                <p className="text-sm mt-1">
                  dropmycv is hosted on Vercel and uses Vercel Web Analytics (see{" "}
                  <em>Analytics</em> below). Vercel processes standard request data such as your
                  IP address transiently in order to serve the site and provide cookieless,
                  anonymous visitor counts. See{" "}
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
                    Vercel&apos;s Privacy Policy
                  </a>.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-medium text-slate-700">Stripe (United States / Ireland)</p>
                <p className="text-sm mt-1">
                  If you purchase the optional AI CV review, your payment is processed by Stripe on
                  Stripe&apos;s own checkout page. <strong>dropmycv never receives or stores your
                  card details</strong> — they are handled entirely by Stripe. We only learn whether
                  a payment succeeded. See{" "}
                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
                    Stripe&apos;s Privacy Policy
                  </a>.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Automated decision-making</h2>
            <p>
              dropmycv uses automated AI processing to extract a skills profile from your CV and
              rank job listings by relevance. No human reviews your CV or makes decisions about
              which jobs are shown to you. The results are informational only — you are not
              assessed, scored, or evaluated as a job candidate by dropmycv. All hiring decisions
              remain with the employers whose listings are shown.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Affiliate links</h2>
            <p>
              Job listings displayed on dropmycv may include affiliate tracking links. When you
              click &ldquo;Apply Now&rdquo;, you are directed to the original job listing on the
              employer&apos;s or job board&apos;s website. dropmycv may receive a referral fee from
              the job board if you apply. This does not affect the ranking of results, which is
              determined solely by AI-assessed relevance to your CV.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Analytics</h2>
            <p>
              We use Vercel Web Analytics to understand how many people visit dropmycv, which
              pages they view, and — in aggregate — which features get used (for example, that a
              match was run or a CV review was purchased). These feature events are{" "}
              <strong>anonymous and contain no personal data</strong>: never your CV, name, email,
              the location you typed, or any job content — only non-identifying signals such as a
              country code and coarse counts. It is privacy-preserving by design: it sets{" "}
              <strong>no cookies</strong>, stores <strong>no personal information</strong>, and
              does not use cross-site tracking or device fingerprinting. Visitor counts are
              derived from a hashed, non-identifying signal that rotates daily, so it cannot be
              used to identify you or follow you across sessions or websites. See{" "}
              <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
                Vercel&apos;s analytics privacy documentation
              </a>.
            </p>
            <p className="mt-3">
              We also keep a few <strong>anonymous running totals</strong> — how many searches and
              CV checks have been run across everyone, and how many job matches have been surfaced —
              which we sometimes display on the site. These are <strong>plain global counts only</strong>:
              they hold nothing about you, your CV, or any individual search, and cannot be tied back
              to a person. They are not your data — just a tally.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Security</h2>
            <p>
              We serve the site over HTTPS and take reasonable technical and organisational steps
              to protect information while it is in transit. However, no method of transmission
              over the internet is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Children</h2>
            <p>
              dropmycv is intended for adults. It is not directed at anyone under 18, and we do
              not knowingly process the personal information of minors.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Your rights</h2>
            <p>
              Because dropmycv does not store any personal information, there is no data to
              access, correct, or delete. Each session is entirely stateless.
            </p>
            <p className="mt-3">
              If you have a concern about how your information is handled, contact us at{" "}
              <a href="mailto:privacy@dropmycv.app" className="text-teal hover:underline">
                privacy@dropmycv.app
              </a>
              . You may also contact the Office of the Australian Information Commissioner (OAIC)
              at{" "}
              <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
                oaic.gov.au
              </a>
              . dropmycv is the operator responsible for this service; your point of contact for
              any privacy concern is us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The date at the top of this
              page indicates when it was last revised. Continued use of dropmycv after any changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

        </div>
      </main>

      <footer className="bg-navy py-5 text-center text-xs text-white/40 mt-12">
        <Link href="/" className="hover:text-white/80 transition-colors">← Back to dropmycv</Link>
        <span className="mx-3">·</span>
        <Link href="/terms" className="hover:text-white/80 transition-colors">Terms of Service</Link>
      </footer>
    </div>
  );
}
