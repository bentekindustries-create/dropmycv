// Curated roles × locations for the SEO landing-page seed set.
// The page parses any slug, so this list drives the sitemap (and optional pre-render).

export const LANDING_ROLES = [
  "Software Engineer",
  "Marketing Manager",
  "Registered Nurse",
  "Accountant",
  "Project Manager",
  "Data Analyst",
  "Electrician",
  "Sales Representative",
  "Administration Assistant",
  "Customer Service",
  "Business Development Manager",
  "Graphic Designer",
  "Mechanical Engineer",
  "Financial Analyst",
  "Human Resources Manager",
  "Operations Manager",
  "Plumber",
  "Teacher",
];

export interface LandingLocation {
  city: string;
  country: string; // Adzuna country code
  currency: string; // display symbol
}

export const LANDING_LOCATIONS: LandingLocation[] = [
  // Australia
  { city: "Sydney", country: "au", currency: "$" },
  { city: "Melbourne", country: "au", currency: "$" },
  { city: "Brisbane", country: "au", currency: "$" },
  { city: "Perth", country: "au", currency: "$" },
  { city: "Adelaide", country: "au", currency: "$" },
  { city: "Canberra", country: "au", currency: "$" },
  { city: "Gold Coast", country: "au", currency: "$" },
  { city: "Newcastle", country: "au", currency: "$" },
  // United Kingdom
  { city: "London", country: "gb", currency: "£" },
  { city: "Manchester", country: "gb", currency: "£" },
  { city: "Birmingham", country: "gb", currency: "£" },
  { city: "Edinburgh", country: "gb", currency: "£" },
  { city: "Glasgow", country: "gb", currency: "£" },
  // New Zealand
  { city: "Auckland", country: "nz", currency: "$" },
  { city: "Wellington", country: "nz", currency: "$" },
  { city: "Christchurch", country: "nz", currency: "$" },
  // Canada
  { city: "Toronto", country: "ca", currency: "$" },
  { city: "Vancouver", country: "ca", currency: "$" },
];

const LOC_BY_CITY = new Map(LANDING_LOCATIONS.map((l) => [l.city.toLowerCase(), l]));

export function locForCity(city: string): { country: string; currency: string } {
  const hit = LOC_BY_CITY.get(city.toLowerCase());
  return hit ? { country: hit.country, currency: hit.currency } : { country: "au", currency: "$" };
}

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// "software-engineer-jobs-in-sydney" → { role, city }
export function parseSlug(slug: string): { role: string; city: string } | null {
  const m = slug.match(/^(.+)-jobs-in-(.+)$/);
  if (!m) return null;
  const role = titleCase(m[1]);
  const city = titleCase(m[2]);
  if (role.length < 2 || city.length < 2) return null;
  return { role, city };
}

export function landingSlug(role: string, city: string): string {
  return `${slugify(role)}-jobs-in-${slugify(city)}`;
}

export function allLandingSlugs(): string[] {
  const out: string[] = [];
  for (const role of LANDING_ROLES) {
    for (const loc of LANDING_LOCATIONS) {
      out.push(landingSlug(role, loc.city));
    }
  }
  return out;
}
