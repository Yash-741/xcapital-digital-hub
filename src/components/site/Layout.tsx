import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="bg-[var(--brand-navy)] text-white">
      <div className="container-x py-16 md:py-20 text-center">
        {eyebrow && <p className="text-[var(--brand-gold)] uppercase tracking-widest text-xs font-semibold mb-3">{eyebrow}</p>}
        <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>
        {subtitle && <p className="mt-4 text-white/75 max-w-2xl mx-auto">{subtitle}</p>}
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
    <div className="group bg-card rounded-xl border border-border p-6 shadow-card hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div className="h-12 w-12 rounded-lg grid place-items-center bg-[var(--brand-gold)]/15 text-[var(--brand-navy)] mb-4 group-hover:bg-[var(--brand-gold)] transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
      <button className="mt-5 inline-flex items-center text-sm font-semibold text-[var(--brand-navy)] hover:text-[var(--brand-gold)] transition">
        {cta} →
      </button>
    </div>
  );
}