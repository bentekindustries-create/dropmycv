// Anonymous global tallies for social proof. These store ONLY integers — total
// counts across everyone — never anything about a person, a CV, or a single
// search. There is nothing here that could identify anyone or be tied back to a
// user, so it's consistent with the "your CV is never stored / no recruiter
// database" promises (those are about personal data; this is just a number).
//
// Backed by Upstash Redis over its REST API (no SDK dependency). If the env vars
// aren't set, every function here is a safe no-op and the proof strip stays hidden.

const BASE = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const KEYS = {
  searches: "dmc:searches",
  checks: "dmc:checks",
  matches: "dmc:matches",
} as const;

type Metric = keyof typeof KEYS;

function configured(): boolean {
  return Boolean(BASE && TOKEN);
}

async function cmd(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}/${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  const data = (await res.json()) as { result?: unknown };
  return data.result;
}

// Fire-and-forget increment; never throws, never blocks the user's request meaningfully.
export async function bump(metric: Metric, by = 1): Promise<void> {
  if (!configured() || by <= 0) return;
  try {
    await cmd(`incrby/${KEYS[metric]}/${Math.floor(by)}`);
  } catch {
    /* analytics must never break the app */
  }
}

export interface Counters {
  searches: number;
  checks: number;
  matches: number;
}

export async function readCounters(): Promise<Counters | null> {
  if (!configured()) return null;
  try {
    const result = (await cmd(
      `mget/${KEYS.searches}/${KEYS.checks}/${KEYS.matches}`
    )) as (string | number | null)[];
    const [s, c, m] = (Array.isArray(result) ? result : []).map((v) => Number(v) || 0);
    return { searches: s ?? 0, checks: c ?? 0, matches: m ?? 0 };
  } catch {
    return null;
  }
}
