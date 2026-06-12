import { createFileRoute } from "@tanstack/react-router";
import {
  Wallet, Home, Briefcase, Stethoscope, Building2, Calculator as CalcIcon,
  Factory, Activity, Building, LineChart, Car, GraduationCap,
} from "lucide-react";
import { SiteLayout, PageHeader, ProductCard } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export const Route = createFileRoute("/loans")({
  head: () => ({
    meta: [
      { title: "Loans Online — Personal, Home & Business Loans | XCapital" },
      { name: "description", content: "Apply for Personal Loan up to ₹40L, Home Loan from 8.35% p.a., Business, LAP, Education & Car loans. 50+ banks, 24-hour disbursal, lowest EMI." },
      { property: "og:title", content: "Loans Online — Personal, Home & Business Loans | XCapital" },
      { property: "og:description", content: "12+ loan products with the best rates from India's top banks. Quick approval, minimal paperwork, dedicated advisor." },
      { property: "og:url", content: "/loans" },
    ],
    links: [{ rel: "canonical", href: "/loans" }],
  }),
  component: LoansPage,
});

const loans = [
  { icon: Wallet, slug: "personal-loan" },
  { icon: Home, slug: "home-loan" },
  { icon: Briefcase, slug: "business-loan" },
  { icon: Stethoscope, slug: "loans-for-doctors" },
  { icon: Building2, slug: "loan-against-property" },
  { icon: CalcIcon, slug: "loan-for-cas" },
  { icon: Factory, slug: "commercial-lending" },
  { icon: Activity, slug: "medical-equipment-finance" },
  { icon: Building, slug: "lease-rental-discounting" },
  { icon: LineChart, slug: "loan-against-securities" },
  { icon: Car, slug: "used-car-loan" },
  { icon: GraduationCap, slug: "education-loan" },
];

function LoansPage() {
  const { t } = useI18n();
  return (
    <SiteLayout>
      <PageHeader eyebrow={t("loans.header.eyebrow")} title={t("loans.header.title")} subtitle={t("loans.header.subtitle")} />
      <section className="container-x py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((l) => (
            <ProductCard
              key={l.slug}
              id={l.slug}
              category="loan"
              icon={l.icon}
              name={t(`loans.product.${l.slug}.name`)}
              description={t(`loans.product.${l.slug}.desc`)}
              cta={t("cta.applyNow")}
            />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}