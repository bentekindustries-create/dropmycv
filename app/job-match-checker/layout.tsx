import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free job match checker — does your CV match this job?",
  description:
    "Paste a job description and upload your CV to see how well you match this specific role — a fit score, where you're strong, and the gaps. No sign-up, nothing stored. Free.",
  alternates: { canonical: "/job-match-checker" },
};

export default function JobMatchCheckerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
