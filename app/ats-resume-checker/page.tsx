"use client";

import { useState } from "react";
import Link from "next/link";
import { CvDropzone } from "@/components/cv-dropzone";
import { analyseAtsFormat, type AtsFormatResult, type AtsStatus } from "@/lib/ats-format";
import { trackEvent } from "@/lib/analytics";

interface Keywords {
  targetRole: string;
  keywordScore: number;
  keywordVerdict: string;
  matchedCount: number;
  missingCount: number;
  missingSample: string[];
}

// Reuse the same handoff key as /cv-checker so "unlock" lands in the matched A$9 review.
const CHECKER_CV_KEY = "dropmycv_checker_cv";

function scoreColor(s: number) {
  if (s >= 75) return "text-teal-ink";
  if (s >= 50) return "text-amber-600";
  return "text-rose-600";
}

const STATUS_ICON: Record<AtsStatus, string> = { pass: "✓", warn: "!", fail: "✕" };
const STATUS_STYLE: Record<AtsStatus, string> = {
  pass: "bg-emerald-50 text-emerald-600 border-emerald-200",
  warn: "bg-amber-50 text-amber-600 border-amber-200",
  fail: "bg-rose-50 text-rose-600 border-rose-200",
};

export default function AtsResumeChecker() {
  const [stage, setStage] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [format, setFormat] = useState<AtsFormatResult | null>(null);
  const [keywords, setKeywords] = useState<Keywords | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [error, setError] = useState("");
  const [pdfHint, setPdfHint] = useState(false);

  const atsScore =
    format && keywords ? Math.round(format.score * 0.5 + keywords.keywordScore * 0.5) : 0;

  async function handleExtracted(text: string, fileName: string) {
    setCvText(text);
    setStage("loading");
    setError("");
    setPdfHint(false);

    // Deterministic format checks run instantly in the browser.
    const fmt = analyseAtsFormat(text, fileName);
    setFormat(fmt);

    try {
      const res = await fetch("/api/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: text, jobDescription: jobDescription.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not check your CV.");
      setKeywords(data.keywords as Keywords);
      setStage("done");
      trackEvent("ats_check_completed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStage("error");
    }
  }

  function handleError(message: string, fileName?: string) {
    // An image/scanned PDF is the #1 ATS failure — turn the parse error into useful advice.
    setPdfHint(Boolean(fileName && fileName.toLowerCase().endsWith(".pdf")));
    setError(message);
    setStage("error");
  }

  function unlockFullReview() {
    try {
      sessionStorage.setItem(CHECKER_CV_KEY, JSON.stringify({ cvText }));
    } catch {}
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-2xl font-extrabold tracking-tight transition-colors group">
            <span className="text-teal">drop</span><span className="text-white group-hover:text-teal">mycv</span><span className="text-teal">.app</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 space-y-8">
        <section className="text-center space-y-3">
          <p className="text-xs font-semibold text-teal-ink uppercase tracking-widest">Free ATS resume checker</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
            Is your resume ATS-friendly?
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Most applications are filtered by an Applicant Tracking System before a human reads
            them. Get an instant ATS score — your CV&apos;s format, sections, dates and keyword
            coverage. No sign-up, and your CV is read in your browser and never stored.
          </p>
        </section>

        {stage === "idle" && (
          <>
            <div className="space-y-3">
              <CvDropzone
                onExtracted={(t, name) => handleExtracted(t, name)}
                onError={(m, name) => handleError(m, name)}
              />
              <details className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm">
                <summary className="cursor-pointer font-medium text-navy select-none">
                  Optional: paste a job description to check keyword match for a specific role
                </summary>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={5}
                  placeholder="Paste the job ad here. We'll check how well your CV's keywords match what this role screens for. The text is sent only to produce your score, then discarded."
                  className="mt-3 w-full rounded-lg border border-slate-200 p-3 text-slate-700 focus:border-teal focus:outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Leave blank and we&apos;ll infer your target role from the CV instead.
                </p>
              </details>
            </div>

            {/* Sample result — show the output before they commit */}
            <section>
              <p className="text-xs uppercase tracking-widest text-slate-500 text-center mb-3">
                Here&apos;s what your ATS check looks like
              </p>
              <div className="rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-6 space-y-5 max-w-xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 text-center">
                    <div className="text-4xl font-serif font-bold text-amber-600">72</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">ATS score</div>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-navy uppercase tracking-widest mb-1">Example ATS check</h2>
                    <p className="text-slate-700 leading-snug text-sm">
                      Parses cleanly and has the right sections, but a two-column layout risks
                      scrambling and it&apos;s missing several keywords this role screens for.
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    { s: "pass" as const, t: "Standard sections found" },
                    { s: "pass" as const, t: "Dated work history" },
                    { s: "warn" as const, t: "Possible tables / columns" },
                    { s: "warn" as const, t: "6 keywords missing" },
                  ].map((r) => (
                    <div key={r.t} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${STATUS_STYLE[r.s]}`}>
                      <span className="font-bold">{STATUS_ICON[r.s]}</span><span className="text-slate-600">{r.t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-center text-xs text-slate-500 mt-2">
                Example output — your real check is based on your own CV.
              </p>
            </section>

            <section className="pt-12 space-y-10 text-slate-600 leading-relaxed">
              <div>
                <h2 className="text-xl font-serif font-bold text-navy mb-2">What is an ATS?</h2>
                <p>
                  An <strong>Applicant Tracking System</strong> is the software employers use to
                  collect and filter applications (Workday, Greenhouse, Lever, Taleo and others).
                  When you apply online, your CV is parsed into fields and recruiters search it by
                  keyword. If the system can&apos;t read your file — or can&apos;t find the right
                  terms — a strong candidate can be passed over before any human looks.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif font-bold text-navy mb-2">What the free check looks at</h2>
                <p>In a few seconds you get an ATS score out of 100, built from two layers:</p>
                <ul className="list-disc pl-5 mt-3 space-y-1.5">
                  <li><strong>Format &amp; parse-ability</strong> — file type, standard section headings, contact line, dated history, bullet points, and signs of tables or graphics that scramble in an ATS</li>
                  <li><strong>Keyword coverage</strong> — how well your CV matches the terms your target role (or a pasted job description) is screened for</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-serif font-bold text-navy mb-3">Common ATS problems it spots</h2>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  {[
                    "Tables or multi-column layouts that scramble",
                    "Contact details hidden in headers/footers",
                    "Missing or non-standard section headings",
                    "No dates on your work history",
                    "Keywords the role screens for that you're missing",
                    "Image-only / scanned PDFs an ATS can't read",
                  ].map((t) => (
                    <div key={t} className="bg-white rounded-lg border border-slate-100 px-3 py-2 text-slate-600">{t}</div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-serif font-bold text-navy mb-3">Free check vs the full A$9 review</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="p-2 font-medium text-slate-500"></th>
                        <th className="p-2 font-semibold text-slate-600 text-center">Free ATS check</th>
                        <th className="p-2 font-semibold text-navy text-center">A$9 review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { f: "ATS score & format checklist", a: "✓", b: "✓" },
                        { f: "Keyword match score", a: "✓", b: "✓" },
                        { f: "Missing keywords", a: "Count + sample", b: "The full list" },
                        { f: "Checked against your live job matches", a: "—", b: "✓" },
                        { f: "Bullet rewrites & action plan", a: "—", b: "✓" },
                      ].map((r, i) => (
                        <tr key={r.f} className={i % 2 ? "" : "bg-slate-50/50"}>
                          <td className="p-2 text-slate-600 font-medium">{r.f}</td>
                          <td className="p-2 text-slate-500 text-center">{r.a}</td>
                          <td className="p-2 text-slate-700 text-center">{r.b}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-serif font-bold text-navy mb-2">Private by design</h2>
                <p>
                  Your CV file is opened in your browser. Your email, phone and links are stripped
                  before any text is sent, and nothing is stored — no account, no profile, no
                  recruiter database. <Link href="/private-job-search" className="text-teal-ink hover:underline">How privacy works</Link>.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif font-bold text-navy mb-3">FAQ</h2>
                <div className="space-y-4 text-sm">
                  <p><strong className="text-slate-700">Is it really free?</strong><br />Yes — the ATS check is free with no account. The full review is an optional A$9.</p>
                  <p><strong className="text-slate-700">Do ATS really auto-reject resumes?</strong><br />Most don&apos;t auto-reject outright, but they do parse your CV into fields and let recruiters filter by keyword. Bad formatting and missing keywords genuinely cost you — that&apos;s what this check catches.</p>
                  <p><strong className="text-slate-700">Should I use a PDF or Word file?</strong><br />A text-based PDF or a .docx both work. Avoid image/scanned PDFs — an ATS can&apos;t read them.</p>
                  <p><strong className="text-slate-700">How is this different from the CV checker?</strong><br />The <Link href="/cv-checker" className="text-teal-ink hover:underline">free CV checker</Link> rates how persuasive your CV is to a human. This rates how readable it is to the machine. Use both.</p>
                </div>
                <p className="text-sm text-slate-500 mt-4">
                  Related:{" "}
                  <Link href="/cv-checker" className="text-teal-ink hover:underline">free CV checker</Link>{" "}·{" "}
                  <Link href="/job-match-checker" className="text-teal-ink hover:underline">job match checker</Link>{" "}·{" "}
                  <Link href="/match-my-cv-to-jobs" className="text-teal-ink hover:underline">match my CV to jobs</Link>{" "}·{" "}
                  <Link href="/cv-review" className="text-teal-ink hover:underline">full AI CV review</Link>
                </p>
              </div>
            </section>
          </>
        )}

        {stage === "loading" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-teal rounded-full animate-spin" />
            <p className="text-slate-600 font-medium">Scanning your CV…</p>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>🔒</span> Your email, phone &amp; links removed in your browser — nothing stored
            </p>
          </div>
        )}

        {stage === "error" && (
          <div className="text-center py-12 space-y-4">
            <p className="text-slate-500">{error}</p>
            {pdfHint && (
              <p className="text-sm text-amber-700 max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                If this is a scanned or image-based PDF, that&apos;s itself a serious ATS problem —
                the system can&apos;t read it at all. Re-export a text-based PDF or a Word (.docx)
                file and try again.
              </p>
            )}
            <button
              onClick={() => { setStage("idle"); setError(""); setPdfHint(false); }}
              className="text-sm px-5 py-2 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {stage === "done" && format && keywords && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-6 space-y-5">
              {/* Score + verdict */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 text-center">
                  <div className={`text-4xl font-serif font-bold ${scoreColor(atsScore)}`}>{atsScore}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">ATS score</div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-navy uppercase tracking-widest mb-1">
                    Your ATS check{keywords.targetRole ? ` · ${keywords.targetRole}` : ""}
                  </h2>
                  <p className="text-slate-700 leading-snug">{keywords.keywordVerdict}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Format {format.score}/100 · Keyword match {keywords.keywordScore}/100
                  </p>
                </div>
              </div>

              {/* Format checklist */}
              <div>
                <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-2">Format &amp; parse-ability</p>
                <div className="space-y-2">
                  {format.checks.map((c) => (
                    <div key={c.id} className="flex gap-3 items-start">
                      <span className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${STATUS_STYLE[c.status]}`}>
                        {STATUS_ICON[c.status]}
                      </span>
                      <div className="text-sm">
                        <span className="font-medium text-slate-700">{c.label}.</span>{" "}
                        <span className="text-slate-600">{c.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upsell */}
            <div className="rounded-2xl border-2 border-navy/15 bg-white p-6 text-center space-y-3">
              {keywords.missingCount > 0 ? (
                <>
                  <p className="text-slate-700">
                    We spotted <span className="font-bold text-navy">{keywords.missingCount} keyword{keywords.missingCount === 1 ? "" : "s"}</span>{" "}
                    this role screens for that your CV is missing
                    {keywords.missingSample.length > 0 && (
                      <> — including <span className="font-medium text-navy">{keywords.missingSample.join(", ")}</span></>
                    )}.
                  </p>
                </>
              ) : (
                <p className="text-slate-700">Want the full breakdown — every gap, rewrites and priorities?</p>
              )}
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Unlock the full review and we&apos;ll match your CV to live jobs first, then show you
                the <span className="font-medium text-navy">exact missing keywords those roles ask for</span>,
                stronger rewrites of your weak lines, and a prioritised action list.
              </p>
              <button
                onClick={unlockFullReview}
                className="inline-block text-sm px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
              >
                Match my CV &amp; unlock the full review — A$9 →
              </button>
              <p className="text-xs text-slate-500">Free job matches first · review is the optional A$9 add-on</p>
              <div className="pt-1">
                <button
                  onClick={unlockFullReview}
                  className="text-sm text-teal-ink hover:text-navy font-medium underline underline-offset-2"
                >
                  Or just match this CV to live jobs — free →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-navy py-5 text-center text-xs text-white/70 mt-8">
        <Link href="/" className="hover:text-white/80 transition-colors">← Back to dropmycv</Link>
        <span className="mx-3">·</span>
        <Link href="/cv-checker" className="hover:text-white/80 transition-colors">CV checker</Link>
        <span className="mx-2">·</span>
        <Link href="/privacy" className="hover:text-white/80 transition-colors">Privacy</Link>
      </footer>
    </div>
  );
}
