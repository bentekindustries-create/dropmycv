// Guide registry — drives the /guides index, individual pages, sitemap and
// generateStaticParams. Bodies live in components/guides.tsx, keyed by slug.

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO (publish date)
  readMins: number;
}

export const GUIDES: GuideMeta[] = [
  {
    slug: "spot-a-ghost-job",
    title: "Ghost jobs: how to spot a listing that's already filled",
    description:
      "A lot of job ads are stale, evergreen, or never real. Here's how to tell which postings are worth your time before you spend an hour on the application.",
    date: "2026-06-22",
    readMins: 5,
  },
  {
    slug: "cv-keywords-that-get-past-filters",
    title: "The CV keywords that actually get you past the filter",
    description:
      "Keyword-stuffing doesn't work, but missing the right terms gets you screened out. Here's how to find the keywords that matter for the jobs you're actually targeting.",
    date: "2026-06-22",
    readMins: 6,
  },
  {
    slug: "job-search-while-employed-privately",
    title: "How to job-search while employed — without your boss finding out",
    description:
      "Looking for a new role while you're still in one is nerve-wracking. Here's how to keep your search private, from your CV to your online footprint.",
    date: "2026-06-22",
    readMins: 6,
  },
];

export function guideBySlug(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function formatGuideDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}
