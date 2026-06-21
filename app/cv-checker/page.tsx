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
          <CvDropzone onExtracted={(t) => handleExtracted(t)} onError={(m) => { setError(m); setStage("error"); }} />
        )}

        {stage === "loading" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-teal rounded-full animate-spin" />
            <p className="text-slate-600 font-medium">Checking your CV…</p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>🔒</span> Personal details removed in your browser — never stored
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
