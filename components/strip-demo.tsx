"use client";

import { useState } from "react";
import { stripPii } from "@/lib/strip-pii";

const SAMPLE = `Jane Smith
jane.smith@gmail.com  |  +61 412 345 678  |  linkedin.com/in/janesmith

Senior Project Manager with 8 years delivering infrastructure programs.
Led a $70M investment case and a team of 12 across policy and delivery.`;

export function StripDemo() {
  const [show, setShow] = useState(false);
  const stripped = stripPii(SAMPLE);

  return (
    <div className="not-prose">
      <button
        onClick={() => setShow((v) => !v)}
        className="text-sm font-semibold text-teal hover:text-navy underline underline-offset-2"
      >
        {show ? "Hide" : "Don't believe us? See exactly what we send →"}
      </button>

      {show && (
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-widest mb-2">Your CV (in your browser)</p>
            <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono leading-relaxed">{SAMPLE}</pre>
          </div>
          <div className="rounded-xl border border-[#c8ecea] bg-teal-light/40 p-4">
            <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-2">What actually gets sent</p>
            <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono leading-relaxed">{stripped}</pre>
          </div>
          <p className="sm:col-span-2 text-xs text-slate-400">
            This runs the real function we use. Your email, phone and links become{" "}
            <code className="text-slate-500">[email]</code>, <code className="text-slate-500">[phone]</code> and{" "}
            <code className="text-slate-500">[link]</code> before anything leaves your browser. Your name and
            experience stay in the text used to find matches — and even that is never stored.
          </p>
        </div>
      )}
    </div>
  );
}
