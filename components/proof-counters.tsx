"use client";

import { useEffect, useState } from "react";
import type { Counters } from "@/lib/counters";

// The `matches` counter (total live jobs surfaced across all searches) is the
// strongest honest proof metric. Two guards keep the displayed number credible:
//
// 1. QA_MATCHES_OFFSET — the counter accumulated a few hundred matches from
//    pre-launch QA/testing. We subtract a GENEROUS estimate of that so the figure
//    reflects real job-seeker usage and can only ever under-claim. Once real usage
//    dwarfs the test noise (or the Upstash counter is reset to a clean baseline),
//    this can be dropped to 0.
// 2. We floor to the nearest 100 and render "N+", so we never publish a precise,
//    potentially-inflated count — only a conservative milestone.
const QA_MATCHES_OFFSET = 250;
const MIN_DISPLAY = 100; // don't show the strip until the discounted figure clears this

export function ProofCounters() {
  const [data, setData] = useState<Counters | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (live && d?.available) setData({ searches: d.searches, checks: d.checks, matches: d.matches });
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  if (!data) return null;

  const real = Math.max(0, data.matches - QA_MATCHES_OFFSET);
  const milestone = Math.floor(real / 100) * 100;
  if (milestone < MIN_DISPLAY) return null;

  return (
    <div className="text-center">
      <div className="inline-flex items-baseline justify-center gap-2 rounded-xl border border-slate-100 bg-white/60 px-5 py-3">
        <span className="text-lg font-serif font-bold text-navy">{milestone.toLocaleString()}+</span>
        <span className="text-sm text-slate-500">live jobs matched to CVs so far</span>
      </div>
      <p className="text-[11px] text-slate-500 mt-1.5">
        Anonymous running total — just a count, nothing about you or your CV.
      </p>
    </div>
  );
}
