# dropmycv

Free, privacy-first job matching. Drop your CV and get matched to live roles instantly — no account, no data stored.

## How it works

1. **Upload your CV** — PDF, Word (.docx), or plain text. The file is read entirely in your browser.
2. **PII is stripped** — email addresses, phone numbers, and links are removed client-side before anything leaves your device.
3. **AI extracts your profile** — job titles, skills, and experience level are identified from the stripped text.
4. **Live jobs are searched** — thousands of listings from Adzuna are queried using your profile.
5. **Results are ranked** — AI scores each listing for relevance and returns a tiered shortlist.

Your CV text is never stored. It's processed in-flight and discarded once results are returned.

## Tech stack

- **Next.js 16** (App Router, Edge Runtime)
- **Claude Haiku** — CV extraction and job ranking
- **Adzuna API** — structured job listings
- **Jooble API** (optional) — additional job aggregator for wider coverage
- **Brave Search API** (optional) — web search for jobs on Seek, LinkedIn, company pages, etc.
- **Tailwind CSS 4** — styling
- **pdfjs-dist / mammoth** — client-side file parsing

## Getting started

```bash
# Install dependencies
npm install

# Copy environment template and add your keys
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | API key from [console.anthropic.com](https://console.anthropic.com) |
| `ADZUNA_APP_ID` | Yes | App ID from [developer.adzuna.com](https://developer.adzuna.com) |
| `ADZUNA_APP_KEY` | Yes | App key from Adzuna |
| `JOOBLE_API_KEY` | No | API key from [jooble.org/api/about](https://jooble.org/api/about) — adds a second job source |
| `BRAVE_API_KEY` | No | API key from [api-dashboard.search.brave.com](https://api-dashboard.search.brave.com) — web search for jobs on Seek, LinkedIn, etc. |
| `NEXT_PUBLIC_MOCK_MODE` | No | Set to `true` to skip API calls and return fake data |

## Deployment

Designed for Vercel — connect the repo and set the three required environment variables in project settings. The API route runs on Edge Functions automatically.

## Privacy

- CV files are read locally in the browser, never uploaded to the server
- Contact details are stripped before any AI processing
- No accounts, no cookies, no tracking
- Full details in [/privacy](https://dropmycv.app/privacy)

## Supported regions

Currently **Australia** only. More countries coming soon.
