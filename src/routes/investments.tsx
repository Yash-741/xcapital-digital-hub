import { createFileRoute, Link } from "@tanstack/react-router";
import { PiggyBank, Landmark } from "lucide-react";
import { SiteLayout, PageHeader, ProductCard } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/investments")({
  head: () => ({
    meta: [
      { title: "Investments — Fixed Deposits & AAA Bonds | XCapital" },
      { name: "description", content: "Earn up to 8.5% p.a. with corporate Fixed Deposits and AAA-rated bonds. Senior-citizen bonus rates, flexible tenures, fully online booking." },
      { property: "og:title", content: "Investments — Fixed Deposits & AAA Bonds | XCapital" },
      { property: "og:description", content: "Safe, regulated investments with industry-best returns. Compare FD rates from leading NBFCs and banks on XCapital." },
      { property: "og:url", content: "/investments" },
    ],
    links: [{ rel: "canonical", href: "/investments" }],
  }),
  component: Investments,
});

function Investments() {
  const { t } = useI18n();
  return (
    <SiteLayout>
      <PageHeader eyebrow={t("investments.header.eyebrow")} title={t("investments.header.title")} subtitle={t("investments.header.subtitle")} />
      <section className="container-x py-16 grid md:grid-cols-2 gap-6">
        <div id="fixed-deposits" className="relative scroll-mt-32 bg-card rounded-xl border border-border p-7 shadow-card overflow-hidden">
          <span className="absolute top-4 right-4 text-xs font-bold bg-[var(--brand-gold)] text-[var(--brand-navy)] px-2.5 py-1 rounded-full">{t("investments.fd.badge")}</span>
          <div className="h-12 w-12 rounded-lg grid place-items-center bg-[var(--brand-gold)]/15 text-[var(--brand-navy)] mb-4">
            <PiggyBank className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold">{t("investments.fd.name")}</h3>
          <p className="text-sm text-muted-foreground mt-2">{t("investments.fd.desc")}</p>
          <Link to="/apply/$category/$slug" params={{ category: "investment", slug: "fixed-deposits" }} className="mt-5 inline-block px-5 py-2.5 text-sm font-semibold rounded-md bg-[var(--brand-navy)] text-white hover:brightness-110">{t("cta.investNow")}</Link>
        </div>
        <ProductCard id="bonds" category="investment" icon={Landmark} name={t("investments.bonds.name")} description={t("investments.bonds.desc")} cta={t("cta.exploreBonds")} />
      </section>
    </SiteLayout>
  );
}