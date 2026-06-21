import Link from "next/link";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-2xl font-extrabold tracking-tight transition-colors group">
            <span className="text-teal">drop</span><span className="text-white group-hover:text-teal">mycv</span><span className="text-teal">.app</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">{children}</main>
      <footer className="bg-navy py-5 text-center text-xs text-white/40 mt-8">
        <Link href="/" className="hover:text-white/80 transition-colors">← Back to dropmycv</Link>
        <span className="mx-3">·</span>
        <Link href="/about" className="hover:text-white/80 transition-colors">About</Link>
        <span className="mx-2">·</span>
        <Link href="/privacy" className="hover:text-white/80 transition-colors">Privacy</Link>
        <span className="mx-2">·</span>
        <Link href="/terms" className="hover:text-white/80 transition-colors">Terms</Link>
      </footer>
    </div>
  );
}

export function CtaBlock({ label = "Match my CV — free →", sub = "Free, in seconds — no account, nothing stored." }: { label?: string; sub?: string }) {
  return (
    <div className="not-prose rounded-2xl border border-[#c8ecea] bg-teal-light/40 p-6 text-center my-8">
      <p className="text-sm text-slate-500 mb-4">{sub}</p>
      <Link
        href="/#upload"
        className="inline-block text-sm px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
      >
        {label}
      </Link>
    </div>
  );
}
