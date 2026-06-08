import { createFileRoute } from "@tanstack/react-router";
import { HeartPulse, ShieldCheck, FileText } from "lucide-react";
import { SiteLayout, PageHeader, ProductCard } from "@/components/site/Layout";

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export const Route = createFileRoute("/insurance")({
  head: () => ({
    meta: [
      { title: "Insurance — Health, Life & Medical Claim Cover | XCapital" },
      { name: "description", content: "Family health cover up to ₹1Cr, term life plans and end-to-end claim assistance from India's top insurers. Compare quotes in minutes on XCapital." },
      { property: "og:title", content: "Insurance — Health, Life & Medical Claim Cover | XCapital" },
      { property: "og:description", content: "Cashless treatment at 10,000+ hospitals, transparent premiums, dedicated claim support." },
      { property: "og:url", content: "/insurance" },
    ],
    links: [{ rel: "canonical", href: "/insurance" }],
  }),
  component: InsurancePage,
});

const items = [
  { icon: HeartPulse, name: "Health Insurance", description: "Family floater plans with cashless treatment at 10,000+ hospitals." },
  { icon: ShieldCheck, name: "Life Insurance", description: "Term and savings plans to secure your family's future." },
  { icon: FileText, name: "Medical Claim", description: "Hassle-free claim assistance with 100% transparency." },
];

function InsurancePage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Insurance" title="Protection for life's uncertainties" subtitle="Comprehensive cover backed by India's top insurers." />
      <section className="container-x py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((i) => <ProductCard key={i.name} id={slug(i.name)} category="insurance" {...i} cta="Get Quote" />)}
        </div>
      </section>
    </SiteLayout>
  );
}