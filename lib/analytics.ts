import { track } from "@vercel/analytics";

// Anonymous funnel events. NEVER pass CV content, names, emails, locations a
// person typed, or anything else that could identify someone — only low-cardinality
// counts, buckets, and enums. The privacy policy commits to anonymous analytics, so
// keep these literally non-identifying.
export type FunnelEvent =
  | "cv_uploaded" // a CV file was parsed in the browser
  | "match_started" // a match request was fired
  | "match_completed" // results returned
  | "match_failed"
  | "match_refined" // user re-ran with refined filters/location
  | "review_checkout_started" // A$9 CV review checkout opened
  | "review_completed"
  | "pack_checkout_started" // A$19 Application Pack checkout opened
  | "pack_completed"
  | "pack_emailed"
  | "free_check_completed"; // free /cv-checker teaser returned

type Props = Record<string, string | number | boolean>;

// Coarse bucket so we never expose precise (potentially correlatable) counts.
export function bucketCount(n: number): string {
  if (n <= 0) return "0";
  if (n <= 5) return "1-5";
  if (n <= 15) return "6-15";
  if (n <= 30) return "16-30";
  return "30+";
}

export function trackEvent(name: FunnelEvent, props?: Props): void {
  try {
    track(name, props);
  } catch {
    /* analytics must never break the app */
  }
}
