import { readCounters } from "@/lib/counters";

export const runtime = "nodejs";

// Public, anonymous global tallies for the homepage proof strip. Counts only —
// nothing about any person or CV. Cached at the edge so we don't hit Upstash per
// visitor.
export async function GET() {
  const counters = await readCounters();
  if (!counters) {
    return Response.json({ available: false });
  }
  return Response.json(
    { available: true, ...counters },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
