"use client";

import { useState } from "react";
import Link from "next/link";
import { CvDropzone } from "@/components/cv-dropzone";

interface Check {
  score: number;
  verdict: string;
  strengths: string[];
  issues: string[];
  gapCount: number;
}

const CHECKER_CV_KEY = "dropmycv_checker_cv";

function scoreColor(s: number) {
  if (s >= 75) return "text-teal";
  if (s >= 50) return "text-amber-600";
  return "text-rose-600";
}

export default function CvChecker() {
  const [stage, setStage] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [check, setCheck] = useState<Check | null>(null);
  const [cvText, setCvText] = useState("");
  const [error, setError] = useState("");

  async function handleExtracted(text: string) {
    setCvText(text);
    setStage("loading");
    setError("");
    try {
      const res = await fetch("/api/cv-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not check your CV.");
      setCheck(data.check as Check);
      setStage("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStage("error");
    }
  }

  function unlockFullReview() {
    // Hand the CV to the main flow so the paid review is matched against live jobs (Option A)
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
          <p className="text-xs font-semibold text-teal uppercase tracking-widest">Free CV checker</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
            Is your CV holding you back?
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Drop your CV for an instant, free check — an honest score and the top things helping and
            hurting it. No sign-up, and your CV is read in your browser and never stored.
          </p>
        </section>

        {stage === "idle" && (
          <>
            <CvDropzone onExtracted={(t) => handleExtracted(t)} onError={(m) => { setError(m); setStage("error"); }} />

            <section className="pt-12 space-y-10 text-slate-600 leading-relaxed">
              <div>
                <h2 className="text-xl font-serif font-bold text-navy mb-2">What the free check looks at</h2>
                <p>
                  In a few seconds you get an honest score out of 100 and a quick read on the biggest
                  things helping and hurting your CV — fast triage before you send another application:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-1.5">
                  <li><strong>Impact</strong> — whether your achievements are quantified, or just a list of duties</li>
                  <li><strong>Clarity &amp; polish</strong> — vague filler, structure, and obvious red flags</li>
                  <li><strong>Keyword coverage</strong> — a count of important keywords your target roles want but your CV is missing</li>
                  <li><strong>Seniority signals</strong> — whether the CV backs up the level you&apos;re aiming for</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-serif font-bold text-navy mb-3">Common issues it spots</h2>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  {[
                    "Bullets that describe duties, not results",
                    "Filler like 'various tasks' or 'helped the team'",
                    "No metrics or quantified outcomes",
                    "Missing keywords for your target roles",
                    "A weak or generic summary",
                    "Seniority claims not backed by evidence",
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
                        <th className="p-2 font-medium text-slate-400"></th>
                        <th className="p-2 font-semibold text-slate-600 text-center">Free check</th>
                        <th className="p-2 font-semibold text-navy text-center">A$9 review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { f: "Overall score & verdict", a: "✓", b: "✓" },
                        { f: "Top strengths & issues", a: "Top 2", b: "Full list" },
                        { f: "Missing keywords", a: "Count only", b: "The actual list" },
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
                  recruiter database. <Link href="/private-job-search" className="text-teal hover:underline">How privacy works</Link>.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif font-bold text-navy mb-3">FAQ</h2>
                <div className="space-y-4 text-sm">
                  <p><strong className="text-slate-700">Is it really free?</strong><br />Yes — the CV check is free with no account. The full review is an optional A$9.</p>
                  <p><strong className="text-slate-700">Do you store my CV?</strong><br />No. It&apos;s read in your browser and the stripped text is checked only to produce your score, then discarded.</p>
                  <p><strong className="text-slate-700">How is this different from the A$9 review?</strong><br />The free check is a quick triage. The full <Link href="/cv-review" className="text-teal hover:underline">AI CV review</Link> matches your CV to live jobs first, then shows the exact missing keywords, rewrites and a prioritised plan.</p>
                  <p><strong className="text-slate-700">How long does it take?</strong><br />A few seconds.</p>
                </div>
                <p className="text-sm text-slate-500 mt-4">
                  Related:{" "}
                  <Link href="/match-my-cv-to-jobs" className="text-teal hover:underline">match my CV to jobs</Link>{" "}
                  ·{" "}
                  <Link href="/cv-review" className="text-teal hover:underline">full AI CV review</Link>
                </p>
              </div>
            </section>
          </>
        )}

        {stage === "loading" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-teal rounded-full animate-spin" />
            <p className="text-slate-600 font-medium">Checking your CV…</p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>🔒</span> Your email, phone &amp; links removed in your browser — nothing stored
            </p>
          </div>
        )}

        {stage === "error" && (
          <div className="text-center py-12 space-y-4">
            <p className="text-slate-500">{error}</p>
            <button
              onClick={() => { setStage("idle"); setError(""); }}
              className="text-sm px-5 py-2 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {stage === "done" && check && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-6 space-y-5">
              {/* Score + verdict */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 text-center">
                  <div className={`text-4xl font-serif font-bold ${scoreColor(check.score)}`}>{check.score}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400">/ 100</div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-navy uppercase tracking-widest mb-1">Your free CV check</h2>
                  <p className="text-slate-700 leading-snug">{check.verdict}</p>
                </div>
              </div>

              {check.strengths.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-2">✓ Working for you</p>
                  <ul className="space-y-1 text-sm text-slate-600">
                    {check.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2"><span className="text-emerald-500">•</span><span>{s}</span></li>
                    ))}
                  </ul>
                </div>
              )}

              {check.issues.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">⚡ Holding you back</p>
                  <ul className="space-y-1 text-sm text-slate-600">
                    {check.issues.map((s, i) => (
                      <li key={i} className="flex gap-2"><span className="text-amber-500">•</span><span>{s}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Upsell */}
            <div className="rounded-2xl border-2 border-navy/15 bg-white p-6 text-center space-y-3">
              {check.gapCount > 0 ? (
                <p className="text-slate-700">
                  We spotted <span className="font-bold text-navy">{check.gapCount} keyword{check.gapCount === 1 ? "" : "s"}</span>{" "}
                  your target roles want that your CV is missing.
                </p>
              ) : (
                <p className="text-slate-700">Want the full breakdown — exact gaps, rewrites and priorities?</p>
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
                Unlock the full review — A$9 →
              </button>
              <p className="text-xs text-slate-400">Free job matches first · review is the optional A$9 add-on</p>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-navy py-5 text-center text-xs text-white/40 mt-8">
        <Link href="/" className="hover:text-white/80 transition-colors">← Back to dropmycv</Link>
        <span className="mx-3">·</span>
        <Link href="/cv-review" className="hover:text-white/80 transition-colors">Full CV review</Link>
        <span className="mx-2">·</span>
        <Link href="/privacy" className="hover:text-white/80 transition-colors">Privacy</Link>
      </footer>
    </div>
  );
}
