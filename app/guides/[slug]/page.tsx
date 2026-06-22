import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-shell";
import { GUIDES, guideBySlug, formatGuideDate } from "@/lib/guides";
import { GUIDE_BODIES } from "@/components/guides";

const SITE_URL = "https://www.dropmycv.app";

export const dynamicParams = false;
export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) return { title: "Guide" };
  return {
    title: `${guide.title} — dropmycv`,
    description: guide.description,
    alternates: { canonical: `/guides/${slug}` },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  const Body = GUIDE_BODIES[slug];
  if (!guide || !Body) notFound();

  const others = GUIDES.filter((g) => g.slug !== slug).slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.date,
    dateModified: guide.date,
    author: { "@type": "Organization", name: "dropmycv" },
    publisher: { "@type": "Organization", name: "dropmycv" },
    mainEntityOfPage: `${SITE_URL}/guides/${slug}`,
  };

  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <article className="space-y-4 text-slate-600">
        <div className="space-y-2">
          <p className="text-xs text-slate-400">
            <Link href="/guides" className="hover:text-teal">Guides</Link> · {formatGuideDate(guide.date)} · {guide.readMins} min read
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">{guide.title}</h1>
        </div>
        <Body />
      </article>

      {others.length > 0 && (
        <div className="mt-12 pt-6 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">More guides</p>
          <ul className="space-y-2">
            {others.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="text-teal hover:underline text-sm">{g.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </MarketingShell>
  );
}
