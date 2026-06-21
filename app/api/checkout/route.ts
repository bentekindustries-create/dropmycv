import Stripe from "stripe";

export const runtime = "nodejs";

const PRICE_CENTS = 900; // A$9.00
const CURRENCY = "aud";

// ─── Rate limiting ───────────────────────────────────────────────────────────
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const MAX_MAP_SIZE = 10_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    if (hits.size > MAX_MAP_SIZE) {
      for (const [key, val] of hits) if (now > val.resetAt) hits.delete(key);
    }
    return false;
  }
  entry.count++;
  return entry.count > MAX_REQUESTS;
}

// Only allow redirect URLs back to our own known hosts (never trust raw Origin)
const ALLOWED_ORIGINS = new Set([
  "https://www.dropmycv.app",
  "https://dropmycv.app",
  "https://dropmycv.vercel.app",
]);
const FALLBACK_ORIGIN = "https://www.dropmycv.app";

function safeOrigin(request: Request): string {
  const origin = request.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) return origin;
  // allow Vercel preview deployments (*.vercel.app) but nothing else
  if (origin && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return origin;
  return FALLBACK_ORIGIN;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Too many requests — please wait a minute and try again." },
        { status: 429 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json({ error: "Payments are not configured yet." }, { status: 503 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = safeOrigin(request);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      allow_promotion_codes: true,
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            unit_amount: PRICE_CENTS,
            product_data: {
              name: "AI CV Review",
              description: "Instant AI review of your CV — strengths, gaps, ATS keywords & rewrites.",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/?cv_review=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?cv_review=cancel`,
    });

    if (!session.url) {
      return Response.json({ error: "Could not start checkout." }, { status: 502 });
    }
    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] error:", err);
    return Response.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
