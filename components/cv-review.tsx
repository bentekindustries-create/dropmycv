import type { CvReview } from "@/lib/types";

function scoreColor(score: number) {
  if (score >= 75) return "text-teal-ink";
  if (score >= 50) return "text-amber-600";
  return "text-rose-600";
}

interface CvReviewCardProps {
  review: CvReview;
}

export function CvReviewCard({ review }: CvReviewCardProps) {
  return (
    <div className="rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-6 space-y-6">
      {/* Header: score + verdict */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 text-center">
          <div className={`text-4xl font-serif font-bold ${scoreColor(review.overallScore)}`}>
            {review.overallScore}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500">/ 100</div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-navy uppercase tracking-widest mb-1">
            Your CV review
          </h3>
          <p className="text-slate-700 leading-snug">{review.verdict}</p>
        </div>
      </div>

      {/* Top priorities */}
      {review.topPriorities.length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-2">
            🎯 Do these first
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-700">
            {review.topPriorities.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Strengths */}
      {review.strengths.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-2">
            ✓ Strengths
          </p>
          <ul className="space-y-1.5 text-sm text-slate-600">
            {review.strengths.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-emerald-500">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {review.improvements.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">
            ⚡ Where to improve
          </p>
          <div className="space-y-3">
            {review.improvements.map((imp, i) => (
              <div key={i} className="text-sm">
                <p className="text-slate-700 font-medium">{imp.issue}</p>
                <p className="text-slate-500 mt-0.5">→ {imp.fix}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewrites */}
      {review.rewrites.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-2">
            ✍️ Stronger rewrites
          </p>
          <div className="space-y-3">
            {review.rewrites.map((r, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-slate-100 text-sm">
                <p className="text-slate-500 line-through leading-snug">{r.before}</p>
                <p className="text-navy font-medium mt-1 leading-snug">{r.after}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ATS keywords */}
      {(review.atsKeywords.present.length > 0 || review.atsKeywords.missing.length > 0) && (
        <div>
          <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-2">
            🔍 ATS keyword check
          </p>
          {review.atsKeywords.present.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-slate-500 mb-1">Already covered</p>
              <div className="flex flex-wrap gap-1.5">
                {review.atsKeywords.present.map((k) => (
                  <span key={k} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                    ✓ {k}
                  </span>
                ))}
              </div>
            </div>
          )}
          {review.atsKeywords.missing.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-1">Consider adding</p>
              <div className="flex flex-wrap gap-1.5">
                {review.atsKeywords.missing.map((k) => (
                  <span key={k} className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">
                    + {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-[11px] text-slate-500 text-center pt-2 border-t border-[#c8ecea]">
        AI-generated guidance · your CV was reviewed in this session and not stored
      </p>
    </div>
  );
}
