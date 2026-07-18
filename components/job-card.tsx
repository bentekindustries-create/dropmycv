import type { JobMatch } from "@/lib/types";

function formatSalary(currency: string, min?: number, max?: number): string {
  if (!min && !max) return "";
  const fmt = (n: number) =>
    n >= 1000 ? `${currency}${(n / 1000).toFixed(0)}k` : `${currency}${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return `Up to ${fmt(max!)}`;
}

function ageDays(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

function timeAgo(days: number): string {
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// Freshness signal — directly addresses the "ghost job" complaint:
// stale listings are far more likely to be already filled or never-real.
function freshness(days: number): { label: string; cls: string } {
  if (days <= 7) return { label: `🟢 Posted ${timeAgo(days)}`, cls: "bg-emerald-50 text-emerald-700" };
  if (days <= 30) return { label: `🟡 Posted ${timeAgo(days)}`, cls: "bg-amber-50 text-amber-700" };
  return { label: `🔴 Posted ${timeAgo(days)} — may be filled`, cls: "bg-rose-50 text-rose-700" };
}

// Detect work type from location + description for an at-a-glance tag.
function workType(job: JobMatch): string | null {
  const hay = `${job.location} ${job.description}`.toLowerCase();
  if (/\b(hybrid)\b/.test(hay)) return "🏠 Hybrid";
  if (/\b(remote|work from home|wfh|anywhere|telecommute)\b/.test(hay)) return "🌏 Remote";
  return null;
}

function scoreColors(score: number) {
  if (score >= 85) return "bg-teal-light text-teal-ink";
  if (score >= 65) return "bg-[#eef1f7] text-navy";
  return "bg-slate-100 text-slate-500";
}

interface JobCardProps {
  job: JobMatch;
  currency: string;
  onHideJob?: (id: string) => void;
  onHideCompany?: (company: string) => void;
  onLike?: (id: string) => void;
  liked?: boolean;
}

export function JobCard({ job, currency, onHideJob, onHideCompany, onLike, liked }: JobCardProps) {
  const salary = formatSalary(currency, job.salaryMin, job.salaryMax);
  const days = ageDays(job.created);
  const fresh = freshness(days);
  const work = workType(job);

  return (
    <div
      className={[
        "rounded-xl border p-5 hover:shadow-sm transition-all flex flex-col gap-3",
        liked
          ? "bg-teal-light border-teal shadow-sm"
          : "bg-white border-slate-200 hover:border-teal",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-800 leading-snug">{job.title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {job.company}
            {job.location ? ` · ${job.location}` : ""}
          </p>
        </div>
        {job.matchScore !== undefined && (
          <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${scoreColors(job.matchScore)}`}>
            {job.matchScore}% match
          </span>
        )}
      </div>

      {job.matchReason && (
        <p className="text-xs text-slate-500 italic leading-snug">{job.matchReason}</p>
      )}

      {job.matchedSkills && job.matchedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.matchedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full"
            >
              <span className="text-emerald-500">✓</span>
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${fresh.cls}`}>
          {fresh.label}
        </span>
        {work && (
          <span className="text-xs font-medium text-navy bg-[#eef1f7] px-2.5 py-1 rounded-full">
            {work}
          </span>
        )}
        {salary ? (
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            💰 {salary}
          </span>
        ) : (
          <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full">
            Salary not listed
          </span>
        )}
      </div>

      {job.description && (
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      )}

      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center justify-center rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark active:bg-[#0d1f36] transition-colors"
      >
        Apply Now →
      </a>

      {(onLike || onHideJob) && (
        <div className="flex items-center justify-center gap-2 pt-1 border-t border-slate-100">
          {onLike && (
            <button
              onClick={() => onLike(job.id)}
              aria-pressed={liked}
              title={liked ? "Remove from your shortlist" : "Add to your shortlist"}
              className={[
                "inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-colors",
                liked
                  ? "bg-teal text-white hover:bg-teal-dark"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-600",
              ].join(" ")}
            >
              {liked ? "✓ Shortlisted" : "👍 Shortlist"}
            </button>
          )}
          {onHideJob && (
            <button
              onClick={() => onHideJob(job.id)}
              title="Hide this and show fewer like it"
              className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              👎 Not for me
            </button>
          )}
        </div>
      )}

      {onHideCompany && job.company && (
        <div className="flex items-center justify-center text-[11px] text-slate-500">
          <button
            onClick={() => onHideCompany(job.company)}
            className="hover:text-slate-500 transition-colors"
          >
            Hide all {job.company} jobs
          </button>
        </div>
      )}
    </div>
  );
}
