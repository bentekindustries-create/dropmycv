# dropmycv

**Privacy-first, AI-powered job matching.** Drop your CV and get matched to live roles in seconds — ranked by AI against your real skills, with no account and nothing stored.

🔗 **Live:** [dropmycv.app](https://www.dropmycv.app) · Free tools: [ATS resume checker](https://www.dropmycv.app/ats-resume-checker) · [Job match checker](https://www.dropmycv.app/job-match-checker)

**▶ See it in action:** [www.dropmycv.app](https://www.dropmycv.app) — try the live product (free, no signup).

> A solo-built, production SaaS: AI matching across multiple job sources, a deliberately "store-nothing" privacy architecture, programmatic SEO at scale, and two Stripe-paid tiers — all on one Next.js app.

---

## Why it's interesting

A few decisions that make this more than a CRUD app:

- **Privacy by architecture, not policy.** The CV file is parsed **in the browser** (`pdfjs-dist` / `mammoth`), and email/phone/links are stripped client-side *before* any text is sent. Nothing is persisted server-side — no account, no CV database. The privacy promise is enforced by where the data flows, not just a policy page.
- **AI matching across up to seven job sources.** A single request fans out to Adzuna, Jooble, Careerjet, Brave Search (job boards + company ATS pages), Remotive, Jobicy, and USAJOBS, then interleaves, de-duplicates, and ranks the pool with Claude — returning a tiered shortlist with a plain-English reason per match.
- **Programmatic SEO at ~1,300 pages.** Role × city landing pages (`/jobs/[role]-in-[city]`) are generated **on-demand via ISR** (`dynamicParams` + daily `revalidate`), so the build stays instant regardless of page count. A zero-results guard `noindex`s thin combinations to stay on the right side of Google's quality guidelines.
- **Two paid tiers, fully server-verified.** A$9 AI CV review and a A$19 tailored Application Pack run through Stripe Checkout, with each generation route re-verifying the paid session server-side (bound to the product, so promo codes still work) before doing any AI work.
- **Honest engineering touches.** Listing freshness flags ("posted 3mo ago — may be filled") to fight ghost jobs, an employer-diversity cap so one company can't dominate results, and HTML-entity/PII sanitisation on all third-party listing text.

## How the matching works

1. **Upload** — PDF, Word (`.docx`), or plain text, parsed entirely in the browser.
2. **Strip PII** — email, phone, and links removed client-side before anything leaves the device.
3. **Extract profile** — Claude identifies job titles, skills, seniority, and industry from the stripped text.
4. **Search live jobs** — the profile fans out across multiple job APIs + web search in parallel.
5. **Rank & explain** — results are de-duplicated and scored by AI into a tiered shortlist, each with a match reason.

CV text is processed in-flight and discarded once results return — never stored.

## Tech stack

| Area | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, Node.js runtime) |
| Language | **TypeScript** |
| AI | **Anthropic Claude** — Haiku for fast extraction/ranking & the free tools; a stronger model for the in-depth paid review |
| Job data | Adzuna, Jooble, Careerjet, Brave Search, Remotive, Jobicy, USAJOBS |
| Payments | **Stripe** Checkout (A$9 review, A$19 Application Pack) |
| Email | **Resend** (Application Pack delivery, feedback) |
| Counters | **Upstash Redis** (anonymous, aggregate-only tallies) |
| Styling | **Tailwind CSS 4** |
| File parsing | `pdfjs-dist`, `mammoth` (client-side) |
| Hosting | **Vercel** |

## Product surface

- **Free:** AI job matching, CV checker, [ATS resume checker](https://www.dropmycv.app/ats-resume-checker), [job-match checker](https://www.dropmycv.app/job-match-checker)
- **Paid:** A$9 AI CV review · A$19 tailored Application Pack (cover letter, reworded bullets, keywords, interview prep)
- **SEO:** programmatic role × city pages + country hubs + guides
- **Regions:** primary market Australia, with live coverage across the UK, US, Canada, NZ, Singapore, Germany, France, and the Netherlands

## Getting started

```bash
npm install
cp .env.example .env.local   # add your keys
npm run dev                  # http://localhost:3000
```

Tip: set `NEXT_PUBLIC_MOCK_MODE=true` to exercise the UI without spending API credits.

### Environment variables

**Core (required for matching):**

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API key — [console.anthropic.com](https://console.anthropic.com) |
| `ADZUNA_APP_ID` / `ADZUNA_APP_KEY` | Adzuna — [developer.adzuna.com](https://developer.adzuna.com) |

**Additional job sources (optional — each widens coverage):** `JOOBLE_API_KEY`, `BRAVE_API_KEY`, `CAREERJET_API_KEY`, `USAJOBS_API_KEY` + `USAJOBS_EMAIL`.

**Paid features & infra (optional):** `STRIPE_SECRET_KEY` (checkout + review/pack), `RESEND_API_KEY` (email delivery), `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (anonymous proof counters).

**Dev:** `NEXT_PUBLIC_MOCK_MODE` — `true` returns fake data without calling any API.

## Privacy

- CV files are read locally in the browser — never uploaded as files.
- Contact details are stripped client-side before any AI processing.
- No accounts, no CV storage, no third-party trackers.
- Full details: [dropmycv.app/privacy](https://www.dropmycv.app/privacy).

## License

© BenTek Industries. All rights reserved. This source is shared publicly for demonstration and review — it is **not** licensed for reuse, redistribution, or commercial use.
