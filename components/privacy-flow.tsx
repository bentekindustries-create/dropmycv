import { Fragment } from "react";

const STEPS = [
  { icon: "📄", title: "Your device", desc: "CV opened & read in your browser" },
  { icon: "✂️", title: "Stripped", desc: "Email, phone & links removed first" },
  { icon: "🤖", title: "Matched", desc: "Text sent securely, ranked by AI" },
  { icon: "🗑️", title: "Discarded", desc: "Nothing stored — no profile" },
];

export function PrivacyFlow() {
  return (
    <div className="not-prose flex flex-col sm:flex-row items-stretch gap-2">
      {STEPS.map((s, i) => (
        <Fragment key={s.title}>
          <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="font-semibold text-navy text-sm">{s.title}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">{s.desc}</p>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex items-center justify-center text-teal-ink font-bold shrink-0">
              <span className="hidden sm:block">→</span>
              <span className="sm:hidden">↓</span>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
