import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free ATS resume checker — is your CV ATS-friendly?",
  description:
    "Check if your resume is ATS-friendly in seconds. Free ATS scan of your CV's format, sections, dates and keywords — optionally against a specific job description. No sign-up, nothing stored.",
  alternates: { canonical: "/ats-resume-checker" },
};

export default function AtsCheckerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
