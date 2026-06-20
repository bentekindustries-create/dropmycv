// Lightweight server-side job search for the SEO landing pages (role + city).
// Uses Adzuna (structured data + salary). Falls back gracefully to an empty list.

export interface LandingJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  url: string;
  created: string;
}

interface AdzunaJob {
  id: string;
  title: string;
  company?: { display_name: string };
  location?: { display_name: string };
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  created: string;
}

export async function searchLandingJobs(
  role: string,
  city: string,
  country = "au"
): Promise<{ jobs: LandingJob[]; total: number }> {
  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
    return { jobs: [], total: 0 };
  }

  const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/1`);
  url.searchParams.set("app_id", process.env.ADZUNA_APP_ID);
  url.searchParams.set("app_key", process.env.ADZUNA_APP_KEY);
  url.searchParams.set("results_per_page", "12");
  url.searchParams.set("what", role);
  if (city) url.searchParams.set("where", city);
  url.searchParams.set("content-type", "application/json");

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
    if (!res.ok) return { jobs: [], total: 0 };
    const data = await res.json();
    const results: AdzunaJob[] = data.results ?? [];
    const jobs: LandingJob[] = results.map((j) => ({
      id: `adzuna-${j.id}`,
      title: j.title?.replace(/<[^>]*>/g, "") ?? "",
      company: j.company?.display_name ?? "",
      location: j.location?.display_name ?? "",
      salaryMin: j.salary_min,
      salaryMax: j.salary_max,
      url: j.redirect_url,
      created: j.created,
    }));
    return { jobs, total: typeof data.count === "number" ? data.count : jobs.length };
  } catch {
    return { jobs: [], total: 0 };
  }
}
