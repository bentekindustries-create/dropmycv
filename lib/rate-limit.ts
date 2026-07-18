// Distributed rate limiting.
//
// WHY: each route previously kept its own in-memory Map. On Vercel every
// serverless instance has its own memory and instances scale horizontally, so
// concurrent requests land on different instances with fresh counters — the real
// ceiling was (max × instance count), and cold starts reset it. Several of these
// routes are unauthenticated, free, and call Claude, so that gap is a direct
// cost-abuse vector.
//
// HOW: Upstash Redis (already used for the proof counters) gives one shared
// counter across instances, via an atomic INCR + EXPIRE-NX pipeline.
//
// DEFENCE IN DEPTH + FAIL OPEN: the per-instance memory check still runs first
// (fast, catches same-instance bursts). If Redis is unconfigured or unreachable we
// fall back to memory-only rather than failing the request — a Redis blip must
// never take the product down.

const BASE = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function redisConfigured(): boolean {
  return Boolean(BASE && TOKEN);
}

// ─── Per-instance fallback ───────────────────────────────────────────────────
const MAX_MAP_SIZE = 10_000;
const memory = new Map<string, { count: number; resetAt: number }>();

function memoryLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || now > entry.resetAt) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    if (memory.size > MAX_MAP_SIZE) {
      for (const [k, v] of memory) if (now > v.resetAt) memory.delete(k);
    }
    return false;
  }
  entry.count++;
  return entry.count > max;
}

// ─── Shared counter across instances ─────────────────────────────────────────
async function redisLimited(key: string, max: number, windowSec: number): Promise<boolean> {
  try {
    // EXPIRE ... NX sets the TTL only on the first hit, so the window doesn't
    // slide forward with every request.
    const res = await fetch(`${BASE}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(windowSec), "NX"],
      ]),
    });
    if (!res.ok) return false; // fail open
    const out = (await res.json()) as { result?: unknown }[];
    const count = Number(out?.[0]?.result);
    return Number.isFinite(count) && count > max;
  } catch {
    return false; // fail open — never break the product on a Redis blip
  }
}

export interface RateLimitOptions {
  max: number;
  windowSec?: number;
}

/**
 * @param bucket short route identifier, e.g. "match" — keeps per-route limits separate
 * @param ip     caller IP (already extracted from x-forwarded-for)
 */
export async function isRateLimited(
  bucket: string,
  ip: string,
  { max, windowSec = 60 }: RateLimitOptions
): Promise<boolean> {
  const key = `dmc:rl:${bucket}:${ip}`;
  if (memoryLimited(key, max, windowSec * 1000)) return true;
  if (!redisConfigured()) return false;
  return redisLimited(key, max, windowSec);
}
