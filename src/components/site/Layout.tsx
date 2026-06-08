import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--page-bg)" }}>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="bg-white border-b-4 border-[var(--brand-yellow)]">
      <div className="container-x py-12 md:py-16">
        {eyebrow && <p className="text-[var(--brand-black)]/60 uppercase tracking-widest text-xs font-semibold mb-2">{eyebrow}</p>}
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-black)]">{title}</h1>
        {subtitle && <p className="mt-3 text-muted-foreground max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
}

export function ProductCard({
  icon: Icon, name, description, cta = "Apply Now",
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  cta?: string;
}) {
  return (
    <div className="group bg-card rounded-lg border border-border p-6 shadow-card hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--brand-yellow)] transition-all duration-200 border-b-2 border-b-transparent hover:border-b-[var(--brand-yellow)]">
      <div className="h-12 w-12 rounded-lg grid place-items-center bg-[var(--brand-yellow-soft)] text-[var(--brand-black)] mb-4 group-hover:bg-[var(--brand-yellow)] transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{name}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
      <button className="mt-5 inline-flex items-center text-sm font-semibold text-[var(--brand-black)] hover:text-[var(--brand-yellow)] transition">
        {cta} →
      </button>
    </div>
  );
}