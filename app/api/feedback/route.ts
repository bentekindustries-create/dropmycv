
import { isRateLimited } from "@/lib/rate-limit";export const runtime = "nodejs";

const MAX_BODY_BYTES = 10_000;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (await isRateLimited("feedback", ip, { max: 3 })) {
      return Response.json(
        { error: "Thanks — you've sent a few already. Please wait a minute." },
        { status: 429 }
      );
    }

    const contentLength = parseInt(request.headers.get("content-length") ?? "0", 10);
    if (contentLength > MAX_BODY_BYTES) {
      return Response.json({ error: "That message is too long." }, { status: 413 });
    }

    const body = await request.json();
    const { message, email, page, company } = body as {
      message?: string;
      email?: string;
      page?: string;
      company?: string; // honeypot — real users never see or fill this
    };

    // Honeypot: a bot filled the hidden field. Pretend success, send nothing.
    if (typeof company === "string" && company.trim().length > 0) {
      return Response.json({ sent: true });
    }

    const msg = typeof message === "string" ? message.trim().slice(0, 4000) : "";
    if (msg.length < 3) {
      return Response.json({ error: "Please add a little more detail." }, { status: 400 });
    }

    const replyTo = typeof email === "string" && EMAIL_RE.test(email.trim()) ? email.trim() : "";
    const fromPage = typeof page === "string" ? page.trim().slice(0, 200) : "";

    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: "Feedback isn't configured yet." }, { status: 503 });
    }

    const from = process.env.PACK_EMAIL_FROM || "dropmycv <noreply@dropmycv.app>";
    // Always a fixed internal recipient — never the user's input — so this can't be
    // used as an open relay to email arbitrary addresses.
    const to = process.env.FEEDBACK_EMAIL_TO || "info@dropmycv.app";

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#10243e;line-height:1.5">
        <h2 style="font-family:Georgia,serif;font-size:18px;margin:0 0 12px">New feedback</h2>
        <p style="white-space:pre-wrap;margin:0 0 16px">${esc(msg)}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0" />
        <p style="font-size:13px;color:#64748b;margin:0">
          ${replyTo ? `Reply-to: ${esc(replyTo)}<br>` : "No email provided<br>"}
          ${fromPage ? `Page: ${esc(fromPage)}<br>` : ""}
        </p>
      </div>`;

    const payload: Record<string, unknown> = {
      from,
      to: [to],
      subject: `dropmycv feedback${fromPage ? ` — ${fromPage}` : ""}`.slice(0, 120),
      html,
    };
    if (replyTo) payload.reply_to = replyTo;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[feedback] resend error:", res.status, detail.slice(0, 300));
      return Response.json({ error: "Couldn't send — please try again or email info@dropmycv.app." }, { status: 502 });
    }

    return Response.json({ sent: true });
  } catch (err) {
    console.error("[feedback] error:", err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
