"use client";

import { useState } from "react";
import Link from "next/link";
import { CvDropzone } from "@/components/cv-dropzone";
import { trackEvent } from "@/lib/analytics";

interface Match {
  matchScore: number;
  verdict: string;
  roleTitle: string;
  company: string;
  strengths: string[];
  gaps: string[];
  missingKeywordCount: number;
  missingKeywordSample: string[];
}

// Same handoff keys the main app (app/page.tsx) reads on mount.
const CHECKER_CV_KEY = "dropmycv_checker_cv"; // free-match handoff → "/"
const PENDING_PACK_KEY = "dropmycv_pending_pack"; // survives the Stripe redirect → builds the pack on "/"

const MIN_JD = 40;

function scoreColor(s: number) {
  if (s >= 75) return "text-teal-ink";
  if (s >= 50) return "text-amber-600";
  return "text-rose-600";
}

export default function JobMatchChecker() {
  const [stage, setStage] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [match, setMatch] = useState<Match | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [error, setError] = useState("");

  const jdReady = jobDescription.trim().length >= MIN_JD;

  async function handleExtracted(text: string) {
    setCvText(text);
    setStage("loading");
    setError("");
    try {
      const res = await fetch("/api/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: text, jobDescription: jobDescription.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not check the match.");
      setMatch(data.match as Match);
      setStage("done");
      trackEvent("job_match_completed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStage("error");
    }
  }

  // Build the A$19 Application Pack for THIS pasted role — stash CV + role so they
  // survive the Stripe redirect, then the main app generates the pack on return.
  async function buildPack() {
    if (!match) return;
    try {
      sessionStorage.setItem(
        PENDING_PACK_KEY,
        JSON.stringify({
          cvText,
          job: {
            title: match.roleTitle || "This role",
            company: match.company || "",
            description: jobDescription.trim(),
          },
        })
      );
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "application-pack" }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout.");
      trackEvent("pack_checkout_started");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setStage("error");
    }
  }

  function matchAllJobs() {
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
          <p className="text-xs font-semibold text-teal-ink uppercase tracking-widest">Free job match checker</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
            Does your CV match this job?
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Before you spend an hour on an application, check the fit. Paste the job ad and drop your
            CV to see a match score, where you&apos;re strong, and the gaps to close. No sign-up, and
            your CV is read in your browser and never stored.
          </p>
        </section>

        {stage === "idle" && (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="jd" className="block text-sm font-semibold text-navy mb-1.5">
                  1. Paste the job description
                </label>
                <textarea
                  id="jd"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  placeholder="Paste the full job ad here — responsibilities, requirements, the lot. It's sent only to produce your match, then discarded."
                  className="w-full rounded-xl border border-slate-200 p-3 text-slate-700 focus:border-teal focus:outline-none"
                />
                <p className={`text-xs mt-1 ${jdReady ? "text-slate-500" : "text-amber-600"}`}>
                  {jdReady ? "Looks good — now drop your CV below." : "Paste the job description first to unlock the CV upload."}
                </p>
              </div>

              <div>
                <p className="block text-sm font-semibold text-navy mb-1.5">2. Drop your CV</p>
                <CvDropzone
                  disabled={!jdReady}
                  onExtracted={(t) => handleExtracted(t)}
                  onError={(m) => { setError(m); setStage("error"); }}
                />
              </div>
            </div>

            {/* Sample result — show the output before they commit */}
            <section>
              <p className="text-xs uppercase tracking-widest text-slate-500 text-center mb-3">
                Here&apos;s what your match check looks like
              </p>
              <div className="rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-6 space-y-5 max-w-xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 text-center">
                    <div className="text-4xl font-serif font-bold text-teal-ink">81</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">% match</div>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-navy uppercase tracking-widest mb-1">Example match</h2>
                    <p className="text-slate-700 leading-snug text-sm">
                      A strong fit worth applying for — your delivery experience lines up well, with a
                      couple of gaps to address in your cover letter.
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-2">✓ You&apos;re strong on</p>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li className="flex gap-2"><span className="text-emerald-500">•</span><span>5+ years in the exact domain the role names</span></li>
                      <li className="flex gap-2"><span className="text-emerald-500">•</span><span>The core tools listed as &ldquo;must-have&rdquo;</span></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">⚡ Gaps to close</p>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li className="flex gap-2"><span className="text-amber-500">•</span><span>No mention of the certification they ask for</span></li>
                      <li className="flex gap-2"><span className="text-amber-500">•</span><span>Team-leadership scope is understated</span></li>
                    </ul>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-slate-500 mt-2">
                Example output — your real check is based on your own CV and the job you paste.
              </p>
            </section>

            <section className="pt-12 space-y-10 text-slate-600 leading-relaxed">
              <div>
                <h2 className="text-xl font-serif font-bold text-navy mb-2">Why check the match first?</h2>
                <p>
                  A tailored application takes real time — and most job ads attract dozens or hundreds
                  of applicants. Checking the fit first tells you which roles are worth that effort,
                  and exactly what to emphasise (or shore up) before you hit send.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-serif font-bold text-navy mb-2">What the free check shows</h2>
                <ul className="list-disc pl-5 mt-3 space-y-1.5">
                  <li><strong>A match score</strong> — overall fit on skills, experience and seniority</li>
                  <li><strong>Where you&apos;re strong</strong> — the things in your CV this role specifically wants</li>
                  <li><strong>The gaps</strong> — requirements the listing asks for that your CV doesn&apos;t yet evidence</li>
                  <li><strong>Missing keywords</strong> — terms this ad screens for that aren&apos;t in your CV</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-serif font-bold text-navy mb-3">Free check vs the A$19 Application Pack</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="p-2 font-medium text-slate-500"></th>
                        <th className="p-2 font-semibold text-slate-600 text-center">Free check</th>
                        <th className="p-2 font-semibold text-navy text-center">A$19 pack</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { f: "Match score, strengths & gaps", a: "✓", b: "✓" },
                        { f: "Missing keywords", a: "Count + sample", b: "The full list to weave in" },
                        { f: "Cover-letter draft for this role", a: "—", b: "✓" },
                        { f: "Your CV bullets reworded for this listing", a: "—", b: "✓" },
                        { f: "Likely interview questions + how to answer", a: "—", b: "✓" },
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
                  <p><strong className="text-slate-700">Is it really free?</strong><br />Yes — the match check is free with no account. The tailored Application Pack is an optional A$19.</p>
                  <p><strong className="text-slate-700">What match score is worth applying for?</strong><br />There&apos;s no hard cut-off, but a strong, well-evidenced fit beats a long-shot. The check shows you exactly which gaps to address so a borderline match becomes a credible one.</p>
                  <p><strong className="text-slate-700">How is this different from matching to jobs?</strong><br />This checks your CV against <em>one</em> job you paste. To discover roles you match across the live market, use <Link href="/match-my-cv-to-jobs" className="text-teal-ink hover:underline">match my CV to jobs</Link> instead.</p>
                </div>
                <p className="text-sm text-slate-500 mt-4">
                  Related:{" "}
                  <Link href="/ats-resume-checker" className="text-teal-ink hover:underline">ATS resume checker</Link>{" "}·{" "}
                  <Link href="/cv-checker" className="text-teal-ink hover:underline">free CV checker</Link>{" "}·{" "}
                  <Link href="/application-pack" className="text-teal-ink hover:underline">Application Pack</Link>
                </p>
              </div>
            </section>
          </>
        )}

        {stage === "loading" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-teal rounded-full animate-spin" />
            <p className="text-slate-600 font-medium">Checking your match…</p>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
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

        {stage === "done" && match && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-6 space-y-5">
              {/* Score + verdict */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 text-center">
                  <div className={`text-4xl font-serif font-bold ${scoreColor(match.matchScore)}`}>{match.matchScore}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">% match</div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-navy uppercase tracking-widest mb-1">
                    Your match{match.roleTitle ? ` · ${match.roleTitle}` : ""}
                  </h2>
                  <p className="text-slate-700 leading-snug">{match.verdict}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {match.strengths.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-2">✓ You&apos;re strong on</p>
                    <ul className="space-y-1 text-sm text-slate-600">
                      {match.strengths.map((s, i) => (
                        <li key={i} className="flex gap-2"><span className="text-emerald-500">•</span><span>{s}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
                {match.gaps.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">⚡ Gaps to close</p>
                    <ul className="space-y-1 text-sm text-slate-600">
                      {match.gaps.map((s, i) => (
                        <li key={i} className="flex gap-2"><span className="text-amber-500">•</span><span>{s}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Upsell — build the tailored pack for THIS role */}
            <div className="rounded-2xl border-2 border-navy/15 bg-white p-6 text-center space-y-3">
              {match.missingKeywordCount > 0 ? (
                <p className="text-slate-700">
                  This listing screens for <span className="font-bold text-navy">{match.missingKeywordCount} keyword{match.missingKeywordCount === 1 ? "" : "s"}</span>{" "}
                  your CV is missing
                  {match.missingKeywordSample.length > 0 && (
                    <> — including <span className="font-medium text-navy">{match.missingKeywordSample.join(", ")}</span></>
                  )}.
                </p>
              ) : (
                <p className="text-slate-700">Ready to turn this match into an application?</p>
              )}
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                The <span className="font-medium text-navy">Application Pack</span> builds it for this exact role:
                a cover-letter draft, your CV bullets reworded for this listing, the full list of keywords
                to weave in, and the interview questions you&apos;re likely to face — with how to answer each.
              </p>
              <button
                onClick={buildPack}
                className="inline-block text-sm px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
              >
                Build my Application Pack for this role — A$19 →
              </button>
              <p className="text-xs text-slate-500">One-off · built instantly after checkout · nothing stored</p>
              <div className="pt-1">
                <button
                  onClick={matchAllJobs}
                  className="text-sm text-teal-ink hover:text-navy font-medium underline underline-offset-2"
                >
                  Or see every live job your CV matches — free →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-navy py-5 text-center text-xs text-white/70 mt-8">
        <Link href="/" className="hover:text-white/80 transition-colors">← Back to dropmycv</Link>
        <span className="mx-3">·</span>
        <Link href="/ats-resume-checker" className="hover:text-white/80 transition-colors">ATS checker</Link>
        <span className="mx-2">·</span>
        <Link href="/privacy" className="hover:text-white/80 transition-colors">Privacy</Link>
      </footer>
    </div>
  );
}
