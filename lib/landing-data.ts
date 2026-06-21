// Roles × locations + countries for the SEO landing pages.
// Pages parse any slug, so these lists drive the sitemap, country hubs and pre-render.

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
  // United States
  { city: "New York", country: "us", currency: "$" },
  { city: "San Francisco", country: "us", currency: "$" },
  { city: "Los Angeles", country: "us", currency: "$" },
  { city: "Chicago", country: "us", currency: "$" },
  { city: "Austin", country: "us", currency: "$" },
  // Canada
  { city: "Toronto", country: "ca", currency: "$" },
  { city: "Vancouver", country: "ca", currency: "$" },
  // New Zealand
  { city: "Auckland", country: "nz", currency: "$" },
  { city: "Wellington", country: "nz", currency: "$" },
  { city: "Christchurch", country: "nz", currency: "$" },
  // Singapore
  { city: "Singapore", country: "sg", currency: "$" },
  // Germany
  { city: "Berlin", country: "de", currency: "€" },
  { city: "Munich", country: "de", currency: "€" },
  { city: "Hamburg", country: "de", currency: "€" },
  // France
  { city: "Paris", country: "fr", currency: "€" },
  { city: "Lyon", country: "fr", currency: "€" },
  // Netherlands
  { city: "Amsterdam", country: "nl", currency: "€" },
  { city: "Rotterdam", country: "nl", currency: "€" },
];

export interface LandingCountry {
  code: string;
  name: string; // natural form for "Jobs in {name}"
  slug: string;
}

export const LANDING_COUNTRIES: LandingCountry[] = [
  { code: "au", name: "Australia", slug: "australia" },
  { code: "gb", name: "the United Kingdom", slug: "united-kingdom" },
  { code: "us", name: "the United States", slug: "united-states" },
  { code: "ca", name: "Canada", slug: "canada" },
  { code: "nz", name: "New Zealand", slug: "new-zealand" },
  { code: "sg", name: "Singapore", slug: "singapore" },
  { code: "de", name: "Germany", slug: "germany" },
  { code: "fr", name: "France", slug: "france" },
  { code: "nl", name: "the Netherlands", slug: "netherlands" },
];

const LOC_BY_CITY = new Map(LANDING_LOCATIONS.map((l) => [l.city.toLowerCase(), l]));

export function locForCity(city: string): { country: string; currency: string } {
  const hit = LOC_BY_CITY.get(city.toLowerCase());
  return hit ? { country: hit.country, currency: hit.currency } : { country: "au", currency: "$" };
}

export function countryBySlug(slug: string): LandingCountry | undefined {
  return LANDING_COUNTRIES.find((c) => c.slug === slug);
}

export function citiesForCountry(code: string): string[] {
  return LANDING_LOCATIONS.filter((l) => l.country === code).map((l) => l.city);
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
