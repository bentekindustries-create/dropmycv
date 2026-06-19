import type { JobMatch } from "@/lib/types";

function formatSalary(currency: string, min?: number, max?: number): string {
  if (!min && !max) return "";
  const fmt = (n: number) =>
    n >= 1000 ? `${currency}${(n / 1000).toFixed(0)}k` : `${currency}${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return `Up to ${fmt(max!)}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function scoreColors(score: number) {
  if (score >= 85) return "bg-emerald-50 text-emerald-700";
  if (score >= 65) return "bg-blue-50 text-blue-700";
  return "bg-slate-100 text-slate-500";
}

interface JobCardProps {
  job: JobMatch;
  currency: string;
}

export function JobCard({ job, currency }: JobCardProps) {
  const salary = formatSalary(currency, job.salaryMin, job.salaryMax);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all flex flex-col gap-3">
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
        <p className="text-xs text-slate-400 italic leading-snug">{job.matchReason}</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {salary && (
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            {salary}
          </span>
        )}
        <span className="text-xs text-slate-400">{timeAgo(job.created)}</span>
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
        className="mt-auto inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
      >
        Apply Now →
      </a>
    </div>
  );
}
