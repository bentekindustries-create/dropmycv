import type { MetadataRoute } from "next";
import { allLandingSlugs } from "@/lib/landing-data";

const SITE_URL = "https://www.dropmycv.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/cv-checker", "/cv-review", "/private-job-search", "/compare/dropmycv-vs-job-boards", "/privacy", "/terms"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: (path === "" ? "daily" : "monthly") as "daily" | "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const landingRoutes = allLandingSlugs().map((slug) => ({
    url: `${SITE_URL}/jobs/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...landingRoutes];
}
