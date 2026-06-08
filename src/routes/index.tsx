import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wallet, Home as HomeIcon, Briefcase, Car, PiggyBank, Landmark, Coins,
  HeartPulse, ShieldCheck, FileText, Calculator,
  ArrowRight, ShieldCheck as ShieldIcon, Sparkles, Clock,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "XCapital — Grow. Protect. Invest." },
      { name: "description", content: "XCapital is a trusted financial advisory firm offering Loans, Investments and Insurance solutions across leading banks and financial institutions." },
      { property: "og:title", content: "XCapital — Grow. Protect. Invest." },
      { property: "og:description", content: "Loans, Investments and Insurance for every Indian household and business." },
    ],
  }),
  component: Index,
});

function GridCard({
  title, viewAllTo, children,
}: { title: string; viewAllTo: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-card border-b-[3px] border-[var(--brand-yellow)] overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5">
        <h3 className="text-lg font-bold text-[var(--brand-black)]">{title}</h3>
        <Link to={viewAllTo} className="text-sm font-semibold text-blue-600 hover:underline">View all</Link>
      </div>
      <div className="px-3 pb-5 pt-4">{children}</div>
    </div>
  );
}

function IconTile({
  icon: Icon, label, sub, to,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  sub?: string;
  to?: string;
}) {
  const inner = (
    <div className="flex flex-col items-center text-center px-2 py-3 rounded-md hover:bg-[var(--brand-yellow-soft)] transition cursor-pointer">
      <div className="h-12 w-12 grid place-items-center text-[var(--brand-black)]">
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </div>
      {sub && <span className="mt-1 text-[11px] font-semibold text-green-700">{sub}</span>}
      <span className="mt-1 text-xs font-medium text-[var(--brand-black)] leading-tight">{label}</span>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

function PromoBanner({ title, sub, gradient }: { title: string; sub: string; gradient: string }) {
  return (
    <div className={`rounded-lg p-6 text-white relative overflow-hidden h-32 md:h-36 ${gradient}`}>
      <h4 className="font-bold text-lg leading-snug max-w-[60%]">{title}</h4>
      <p className="text-sm text-white/90 mt-1 max-w-[60%]">{sub}</p>
      <span className="absolute bottom-2 right-3 text-[10px] text-white/70">*T&amp;C Apply</span>
    </div>
  );
}

function Index() {
  return (
    <SiteLayout>
      {/* Hero card grid */}
      <section className="pt-6 md:pt-8">
        <div className="container-x grid gap-4 md:grid-cols-3">
          <GridCard title="Investments" viewAllTo="/investments">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[var(--brand-yellow-soft)]/60 rounded-lg p-3 flex flex-col items-center text-center">
                <PiggyBank className="h-9 w-9 text-[var(--brand-black)]" strokeWidth={1.5} />
                <span className="mt-2 text-[11px] font-bold text-green-700">Earn up to 8.50%* p.a.</span>
                <span className="text-xs font-medium mt-0.5">Fixed Deposit</span>
              </div>
              <div className="bg-[var(--brand-yellow-soft)]/60 rounded-lg p-3 flex flex-col items-center text-center">
                <Landmark className="h-9 w-9 text-[var(--brand-black)]" strokeWidth={1.5} />
                <span className="mt-2 text-[11px] font-bold text-green-700">AAA Rated</span>
                <span className="text-xs font-medium mt-0.5">Bonds</span>
              </div>
            </div>
          </GridCard>

          <GridCard title="Loans" viewAllTo="/loans">
            <div className="grid grid-cols-4 gap-1">
              <IconTile icon={Wallet} label="Personal Loan" to="/loans" />
              <IconTile icon={HomeIcon} label="Home Loan" to="/loans" />
              <IconTile icon={Car} label="Used Car Loan" to="/loans" />
              <IconTile icon={Briefcase} label="Business Loan" to="/loans" />
            </div>
          </GridCard>

          <GridCard title="Insurance" viewAllTo="/insurance">
            <div className="grid grid-cols-3 gap-1">
              <IconTile icon={HeartPulse} label="Health" to="/insurance" />
              <IconTile icon={ShieldCheck} label="Life" to="/insurance" />
              <IconTile icon={FileText} label="Claim" to="/insurance" />
            </div>
          </GridCard>
        </div>
      </section>

      {/* Promo banners */}
      <section className="container-x mt-4 grid gap-4 md:grid-cols-3">
        <PromoBanner
          title="Grow. Protect. Invest."
          sub="One trusted partner for every Indian household."
          gradient="bg-gradient-to-br from-[#2b2b2b] to-[#0a0a0a]"
        />
        <PromoBanner
          title="Fixed Deposits up to 8.50% p.a."
          sub="Stable returns with flexible tenures."
          gradient="bg-gradient-to-br from-amber-700 to-amber-500"
        />
        <PromoBanner
          title="Apply for a Personal Loan"
          sub="Get up to ₹40 Lakh disbursed in 24 hours."
          gradient="bg-gradient-to-br from-[#b45309] to-[#FDB813]"
        />
      </section>

      {/* Insurance + Calculators row */}
      <section className="container-x mt-4 grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-card border-b-[3px] border-[var(--brand-yellow)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[var(--brand-black)]">General Insurance</h3>
            <Link to="/insurance" className="text-sm font-semibold text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <IconTile icon={HeartPulse} label="Health Insurance" to="/insurance" />
            <IconTile icon={ShieldCheck} label="Life Insurance" to="/insurance" />
            <IconTile icon={FileText} label="Medical Claim" to="/insurance" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-card border-b-[3px] border-[var(--brand-yellow)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[var(--brand-black)]">Calculators</h3>
            <Link to="/calculators" className="text-sm font-semibold text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <IconTile icon={Calculator} label="EMI Calculator" to="/calculators" />
            <IconTile icon={PiggyBank} label="FD Calculator" to="/calculators" />
            <IconTile icon={Coins} label="Gold Calculator" to="/calculators" />
          </div>
        </div>
      </section>

      {/* We have your finances covered */}
      <section className="container-x mt-12">
        <div className="grid md:grid-cols-4 gap-6 items-start">
          <div className="md:col-span-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--brand-black)]">We have your finances covered</h2>
            <p className="text-sm text-muted-foreground mt-3">
              Explore our diverse financial solutions — from high-yield deposits to versatile loans — built to power every milestone of your life.
            </p>
            <Link to="/loans" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[var(--brand-black)] hover:text-amber-700">
              Explore Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {[
            { title: "Invest", body: "Grow your savings with industry-leading FD rates and bonds.", color: "bg-purple-50" },
            { title: "Borrow", body: "Quick approvals on personal, home, business and vehicle loans.", color: "bg-yellow-50" },
            { title: "Protect", body: "Comprehensive health and life cover for your family.", color: "bg-blue-50" },
          ].map((c) => (
            <div key={c.title} className={`${c.color} rounded-xl p-6 h-full`}>
              <h3 className="font-bold text-lg text-[var(--brand-black)]">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mb-12" />
    </SiteLayout>
  );
}
