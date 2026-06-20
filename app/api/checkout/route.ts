import Stripe from "stripe";

export const runtime = "nodejs";

const PRICE_CENTS = 900; // A$9.00
const CURRENCY = "aud";

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json({ error: "Payments are not configured yet." }, { status: 503 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Build absolute URLs from the request origin (works across deployments)
    const origin =
      request.headers.get("origin") ||
      `https://${request.headers.get("host") ?? "www.dropmycv.app"}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
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
