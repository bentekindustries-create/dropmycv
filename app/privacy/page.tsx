import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — dropmycv",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-xl font-bold text-slate-800 hover:text-indigo-600 transition-colors">
            dropmycv<span className="text-indigo-600">.</span>
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
              dropmycv is operated by an Australian individual (ABN holder) and is subject to the
              Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
              dropmycv is intended for use in Australia. We do not target or actively market the
              service to individuals outside Australia. Where individuals outside Australia choose
              to use the service, we take reasonable steps to handle their information consistently
              with the APPs.
            </p>
            <p className="mt-3">
              For privacy enquiries, contact:{" "}
              <a href="mailto:privacy@dropmycv.app" className="text-indigo-600 hover:underline">
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
              by us. We do not use cookies or tracking technologies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">How your information is used</h2>
            <p>Your CV text is used exclusively to:</p>
            <ol className="list-decimal pl-5 mt-3 space-y-2">
              <li>Extract a skills and experience profile using an AI language model</li>
              <li>Search for relevant live job listings via a third-party job search API</li>
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
                  Your CV text is sent to Anthropic&apos;s API to extract your skills profile and
                  rank job results. Under Anthropic&apos;s API terms, inputs submitted via the API
                  are not used to train its models, and Anthropic offers data-processing terms for
                  international transfers. These are Anthropic&apos;s terms rather than commitments
                  dropmycv can guarantee on Anthropic&apos;s behalf; please refer to Anthropic&apos;s
                  current{" "}
                  <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                    Privacy Policy
                  </a>{" "}
                  and Data Processing Addendum.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-medium text-slate-700">Adzuna (United Kingdom)</p>
                <p className="text-sm mt-1">
                  A search query derived from your skills profile (not your raw CV text) is sent
                  to Adzuna&apos;s job search API to retrieve live job listings. Adzuna does not
                  receive your CV text. See{" "}
                  <a href="https://www.adzuna.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                    Adzuna&apos;s Privacy Policy
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
              dropmycv is not directed at children under 15, and we do not knowingly process
              their personal information.
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
              <a href="mailto:privacy@dropmycv.app" className="text-indigo-600 hover:underline">
                privacy@dropmycv.app
              </a>
              . You may also contact the Office of the Australian Information Commissioner (OAIC)
              at{" "}
              <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
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

      <footer className="border-t border-slate-100 py-5 text-center text-xs text-slate-300 mt-12">
        <Link href="/" className="hover:text-slate-500 transition-colors">← Back to dropmycv</Link>
        <span className="mx-3">·</span>
        <Link href="/terms" className="hover:text-slate-500 transition-colors">Terms of Service</Link>
      </footer>
    </div>
  );
}
