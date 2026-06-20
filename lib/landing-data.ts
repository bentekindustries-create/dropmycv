// Curated roles × cities for the SEO landing-page seed set.
// The page itself parses any slug, so this list just drives pre-render + sitemap.

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
];

export const LANDING_CITIES = [
  "Sydney",
  "Melbourne",
  "Brisbane",
  "Perth",
  "Adelaide",
  "Canberra",
];

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
    for (const city of LANDING_CITIES) {
      out.push(landingSlug(role, city));
    }
  }
  return out;
}
