import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { FeedbackWidget } from "@/components/feedback-widget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const SITE_URL = "https://www.dropmycv.app";
const TITLE = "dropmycv — Match your CV to live jobs, privately";
const DESCRIPTION =
  "Drop your CV and get matched to live job openings in seconds — ranked by AI against your real skills, from Seek, LinkedIn, Indeed & more. No account, no spam, and your CV is never stored. Free.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · dropmycv",
  },
  description: DESCRIPTION,
  keywords: [
    "job match from CV",
    "AI job matcher",
    "free job search",
    "private job search",
    "AI CV review",
    "match resume to jobs",
    "CV keyword checker",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "dropmycv",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "dropmycv",
      url: SITE_URL,
      email: "info@dropmycv.app",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "dropmycv",
      alternateName: ["Drop My CV", "dropmycv.app"],
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebApplication",
      name: "dropmycv",
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: DESCRIPTION,
      offers: [
        { "@type": "Offer", price: "0", priceCurrency: "AUD", name: "Job matching" },
        { "@type": "Offer", price: "9", priceCurrency: "AUD", name: "AI CV review" },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
        {children}
        <FeedbackWidget />
        <Analytics />
      </body>
    </html>
  );
}
