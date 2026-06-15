export const COUNTRIES = [
  { code: "gb", label: "🇬🇧 United Kingdom", currency: "£" },
  { code: "us", label: "🇺🇸 United States", currency: "$" },
  { code: "au", label: "🇦🇺 Australia", currency: "A$" },
  { code: "ca", label: "🇨🇦 Canada", currency: "CA$" },
  { code: "nz", label: "🇳🇿 New Zealand", currency: "NZ$" },
  { code: "de", label: "🇩🇪 Germany", currency: "€" },
  { code: "fr", label: "🇫🇷 France", currency: "€" },
  { code: "nl", label: "🇳🇱 Netherlands", currency: "€" },
  { code: "sg", label: "🇸🇬 Singapore", currency: "S$" },
] as const;

export type CountryCode = (typeof COUNTRIES)[number]["code"];

export function getCurrency(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.currency ?? "$";
}
