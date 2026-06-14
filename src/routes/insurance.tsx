import { createFileRoute } from "@tanstack/react-router";
import { HeartPulse, ShieldCheck, FileText } from "lucide-react";
import { SiteLayout, PageHeader, ProductCard } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/insurance")({
  head: () => ({
    meta: [
      { title: "Insurance — XCapital | Health, Life & Medical Insurance Cover" },
      { name: "description", content: "Family health cover up to ₹1Cr, term life plans and end-to-end claim assistance from India's top insurers. Compare quotes in minutes on XCapital." },
      { property: "og:title", content: "Insurance — XCapital | Health, Life & Medical Insurance Cover" },
      { property: "og:description", content: "Cashless treatment at 10,000+ hospitals, transparent premiums, dedicated claim support." },
      { property: "og:url", content: "/insurance" },
    ],
    links: [{ rel: "canonical", href: "/insurance" }],
  }),
  component: InsurancePage,
});

const items = [
  { icon: HeartPulse, slug: "health-insurance" },
  { icon: ShieldCheck, slug: "life-insurance" },
  { icon: FileText, slug: "medical-claim" },
];

function InsurancePage() {
  const { t } = useI18n();
  return (
    <SiteLayout>
      <PageHeader eyebrow={t("insurance.header.eyebrow")} title={t("insurance.header.title")} subtitle={t("insurance.header.subtitle")} />
      <section className="container-x py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((i) => (
            <ProductCard
              key={i.slug}
              id={i.slug}
              category="insurance"
              icon={i.icon}
              name={t(`insurance.product.${i.slug}.name`)}
              description={t(`insurance.product.${i.slug}.desc`)}
              cta={t("cta.getQuote")}
            />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}