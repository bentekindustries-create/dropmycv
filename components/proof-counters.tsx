"use client";

import { useEffect, useState } from "react";
import type { Counters } from "@/lib/counters";

// Honesty floor: don't show proof numbers until they're actually credible. Below
// this the strip renders nothing — no fake seeds, no weak "12 searches" signal.
const MIN_SEARCHES = 100;

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

  if (!data || data.searches < MIN_SEARCHES) return null;

  const fmt = (n: number) => n.toLocaleString();
  const items = [
    { n: data.searches, label: "searches run" },
    { n: data.checks, label: "CVs checked" },
    { n: data.matches, label: "job matches surfaced" },
  ].filter((i) => i.n > 0);

  return (
    <div className="text-center">
      <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-xl border border-slate-100 bg-white/60 px-5 py-3">
        {items.map((i) => (
          <div key={i.label} className="flex items-baseline gap-1.5">
            <span className="text-lg font-serif font-bold text-navy">{fmt(i.n)}</span>
            <span className="text-xs text-slate-500">{i.label}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-500 mt-1.5">
        Anonymous running totals — just counts, nothing about you or your CV.
      </p>
    </div>
  );
}
