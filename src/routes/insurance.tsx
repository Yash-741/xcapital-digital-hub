import { createFileRoute } from "@tanstack/react-router";
import { HeartPulse, ShieldCheck, FileText } from "lucide-react";
import { SiteLayout, PageHeader, ProductCard } from "@/components/site/Layout";

export const Route = createFileRoute("/insurance")({
  head: () => ({
    meta: [
      { title: "Insurance — XCapital" },
      { name: "description", content: "Health, Life and Medical Claim solutions from XCapital." },
      { property: "og:title", content: "Insurance — XCapital" },
      { property: "og:description", content: "Protect what matters most." },
    ],
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
          {items.map((i) => <ProductCard key={i.name} {...i} cta="Get Quote" />)}
        </div>
      </section>
    </SiteLayout>
  );
}