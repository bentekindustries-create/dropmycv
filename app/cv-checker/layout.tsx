import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free CV checker — instant AI score & feedback",
  description:
    "Check your CV free in seconds: an honest AI score and the top things helping and hurting it. No sign-up, nothing stored. Unlock the full review for A$9.",
  alternates: { canonical: "/cv-checker" },
};

export default function CvCheckerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
