"use client";

import { useEffect, useMemo, useState } from "react";
import { CvDropzone } from "@/components/cv-dropzone";
import { JobCard } from "@/components/job-card";
import { SkillPicker } from "@/components/skill-picker";
import { CvReviewCard } from "@/components/cv-review";
import { COUNTRIES, getCurrency } from "@/lib/countries";
import type { JobMatch, MatchResult, CvReview } from "@/lib/types";

type Stage = "idle" | "questionnaire" | "matching" | "results" | "error";
type SortKey = "relevance" | "salary" | "newest";

const QUESTIONS = [
  {
    id: "skills",
    question: "What's your area of expertise?",
    hint: "e.g. Python, project management, customer service, graphic design",
    type: "text" as const,
    optional: false,
  },
  {
    id: "role",
    question: "What specific role are you looking for?",
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
  { label: "Top Matches", range: [0, 4], accent: "text-teal", dot: "bg-teal" },
  { label: "Good Matches", range: [5, 9], accent: "text-navy", dot: "bg-navy" },
  { label: "Worth a Look", range: [10, 14], accent: "text-slate-500", dot: "bg-slate-400" },
];

const MATCHING_STEPS = [
  "Reading & anonymising your CV…",
  "Searching live jobs…",
  "Ranking your matches…",
];

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes — matching your CV to live jobs is completely free, with no account and no limit. The only paid extra is an optional AI review of your CV for a one-off A$9.",
  },
  {
    q: "Is my CV safe? Do you store it?",
    a: "Your CV is read inside your browser, and your name, email, phone number and links are stripped out before any text is sent for matching. Nothing is stored on our servers — every search is stateless. No account, no profile, no tracking.",
  },
  {
    q: "How is this different from Indeed or Seek?",
    a: "Instead of one board and 900 results to wade through, we search six live job sources at once and use AI to rank them against your actual skills — so you get a short, relevant shortlist with a match score and reason for each. And we never make you create an account or keep your data.",
  },
  {
    q: "Do I need to sign up or create an account?",
    a: "No. There's no sign-up, login, or password — ever. Drop your CV and you get matches in seconds.",
  },
  {
    q: "What do I get for the A$9 CV review?",
    a: "An instant expert review checked against the live roles you just matched to: an overall score, your strengths, the exact keywords those jobs want that your CV is missing, stronger rewrites of weak lines, and a prioritised action list. It's something a generic chatbot can't give you, because only we know which live jobs you're competing for.",
  },
  {
    q: "Which countries does it work in?",
    a: "Australia, the United Kingdom, the United States, Canada, New Zealand, Germany, France, the Netherlands and Singapore.",
  },
];

const STORAGE_KEY = "dropmycv_last_session";
const PENDING_REVIEW_KEY = "dropmycv_pending_review";
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

type WorkFilter = "any" | "remote" | "hybrid" | "onsite";

function jobWorkType(job: JobMatch): "remote" | "hybrid" | "onsite" {
  const hay = `${job.location} ${job.description}`.toLowerCase();
  if (/\bhybrid\b/.test(hay)) return "hybrid";
  if (/\b(remote|work from home|wfh|anywhere|telecommute)\b/.test(hay)) return "remote";
  return "onsite";
}

function hasSalary(job: JobMatch): boolean {
  return Boolean(job.salaryMin || job.salaryMax);
}

const HIDDEN_KEY = "dropmycv_hidden";

function loadHidden(): { jobs: string[]; companies: string[] } {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    if (!raw) return { jobs: [], companies: [] };
    const parsed = JSON.parse(raw);
    return {
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
      companies: Array.isArray(parsed.companies) ? parsed.companies : [],
    };
  } catch {
    return { jobs: [], companies: [] };
  }
}

function saveHidden(jobs: string[], companies: string[]) {
  try {
    localStorage.setItem(HIDDEN_KEY, JSON.stringify({ jobs, companies }));
  } catch {}
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
  const [workFilter, setWorkFilter] = useState<WorkFilter>("any");
  const [onlySalary, setOnlySalary] = useState(false);
  const [hiddenJobs, setHiddenJobs] = useState<string[]>([]);
  const [hiddenCompanies, setHiddenCompanies] = useState<string[]>([]);
  const [reviewStage, setReviewStage] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [review, setReview] = useState<CvReview | null>(null);
  const [reviewError, setReviewError] = useState("");
  const [paidSessionId, setPaidSessionId] = useState("");

  const currency = getCurrency(country);

  // Apply hide list + work-type + salary filters, then sort
  const visibleJobs = useMemo(() => {
    const all = result?.jobs ?? [];
    const hiddenJobSet = new Set(hiddenJobs);
    const hiddenCompanySet = new Set(hiddenCompanies.map((c) => c.toLowerCase()));
    const filtered = all.filter((job) => {
      if (hiddenJobSet.has(job.id)) return false;
      if (job.company && hiddenCompanySet.has(job.company.toLowerCase())) return false;
      if (onlySalary && !hasSalary(job)) return false;
      if (workFilter !== "any" && jobWorkType(job) !== workFilter) return false;
      return true;
    });
    return sortJobs(filtered, sortKey);
  }, [result?.jobs, sortKey, workFilter, onlySalary, hiddenJobs, hiddenCompanies]);

  const sortedJobs = visibleJobs;
  const hiddenCount = (result?.jobs ?? []).length - (result?.jobs ?? []).filter((job) => {
    return !hiddenJobs.includes(job.id) && !(job.company && hiddenCompanies.map((c) => c.toLowerCase()).includes(job.company.toLowerCase()));
  }).length;

  // Company-direct (ATS) roles, hide-list filtered — shown in their own section
  const visibleDirectJobs = useMemo(() => {
    const hiddenJobSet = new Set(hiddenJobs);
    const hiddenCompanySet = new Set(hiddenCompanies.map((c) => c.toLowerCase()));
    return (result?.directJobs ?? []).filter(
      (job) => !hiddenJobSet.has(job.id) && !(job.company && hiddenCompanySet.has(job.company.toLowerCase()))
    );
  }, [result?.directJobs, hiddenJobs, hiddenCompanies]);

  function hideJob(id: string) {
    setHiddenJobs((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      saveHidden(next, hiddenCompanies);
      return next;
    });
  }

  function hideCompany(company: string) {
    setHiddenCompanies((prev) => {
      const next = prev.includes(company) ? prev : [...prev, company];
      saveHidden(hiddenJobs, next);
      return next;
    });
  }

  function clearHidden() {
    setHiddenJobs([]);
    setHiddenCompanies([]);
    saveHidden([], []);
  }

  // On mount: load hidden list, handle a returning Stripe checkout, or flag a saved session
  useEffect(() => {
    const hidden = loadHidden();
    setHiddenJobs(hidden.jobs);
    setHiddenCompanies(hidden.companies);

    const params = new URLSearchParams(window.location.search);
    const cvReview = params.get("cv_review");

    function restoreResults() {
      const saved = loadSession();
      if (saved) {
        setResult(saved.result);
        setFileName(saved.fileName);
        setCountry(saved.country);
        setLocation(saved.location);
        setStage("results");
      }
      return saved;
    }

    if (cvReview === "success") {
      const sessionId = params.get("session_id") || "";
      restoreResults();
      let pending: { cvText: string; targetRole: string; jobs?: { title: string; description: string }[] } | null = null;
      try {
        const raw = sessionStorage.getItem(PENDING_REVIEW_KEY);
        if (raw) pending = JSON.parse(raw);
      } catch {}
      sessionStorage.removeItem(PENDING_REVIEW_KEY);
      window.history.replaceState({}, "", "/");
      if (pending?.cvText && sessionId) {
        setLastCvText(pending.cvText);
        setPaidSessionId(sessionId);
        runPaidReview(pending.cvText, pending.targetRole, sessionId, pending.jobs ?? []);
      } else {
        setReviewError("We couldn't find your CV to review. Please re-upload and try again.");
        setReviewStage("error");
      }
      return;
    }

    if (cvReview === "cancel") {
      window.history.replaceState({}, "", "/");
      restoreResults();
      return;
    }

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

  async function startCheckout() {
    if (!lastCvText || reviewStage === "loading") return;
    try {
      // Stash the CV + matched jobs in the browser so they survive the Stripe redirect
      // (nothing server-side). The jobs let the review check against live demand.
      sessionStorage.setItem(
        PENDING_REVIEW_KEY,
        JSON.stringify({
          cvText: lastCvText,
          targetRole: result?.profile.jobTitles[0] ?? "",
          jobs: (result?.jobs ?? []).slice(0, 6).map((j) => ({ title: j.title, description: j.description })),
        })
      );
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout.");
      window.location.href = data.url;
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Could not start checkout.");
      setReviewStage("error");
    }
  }

  function retryReview() {
    // If payment already succeeded, re-run generation (no new charge); otherwise start checkout
    if (paidSessionId) {
      const jobs = (result?.jobs ?? []).slice(0, 6).map((j) => ({ title: j.title, description: j.description }));
      runPaidReview(lastCvText, result?.profile.jobTitles[0] ?? "", paidSessionId, jobs);
    } else {
      startCheckout();
    }
  }

  async function runPaidReview(
    cvText: string,
    targetRole: string,
    sessionId: string,
    jobs: { title: string; description: string }[]
  ) {
    setReviewStage("loading");
    setReviewError("");
    try {
      const res = await fetch("/api/cv-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, targetRole, sessionId, jobs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not generate a review.");
      setReview(data.review as CvReview);
      setReviewStage("done");
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Something went wrong.");
      setReviewStage("error");
    }
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
    setReviewStage("idle");
    setReview(null);
    setReviewError("");
    setPaidSessionId("");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mock mode banner */}
      {process.env.NEXT_PUBLIC_MOCK_MODE === "true" && (
        <div className="bg-amber-400 text-amber-900 text-xs font-semibold text-center py-1.5 tracking-wide">
          ⚠ MOCK MODE — fake data only, no API calls made
        </div>
      )}

      {/* Header */}
      <header className="bg-navy px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="https://www.dropmycv.app" onClick={(e) => { e.preventDefault(); reset(); }} className="text-2xl font-extrabold tracking-tight transition-colors group">
            <span className="text-teal">drop</span><span className="text-white group-hover:text-teal">mycv</span><span className="text-teal">.app</span>
          </a>
          <span className="text-xs text-white/60 hidden sm:block">
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
              <div className="flex items-center justify-between bg-teal-light border border-[#c8ecea] rounded-xl px-4 py-3">
                <p className="text-sm text-navy font-medium">You have results from your last session.</p>
                <button
                  onClick={restoreSession}
                  className="text-xs font-semibold text-teal hover:text-navy underline underline-offset-2"
                >
                  View them →
                </button>
              </div>
            )}

            {/* Hero */}
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-serif font-bold text-navy tracking-tight leading-tight">
                Get matched to live jobs in seconds —<br />
                <span className="text-teal">without handing over your data.</span>
              </h1>
              <p className="text-slate-500 text-base max-w-xl mx-auto">
                Drop your CV and our AI ranks thousands of live roles from Seek, LinkedIn, Indeed
                &amp; more against your actual skills. No sign-up, no spam — and your name, email
                &amp; phone never leave your browser.
              </p>
            </div>

            {/* Trust bar */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {[
                { icon: "🔒", label: "No cookies · anonymous stats only" },
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
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
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
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                />
              </div>
            </div>

            {/* Drop zone */}
            <div id="upload" className="scroll-mt-6">
              <CvDropzone
                onExtracted={handleExtracted}
                onError={(msg) => {
                  setError(msg);
                  setStage("error");
                }}
              />
            </div>

            {/* No CV option */}
            <div className="text-center">
              <button
                onClick={() => { setQStep(0); setQAnswers({}); setStage("questionnaire"); }}
                className="text-sm text-slate-400 hover:text-teal transition-colors underline underline-offset-2"
              >
                No CV? Answer a few questions instead →
              </button>
            </div>

            {/* AI CV review — paid add-on, pitched on the landing page (#2) */}
            <div className="rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-5 sm:p-6 text-center space-y-2">
              <p className="text-xs font-semibold text-teal uppercase tracking-widest">Optional add-on · A$9</p>
              <h3 className="text-lg font-serif font-bold text-navy">Get an expert AI review of your CV</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Not generic feedback — we check your CV against the{" "}
                <span className="font-medium text-navy">live roles you actually match</span>, so you
                fix the exact gaps employers are hiring for right now.
              </p>
              <a
                href="#upload"
                className="inline-block mt-1 text-sm px-5 py-2 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
              >
                Drop your CV to start →
              </a>
            </div>

            {/* How it works */}
            <div className="grid grid-cols-3 gap-6 pt-2 border-t border-slate-100">
              {[
                { step: "1", title: "Drop it in", desc: "Scanned right in your browser — your name, number & email never leave your device" },
                { step: "2", title: "We read the whole market", desc: "Thousands of live roles scanned in seconds, so you don't have to" },
                { step: "3", title: "Skip the scrolling", desc: "A ranked shortlist you can actually apply to — not 900 tabs to sift through" },
              ].map((item) => (
                <div key={item.step} className="text-center pt-4">
                  <div className="text-xs font-semibold text-teal uppercase tracking-widest mb-1">
                    Step {item.step}
                  </div>
                  <div className="font-semibold text-slate-700 text-sm">{item.title}</div>
                  <div className="text-slate-400 text-xs mt-1 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Proof strip — real, claimable sources */}
            <div className="text-center pt-2">
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
                Six live job sources, one ranked shortlist
              </p>
              <div className="flex items-center justify-center gap-x-4 gap-y-2 flex-wrap text-sm font-medium text-slate-500">
                {["Seek", "LinkedIn", "Indeed", "Greenhouse", "Lever", "Jora", "Careerjet"].map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="pt-4 border-t border-slate-100">
              <h2 className="text-lg font-serif font-bold text-navy text-center mb-5">
                Common questions
              </h2>
              <div className="space-y-4 max-w-2xl mx-auto">
                {FAQS.map((f) => (
                  <div key={f.q}>
                    <p className="text-sm font-semibold text-slate-700">{f.q}</p>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ structured data for SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: FAQS.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              }}
            />
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
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= qStep ? "bg-teal" : "bg-slate-100"}`}
                  />
                ))}
              </div>

              {/* Question card */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-1">
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
                            ? "border-teal bg-teal-light text-navy"
                            : "border-slate-200 text-slate-600 hover:border-teal hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : q.id === "skills" ? (
                  <SkillPicker
                    value={answer}
                    onChange={(v) => setQAnswers({ ...qAnswers, skills: v })}
                  />
                ) : (
                  <input
                    autoFocus
                    type="text"
                    value={answer}
                    onChange={(e) => setQAnswers({ ...qAnswers, [q.id]: e.target.value })}
                    onKeyDown={(e) => { if (e.key === "Enter" && canAdvance) handleQNext(); }}
                    placeholder={q.hint}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
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
                  className="px-6 py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
            <div className="w-14 h-14 border-4 border-slate-100 border-t-teal rounded-full animate-spin" />
            <div>
              <p className="text-lg font-semibold text-slate-700 transition-all">
                {MATCHING_STEPS[matchingStep]}
              </p>
              <p className="text-slate-400 mt-1 text-sm">
                {matchingStep === 0 && <>{fileName.includes("(no CV)") ? <>Building your profile…</> : <>Stripping out your email, phone &amp; personal details</>}</>}
                {matchingStep === 1 && <>Checking Adzuna, Seek, LinkedIn &amp; more</>}
                {matchingStep === 2 && <>Almost there — finding your best matches</>}
              </p>
            </div>
            {/* Step indicators */}
            <div className="flex items-center gap-2">
              {MATCHING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= matchingStep ? "bg-teal" : "bg-slate-200"}`}
                />
              ))}
            </div>
            {/* Persistent privacy reassurance */}
            <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
              <span>🔒</span>
              <span>Your personal details are removed in your browser — they never reach our servers.</span>
            </p>
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
                className="text-sm text-teal hover:text-navy font-medium"
              >
                ← Upload another CV
              </button>
            </div>

            {/* AI CV review */}
            {!fileName.includes("(no CV)") && (
              <div>
                {reviewStage === "idle" && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-[#c8ecea] bg-teal-light/40 px-4 py-3 flex-wrap">
                    <p className="text-sm text-navy">
                      <span className="font-semibold">✨ Want to land more of these?</span> Get an AI
                      review of your CV — checked against the live roles you just matched, so you fix
                      the exact gaps employers want.
                    </p>
                    <button
                      onClick={startCheckout}
                      className="text-sm px-4 py-2 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors shrink-0"
                    >
                      Review my CV — A$9
                    </button>
                  </div>
                )}
                {reviewStage === "loading" && (
                  <div className="flex items-center gap-3 rounded-xl border border-[#c8ecea] bg-teal-light/40 px-4 py-4">
                    <div className="w-5 h-5 border-2 border-slate-200 border-t-teal rounded-full animate-spin" />
                    <p className="text-sm text-slate-600">Reviewing your CV…</p>
                  </div>
                )}
                {reviewStage === "error" && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
                    <p className="text-sm text-rose-700">{reviewError}</p>
                    <button onClick={retryReview} className="text-sm font-semibold text-rose-700 underline">
                      Try again
                    </button>
                  </div>
                )}
                {reviewStage === "done" && review && <CvReviewCard review={review} />}
              </div>
            )}

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
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent w-44"
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
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent w-44"
                />
              </div>
              <div>
                <button
                  onClick={handleRefine}
                  className="text-xs px-4 py-1.5 rounded-lg bg-navy text-white hover:bg-navy-dark font-medium transition-colors"
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

            {/* Straight from the employer — company-direct ATS roles, featured up top */}
            {visibleDirectJobs.length > 0 && (
              <div className="rounded-xl border border-[#c8ecea] bg-teal-light/40 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span>🏢</span>
                  <h3 className="text-sm font-semibold text-navy">Straight from the employer</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Posted directly on company career pages — often the freshest, most genuine listings.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {visibleDirectJobs.map((job, i) => (
                    <JobCard key={job.id || i} job={job} currency={currency} onHideJob={hideJob} onHideCompany={hideCompany} />
                  ))}
                </div>
              </div>
            )}

            {/* Sort + filter controls */}
            <div className="flex flex-col gap-3">
              {/* Sort */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 w-16">Sort by:</span>
                {(["relevance", "salary", "newest"] as SortKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSortKey(key)}
                    className={[
                      "text-xs px-3 py-1.5 rounded-full font-medium transition-colors",
                      sortKey === key
                        ? "bg-navy text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                    ].join(" ")}
                  >
                    {key === "relevance" ? "Relevance" : key === "salary" ? "Salary" : "Newest"}
                  </button>
                ))}
              </div>

              {/* Work type */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 w-16">Work type:</span>
                {([
                  { key: "any", label: "Any" },
                  { key: "remote", label: "🌏 Remote" },
                  { key: "hybrid", label: "🏠 Hybrid" },
                  { key: "onsite", label: "🏢 On-site" },
                ] as { key: WorkFilter; label: string }[]).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setWorkFilter(key)}
                    className={[
                      "text-xs px-3 py-1.5 rounded-full font-medium transition-colors",
                      workFilter === key
                        ? "bg-navy text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Salary toggle */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 w-16">Salary:</span>
                <button
                  onClick={() => setOnlySalary((v) => !v)}
                  className={[
                    "text-xs px-3 py-1.5 rounded-full font-medium transition-colors",
                    onlySalary
                      ? "bg-navy text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                  ].join(" ")}
                >
                  {onlySalary ? "✓ Only jobs with salary" : "Only jobs with salary"}
                </button>
              </div>

              {/* Hidden notice */}
              {hiddenCount > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{hiddenCount} job{hiddenCount === 1 ? "" : "s"} hidden</span>
                  <button
                    onClick={clearHidden}
                    className="text-teal hover:text-navy font-medium underline underline-offset-2"
                  >
                    Show all
                  </button>
                </div>
              )}
            </div>

            {/* Tiered job results */}
            {sortedJobs.length === 0 ? (
              (result.jobs.length > 0) ? (
                /* Jobs exist but filters hid them all */
                <div className="text-center py-16 text-slate-400">
                  <p className="text-4xl mb-3">🫥</p>
                  <p className="font-medium text-slate-600">No jobs match your filters.</p>
                  <p className="text-sm mt-1">Try widening the work type or salary filter.</p>
                  <button
                    onClick={() => { setWorkFilter("any"); setOnlySalary(false); clearHidden(); }}
                    className="mt-5 inline-flex items-center px-5 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-dark transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="font-medium text-slate-600">No live matches right now.</p>
                  <p className="text-sm mt-1">Try adding keywords above or upload a different CV.</p>
                  <button
                    onClick={reset}
                    className="mt-5 inline-flex items-center px-5 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-dark transition-colors"
                  >
                    Try again
                  </button>
                </div>
              )
            ) : sortKey !== "relevance" ? (
              /* Flat grid when sorted */
              <div className="grid sm:grid-cols-2 gap-4">
                {sortedJobs.map((job, i) => (
                  <JobCard key={job.id || i} job={job} currency={currency} onHideJob={hideJob} onHideCompany={hideCompany} />
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
                          <JobCard key={job.id || i} job={job} currency={currency} onHideJob={hideJob} onHideCompany={hideCompany} />
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
              className="inline-flex items-center px-6 py-2.5 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-dark transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </main>

      <footer className="bg-navy py-5 text-center text-xs text-white/40">
        A <span className="font-medium text-white/60">BenTek Industries</span> product
        <span className="mx-3">·</span>
        dropmycv · No data stored · No account needed
        <span className="mx-3">·</span>
        <a href="/cv-review" className="hover:text-white/80 transition-colors">AI CV review</a>
        <span className="mx-2">·</span>
        <a href="/private-job-search" className="hover:text-white/80 transition-colors">Private job search</a>
        <span className="mx-2">·</span>
        <a href="/privacy" className="hover:text-white/80 transition-colors">Privacy</a>
        <span className="mx-2">·</span>
        <a href="/terms" className="hover:text-white/80 transition-colors">Terms</a>
        <span className="mx-2">·</span>
        <a href="mailto:info@dropmycv.app" className="hover:text-white/80 transition-colors">Contact us</a>
      </footer>
    </div>
  );
}
