"use client";

import { useEffect, useMemo, useState } from "react";
import { CvDropzone } from "@/components/cv-dropzone";
import { JobCard } from "@/components/job-card";
import { COUNTRIES, getCurrency } from "@/lib/countries";
import type { JobMatch, MatchResult } from "@/lib/types";

type Stage = "idle" | "questionnaire" | "matching" | "results" | "error";
type SortKey = "relevance" | "salary" | "newest";

const QUESTIONS = [
  {
    id: "role",
    question: "What kind of work are you looking for?",
    hint: "e.g. Software Engineer, Marketing Manager, Nurse, Accountant",
    type: "text" as const,
    optional: false,
  },
  {
    id: "experience",
    question: "How much work experience do you have?",
    hint: "",
    type: "choice" as const,
    options: ["Less than 2 years", "2–5 years", "5–10 years", "10+ years"],
    optional: false,
  },
  {
    id: "skills",
    question: "What are your main skills or areas of expertise?",
    hint: "e.g. Python, project management, customer service, graphic design",
    type: "text" as const,
    optional: false,
  },
  {
    id: "preference",
    question: "Anything specific you're after?",
    hint: "e.g. remote work, part-time, fintech, startups — or leave blank",
    type: "text" as const,
    optional: true,
  },
];

type QAnswers = Record<string, string>;

function buildCvText(answers: QAnswers): string {
  return [
    `Professional profile`,
    `Role: ${answers.role ?? ""}`,
    `Experience: ${answers.experience ?? ""}`,
    `Skills and expertise: ${answers.skills ?? ""}`,
    answers.preference ? `Preferences: ${answers.preference}` : "",
  ].filter(Boolean).join("\n");
}

const TIERS = [
  { label: "Top Matches", range: [0, 4], accent: "text-emerald-600", dot: "bg-emerald-500" },
  { label: "Good Matches", range: [5, 9], accent: "text-blue-600", dot: "bg-blue-400" },
  { label: "Worth a Look", range: [10, 14], accent: "text-slate-500", dot: "bg-slate-400" },
];

const MATCHING_STEPS = [
  "Reading your CV…",
  "Searching live jobs…",
  "Ranking your matches…",
];

const STORAGE_KEY = "dropmycv_last_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function saveSession(result: MatchResult, fileName: string, country: string, location: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ result, fileName, country, location, savedAt: Date.now() }));
  } catch {}
}

function loadSession(): { result: MatchResult; fileName: string; country: string; location: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > SESSION_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function sortJobs(jobs: JobMatch[], key: SortKey): JobMatch[] {
  if (key === "relevance") return jobs;
  if (key === "salary") {
    return [...jobs].sort((a, b) => (b.salaryMax ?? b.salaryMin ?? 0) - (a.salaryMax ?? a.salaryMin ?? 0));
  }
  return [...jobs].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("idle");
  const [country, setCountry] = useState("au");
  const [location, setLocation] = useState("");
  const [keywords, setKeywords] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("relevance");
  const [lastCvText, setLastCvText] = useState("");
  const [matchingStep, setMatchingStep] = useState(0);
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const [qStep, setQStep] = useState(0);
  const [qAnswers, setQAnswers] = useState<QAnswers>({});

  const currency = getCurrency(country);
  const sortedJobs = useMemo(
    () => sortJobs(result?.jobs ?? [], sortKey),
    [result?.jobs, sortKey]
  );

  // Check for a saved session on mount
  useEffect(() => {
    const saved = loadSession();
    if (saved) setHasSavedSession(true);
  }, []);

  // Cycle through progress steps during matching
  useEffect(() => {
    if (stage !== "matching") return;
    setMatchingStep(0);
    const t1 = setTimeout(() => setMatchingStep(1), 3000);
    const t2 = setTimeout(() => setMatchingStep(2), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [stage]);

  function restoreSession() {
    const saved = loadSession();
    if (!saved) return;
    setResult(saved.result);
    setFileName(saved.fileName);
    setCountry(saved.country);
    setLocation(saved.location);
    setStage("results");
    setHasSavedSession(false);
  }

  async function runMatch(cvText: string, locationOverride?: string, keywordsOverride?: string) {
    setStage("matching");
    setError("");
    setSortKey("relevance");

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText,
          country,
          ...(locationOverride !== undefined ? { location: locationOverride } : {}),
          ...(keywordsOverride ? { keywords: keywordsOverride } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Matching failed — please try again.");
      }

      const matchResult = data as MatchResult;
      setResult(matchResult);
      setStage("results");
      saveSession(matchResult, fileName, country, location);

      if (!locationOverride && matchResult.profile.location) {
        setLocation(matchResult.profile.location);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setStage("error");
    }
  }

  async function handleExtracted(cvText: string, name: string) {
    setFileName(name);
    setLastCvText(cvText);
    runMatch(cvText, location || undefined, keywords || undefined);
  }

  function handleRefine() {
    if (!lastCvText) return;
    runMatch(lastCvText, location || undefined, keywords || undefined);
  }

  function handleQNext() {
    const q = QUESTIONS[qStep];
    const answer = qAnswers[q.id] ?? "";
    if (!q.optional && !answer.trim()) return;
    if (qStep < QUESTIONS.length - 1) {
      setQStep(qStep + 1);
    } else {
      const cvText = buildCvText(qAnswers);
      const syntheticName = `${qAnswers.role ?? "profile"} (no CV)`;
      setFileName(syntheticName);
      setLastCvText(cvText);
      runMatch(cvText, location || undefined);
    }
  }

  function reset() {
    setStage("idle");
    setResult(null);
    setError("");
    setFileName("");
    setLastCvText("");
    setSortKey("relevance");
    setLocation("");
    setKeywords("");
    setQStep(0);
    setQAnswers({});
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Mock mode banner */}
      {process.env.NEXT_PUBLIC_MOCK_MODE === "true" && (
        <div className="bg-amber-400 text-amber-900 text-xs font-semibold text-center py-1.5 tracking-wide">
          ⚠ MOCK MODE — fake data only, no API calls made
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="https://www.dropmycv.app" onClick={(e) => { e.preventDefault(); reset(); }} className="text-2xl font-extrabold tracking-tight transition-colors group">
            <span className="text-indigo-600">drop</span><span className="text-slate-800 group-hover:text-indigo-600">mycv</span><span className="text-indigo-600">.app</span>
          </a>
          <span className="text-xs text-slate-400 hidden sm:block">
            No account · No storage · Free
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6">

        {/* ── IDLE ── */}
        {stage === "idle" && (
          <div className="py-14 space-y-8">
            {/* Restore session banner */}
            {hasSavedSession && (
              <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                <p className="text-sm text-indigo-700 font-medium">You have results from your last session.</p>
                <button
                  onClick={restoreSession}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                >
                  View them →
                </button>
              </div>
            )}

            {/* Hero */}
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold text-slate-800 tracking-tight leading-tight">
                Finding your next job shouldn&apos;t feel like<br />
                <span className="text-indigo-600">a full-time job.</span>
              </h1>
              <p className="text-slate-500 text-base max-w-lg mx-auto">
                Drop your CV and get matched to thousands of live roles instantly.
                No sign-up. No data stored.
              </p>
            </div>

            {/* Trust bar */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {[
                { icon: "🔒", label: "No cookies or tracking" },
                { icon: "🗑️", label: "CV never stored" },
                { icon: "⚡", label: "Results in seconds" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Country + location */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <label htmlFor="country-select" className="text-sm text-slate-500 shrink-0">
                  Country:
                </label>
                <select
                  id="country-select"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 w-full max-w-xs">
                <label htmlFor="location-input" className="text-sm text-slate-500 shrink-0">
                  Location:
                </label>
                <input
                  id="location-input"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Any — or type a city, state, postcode"
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Drop zone */}
            <CvDropzone
              onExtracted={handleExtracted}
              onError={(msg) => {
                setError(msg);
                setStage("error");
              }}
            />

            {/* No CV option */}
            <div className="text-center">
              <button
                onClick={() => { setQStep(0); setQAnswers({}); setStage("questionnaire"); }}
                className="text-sm text-slate-400 hover:text-indigo-600 transition-colors underline underline-offset-2"
              >
                No CV? Answer a few questions instead →
              </button>
            </div>

            {/* How it works */}
            <div className="grid grid-cols-3 gap-6 pt-2 border-t border-slate-100">
              {[
                { step: "1", title: "Drop your CV", desc: "Read in your browser. Email, phone & links stripped before anything leaves your device" },
                { step: "2", title: "AI scans the market", desc: "Thousands of live roles matched to your skills" },
                { step: "3", title: "Get your shortlist", desc: "Ranked results ready to apply to in seconds" },
              ].map((item) => (
                <div key={item.step} className="text-center pt-4">
                  <div className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-1">
                    Step {item.step}
                  </div>
                  <div className="font-semibold text-slate-700 text-sm">{item.title}</div>
                  <div className="text-slate-400 text-xs mt-1 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── QUESTIONNAIRE ── */}
        {stage === "questionnaire" && (() => {
          const q = QUESTIONS[qStep];
          const answer = qAnswers[q.id] ?? "";
          const canAdvance = q.optional || answer.trim().length > 0;
          const isLast = qStep === QUESTIONS.length - 1;

          return (
            <div className="py-16 max-w-lg mx-auto space-y-8">
              {/* Header */}
              <div className="space-y-1">
                <button onClick={reset} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  ← Back
                </button>
                <h2 className="text-2xl font-bold text-slate-800">Let&apos;s find you something</h2>
                <p className="text-slate-400 text-sm">Answer {QUESTIONS.length} quick questions and we&apos;ll search live jobs for you.</p>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-2">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= qStep ? "bg-indigo-500" : "bg-slate-100"}`}
                  />
                ))}
              </div>

              {/* Question card */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-1">
                    Question {qStep + 1} of {QUESTIONS.length}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-800">{q.question}</h3>
                  {q.optional && <p className="text-xs text-slate-400 mt-0.5">Optional — skip if not applicable</p>}
                </div>

                {q.type === "choice" && q.options ? (
                  <div className="grid grid-cols-2 gap-3">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setQAnswers({ ...qAnswers, [q.id]: opt })}
                        className={[
                          "px-4 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all",
                          answer === opt
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    autoFocus
                    type="text"
                    value={answer}
                    onChange={(e) => setQAnswers({ ...qAnswers, [q.id]: e.target.value })}
                    onKeyDown={(e) => { if (e.key === "Enter" && canAdvance) handleQNext(); }}
                    placeholder={q.hint}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => qStep > 0 ? setQStep(qStep - 1) : reset()}
                  className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ← {qStep > 0 ? "Back" : "Cancel"}
                </button>
                <button
                  onClick={handleQNext}
                  disabled={!canAdvance}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLast ? "Find my matches →" : "Next →"}
                </button>
              </div>
            </div>
          );
        })()}

        {/* ── MATCHING ── */}
        {stage === "matching" && (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="w-14 h-14 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
            <div>
              <p className="text-lg font-semibold text-slate-700 transition-all">
                {MATCHING_STEPS[matchingStep]}
              </p>
              <p className="text-slate-400 mt-1 text-sm">
                {matchingStep === 0 && <>{fileName.includes("(no CV)") ? <>Building your profile…</> : <>Parsing <span className="font-medium text-slate-600">{fileName}</span></>}</>}
                {matchingStep === 1 && <>Checking Adzuna, Seek, LinkedIn &amp; more</>}
                {matchingStep === 2 && <>Almost there — finding your best matches</>}
              </p>
            </div>
            {/* Step indicators */}
            <div className="flex items-center gap-2">
              {MATCHING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= matchingStep ? "bg-indigo-500" : "bg-slate-200"}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {stage === "results" && result && (
          <div className="py-8 space-y-8">
            {/* Results header */}
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {sortedJobs.length} matches found
                </h2>
                <p className="text-slate-400 text-sm mt-0.5">
                  {result.profile.jobTitles[0]} · {result.profile.experienceLevel} level ·{" "}
                  {COUNTRIES.find((c) => c.code === country)?.label}
                </p>
              </div>
              <button
                onClick={reset}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                ← Upload another CV
              </button>
            </div>

            {/* Refine controls */}
            <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Refine results</p>
              <div className="flex items-center gap-2 flex-wrap">
                <label htmlFor="refine-location" className="text-xs text-slate-500 shrink-0 w-16">Location</label>
                <input
                  id="refine-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={`Anywhere in ${COUNTRIES.find((c) => c.code === country)?.label.replace(/^.+ /, "") ?? "the country"}`}
                  onKeyDown={(e) => { if (e.key === "Enter") handleRefine(); }}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent w-44"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <label htmlFor="refine-keywords" className="text-xs text-slate-500 shrink-0 w-16">Keywords</label>
                <input
                  id="refine-keywords"
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. remote, fintech, Python"
                  onKeyDown={(e) => { if (e.key === "Enter") handleRefine(); }}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent w-44"
                />
              </div>
              <div>
                <button
                  onClick={handleRefine}
                  className="text-xs px-4 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors"
                >
                  Update results
                </button>
              </div>
            </div>

            {/* Extracted keywords */}
            {result.profile.skills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Extracted Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sort control */}
            {sortedJobs.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Sort by:</span>
                {(["relevance", "salary", "newest"] as SortKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSortKey(key)}
                    className={[
                      "text-xs px-3 py-1.5 rounded-full font-medium transition-colors",
                      sortKey === key
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                    ].join(" ")}
                  >
                    {key === "relevance" ? "Relevance" : key === "salary" ? "Salary" : "Newest"}
                  </button>
                ))}
              </div>
            )}

            {/* Tiered job results */}
            {sortedJobs.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-medium text-slate-600">No live matches right now.</p>
                <p className="text-sm mt-1">Try adding keywords above or upload a different CV.</p>
                <button
                  onClick={reset}
                  className="mt-5 inline-flex items-center px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Try again
                </button>
              </div>
            ) : sortKey !== "relevance" ? (
              /* Flat grid when sorted */
              <div className="grid sm:grid-cols-2 gap-4">
                {sortedJobs.map((job, i) => (
                  <JobCard key={job.id || i} job={job} currency={currency} />
                ))}
              </div>
            ) : (
              /* Tiered view when sorted by relevance */
              <div className="space-y-8">
                {TIERS.map(({ label, range, accent, dot }) => {
                  const tier = sortedJobs.slice(range[0], range[1] + 1);
                  if (tier.length === 0) return null;
                  return (
                    <div key={label}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-2 h-2 rounded-full ${dot}`} />
                        <h3 className={`text-sm font-semibold ${accent}`}>
                          {label}
                        </h3>
                        <span className="text-xs text-slate-300">
                          {tier.length} {tier.length === 1 ? "role" : "roles"}
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {tier.map((job, i) => (
                          <JobCard key={job.id || i} job={job} currency={currency} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-xs text-center text-slate-300 pb-4">
              Clicking &ldquo;Apply Now&rdquo; takes you to the original listing
            </p>
          </div>
        )}

        {/* ── ERROR ── */}
        {stage === "error" && (
          <div className="text-center space-y-4 py-32">
            <p className="text-4xl">😬</p>
            <div>
              <p className="font-semibold text-slate-700">Something went wrong</p>
              <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">{error}</p>
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-100 py-5 text-center text-xs text-slate-300">
        dropmycv · No data stored · No account needed
        <span className="mx-3">·</span>
        <a href="/privacy" className="hover:text-slate-500 transition-colors">Privacy</a>
        <span className="mx-2">·</span>
        <a href="/terms" className="hover:text-slate-500 transition-colors">Terms</a>
        <span className="mx-2">·</span>
        <a href="mailto:hello@dropmycv.app" className="hover:text-slate-500 transition-colors">Contact us</a>
      </footer>
    </div>
  );
}
