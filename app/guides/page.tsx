import Link from "next/link";
import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-shell";
import { GUIDES, formatGuideDate } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Job-search & CV guides — dropmycv",
  description:
    "Practical, no-fluff guides on job searching, CVs and keeping your search private — from spotting ghost jobs to getting past CV filters.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndex() {
  return (
    <MarketingShell>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
            Guides
          </h1>
          <p className="text-slate-500">
            Practical, no-fluff advice on job searching, CVs and keeping your search private.
          </p>
        </div>

        <div className="space-y-4">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-teal hover:shadow-sm transition-all"
            >
              <h2 className="font-serif font-bold text-navy text-lg leading-snug">{g.title}</h2>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{g.description}</p>
              <p className="text-xs text-slate-500 mt-3">{formatGuideDate(g.date)} · {g.readMins} min read</p>
            </Link>
          ))}
        </div>

        <div className="rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-6 text-center">
          <h2 className="text-lg font-serif font-bold text-navy mb-1">Skip the scrolling</h2>
          <p className="text-sm text-slate-500 mb-4">Drop your CV and get a ranked shortlist of live roles — free, in seconds, nothing stored.</p>
          <Link
            href="/#upload"
            className="inline-block text-sm px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
          >
            Match my CV — free →
          </Link>
        </div>
      </div>
    </MarketingShell>
  );
}
