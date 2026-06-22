import type { MetadataRoute } from "next";
import { allLandingSlugs, LANDING_COUNTRIES } from "@/lib/landing-data";

const SITE_URL = "https://www.dropmycv.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/cv-checker",
    "/cv-review",
    "/application-pack",
    "/match-my-cv-to-jobs",
    "/what-jobs-can-i-get-with-my-cv",
    "/ai-job-matcher",
    "/private-job-search",
    "/compare/dropmycv-vs-job-boards",
    "/about",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: (path === "" ? "daily" : "monthly") as "daily" | "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const countryRoutes = LANDING_COUNTRIES.map((c) => ({
    url: `${SITE_URL}/jobs-in/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  const landingRoutes = allLandingSlugs().map((slug) => ({
    url: `${SITE_URL}/jobs/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...countryRoutes, ...landingRoutes];
}
