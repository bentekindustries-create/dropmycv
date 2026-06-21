import { TESTIMONIALS } from "@/lib/testimonials";

export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;
  return (
    <div className="pt-4 border-t border-slate-100">
      <h2 className="text-lg font-serif font-bold text-navy text-center mb-5">What people say</h2>
      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className="bg-white rounded-xl border border-slate-100 p-4">
            <blockquote className="text-sm text-slate-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="text-xs text-slate-400 mt-2">
              — {t.name}{t.role ? `, ${t.role}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
