"use client";

import { useEffect, useRef, useState } from "react";

type Stage = "idle" | "sending" | "sent" | "error";

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Close on Escape; focus the textarea when opened.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => textareaRef.current?.focus(), 50);
    return () => { window.removeEventListener("keydown", onKey); clearTimeout(t); };
  }, [open]);

  function reset() {
    setStage("idle");
    setMessage("");
    setEmail("");
    setCompany("");
    setError("");
  }

  async function submit() {
    if (message.trim().length < 3 || stage === "sending") return;
    setStage("sending");
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim() || undefined,
          company: company || undefined,
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't send your feedback.");
      setStage("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStage("error");
    }
  }

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => { reset(); setOpen(true); }}
        aria-label="Share feedback"
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-1.5 rounded-full bg-navy text-white text-sm font-semibold px-4 py-2.5 shadow-lg hover:bg-navy-dark transition-colors print:hidden"
      >
        💬 Feedback
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Share feedback"
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {stage === "sent" ? (
              <div className="text-center space-y-3 py-2">
                <div className="text-3xl" aria-hidden>🙏</div>
                <h2 className="text-lg font-serif font-bold text-navy">Thank you!</h2>
                <p className="text-sm text-slate-500">
                  Your feedback went straight to our inbox. We read every message.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-1 text-sm px-5 py-2 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-navy">Share feedback</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Found a bug or have an idea? We&apos;d love to hear it.
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="shrink-0 text-slate-400 hover:text-slate-600 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={4000}
                  placeholder="What's on your mind?"
                  className="w-full rounded-xl border border-slate-200 p-3 text-slate-700 focus:border-teal focus:outline-none"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email (optional — only if you'd like a reply)"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-teal focus:outline-none"
                />

                {/* Honeypot — visually hidden, off-screen; bots fill it, humans don't */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="absolute left-[-9999px] w-px h-px opacity-0"
                />

                {error && <p className="text-sm text-rose-600 mt-2">{error}</p>}

                <div className="flex items-center justify-between mt-3">
                  <p className="text-[11px] text-slate-400">Goes to our inbox · not stored</p>
                  <button
                    onClick={submit}
                    disabled={message.trim().length < 3 || stage === "sending"}
                    className="text-sm px-5 py-2.5 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {stage === "sending" ? "Sending…" : "Send feedback"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
