import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wallet, Home as HomeIcon, Briefcase, Car, PiggyBank, Landmark, Coins,
  HeartPulse, ShieldCheck, FileText, Calculator,
  ArrowRight, Sparkles, Clock, CheckCircle2,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "XCapital — Loans, Investments & Insurance in India" },
      { name: "description", content: "Compare loans, fixed deposits, bonds and insurance from 50+ leading Indian banks. Fast approvals, transparent rates, expert advisory — all under one trusted roof." },
      { property: "og:title", content: "XCapital — Loans, Investments & Insurance in India" },
      { property: "og:description", content: "Personal & home loans, FDs up to 8.5%, health & life cover from India's top banks and insurers. Apply online with XCapital." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#2b2b2b] text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, var(--brand-yellow) 0%, transparent 40%), radial-gradient(circle at 80% 60%, #b45309 0%, transparent 45%)",
          }}
        />
        <div className="container-x relative py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-yellow)]/15 text-[var(--brand-yellow)] px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Grow. Protect. Invest.
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
              Smarter money decisions for every Indian household
            </h1>
            <p className="mt-4 text-white/80 text-base md:text-lg max-w-xl">
              Loans, investments and insurance from India's leading banks &
              financial institutions — all under one trusted roof.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/loans"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-yellow)] text-[var(--brand-black)] px-6 py-3 text-sm font-semibold hover:brightness-105 transition"
              >
                Apply for a Loan <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/calculators"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition"
              >
                Try our Calculators
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--brand-yellow)]" /> 50+ partner banks</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-[var(--brand-yellow)]" /> Disbursal in 24 hrs</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--brand-yellow)]" /> Secure & transparent</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[
              { label: "Fixed Deposit", value: "8.50%*", sub: "p.a. interest", icon: PiggyBank },
              { label: "Personal Loan", value: "₹40L", sub: "up to disbursal", icon: Wallet },
              { label: "Home Loan", value: "8.35%*", sub: "starting rate", icon: HomeIcon },
              { label: "Health Cover", value: "₹1Cr", sub: "sum insured", icon: HeartPulse },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-4 hover:bg-white/10 transition"
              >
                <s.icon className="h-6 w-6 text-[var(--brand-yellow)]" strokeWidth={1.5} />
                <div className="mt-3 text-2xl font-bold">{s.value}</div>
                <div className="text-[11px] uppercase tracking-wider text-white/60 mt-0.5">{s.sub}</div>
                <div className="text-sm font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
