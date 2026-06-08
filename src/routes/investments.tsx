import { createFileRoute } from "@tanstack/react-router";
import { PiggyBank, Landmark } from "lucide-react";
import { SiteLayout, PageHeader, ProductCard } from "@/components/site/Layout";

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
  return (
    <SiteLayout>
      <PageHeader eyebrow="Investments" title="Make your money work harder" subtitle="Safe, regulated investment options with attractive returns." />
      <section className="container-x py-16 grid md:grid-cols-2 gap-6">
        <div className="relative bg-card rounded-xl border border-border p-7 shadow-card overflow-hidden">
          <span className="absolute top-4 right-4 text-xs font-bold bg-[var(--brand-gold)] text-[var(--brand-navy)] px-2.5 py-1 rounded-full">UP TO 8.5% P.A.</span>
          <div className="h-12 w-12 rounded-lg grid place-items-center bg-[var(--brand-gold)]/15 text-[var(--brand-navy)] mb-4">
            <PiggyBank className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold">Fixed Deposits</h3>
          <p className="text-sm text-muted-foreground mt-2">Highest-in-industry returns with monthly, quarterly or cumulative payout options. Special rates for senior citizens.</p>
          <button className="mt-5 px-5 py-2.5 text-sm font-semibold rounded-md bg-[var(--brand-navy)] text-white hover:brightness-110">Invest Now</button>
        </div>
        <ProductCard icon={Landmark} name="Bonds" description="AAA-rated NCDs and corporate bonds with stable returns and tradable liquidity." cta="Explore Bonds" />
      </section>
    </SiteLayout>
  );
}