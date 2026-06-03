import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Banknote, TrendingUp, ShieldCheck, Calculator,
  Wallet, PiggyBank, HeartPulse, Zap, Users, BadgeCheck, Smartphone, ArrowRight,
} from "lucide-react";
import { SiteLayout, ProductCard } from "@/components/site/Layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "XCapital — Grow. Protect. Invest. | Indian NBFC" },
      { name: "description", content: "XCapital is a trusted Indian NBFC offering Loans, Investments and Insurance products with fast disbursal and RBI registration." },
      { property: "og:title", content: "XCapital — Grow. Protect. Invest." },
      { property: "og:description", content: "Loans, Investments and Insurance for every Indian household and business." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative bg-[var(--brand-navy)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #F5A623 0, transparent 40%), radial-gradient(circle at 80% 60%, #1e3a8a 0, transparent 50%)" }} />
        <div className="container-x relative py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[var(--brand-gold)] uppercase tracking-widest text-xs font-semibold mb-4">Trusted NBFC of India</p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Grow. <span style={{ color: "var(--brand-gold)" }}>Protect.</span> Invest.
            </h1>
            <p className="mt-5 text-white/80 text-lg max-w-lg">
              From quick personal loans to high-yield fixed deposits and comprehensive insurance — XCapital powers every milestone of your financial journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#apply" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[var(--brand-gold)] text-[var(--brand-navy)] font-semibold hover:brightness-110 transition">
                Apply Now <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/loans" className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-white/30 text-white hover:bg-white/10 font-semibold transition">
                Explore Products
              </Link>
            </div>
            <div className="mt-10 flex gap-8 text-sm">
              <div><div className="text-2xl font-bold text-[var(--brand-gold)]">25L+</div><div className="text-white/70">Customers</div></div>
              <div><div className="text-2xl font-bold text-[var(--brand-gold)]">1,200+</div><div className="text-white/70">Branches</div></div>
              <div><div className="text-2xl font-bold text-[var(--brand-gold)]">8.5%</div><div className="text-white/70">FD Rate p.a.</div></div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-semibold">Quick Loan Eligibility</h3>
              <p className="text-white/70 text-sm mt-1">Check in under 60 seconds.</p>
              <div className="mt-5 space-y-3">
                <input className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm placeholder:text-white/50" placeholder="Full Name" />
                <input className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm placeholder:text-white/50" placeholder="Mobile Number" />
                <select className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm">
                  <option className="text-foreground">Personal Loan</option>
                  <option className="text-foreground">Home Loan</option>
                  <option className="text-foreground">Business Loan</option>
                </select>
                <button className="w-full bg-[var(--brand-gold)] text-[var(--brand-navy)] font-semibold py-3 rounded-md hover:brightness-110 transition">Check Eligibility</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick categories */}
      <section className="border-b border-border bg-secondary/50">
        <div className="container-x py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Banknote, label: "Loans", to: "/loans" },
            { icon: TrendingUp, label: "Investments", to: "/investments" },
            { icon: ShieldCheck, label: "Insurance", to: "/insurance" },
            { icon: Calculator, label: "Calculators", to: "/calculators" },
          ].map(({ icon: Icon, label, to }) => (
            <Link key={label} to={to} className="group bg-card rounded-xl p-6 text-center shadow-card hover:-translate-y-1 transition">
              <div className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-[var(--brand-gold)]/15 text-[var(--brand-navy)] group-hover:bg-[var(--brand-gold)] transition">
                <Icon className="h-6 w-6" />
              </div>
              <div className="mt-3 font-semibold text-foreground">{label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-x py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[var(--brand-gold)] uppercase tracking-widest text-xs font-semibold">Featured Products</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">Built for every Indian</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <ProductCard icon={Wallet} name="Personal Loan" description="Up to ₹40 Lakh with instant approval and flexible tenure." />
          <ProductCard icon={PiggyBank} name="Fixed Deposit" description="Earn up to 8.5% p.a. with monthly or cumulative payouts." />
          <ProductCard icon={HeartPulse} name="Health Insurance" description="Comprehensive cover for family with cashless hospitals." />
        </div>
      </section>

      {/* Why */}
      <section className="bg-secondary/50">
        <div className="container-x py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Choose XCapital</h2>
            <p className="text-muted-foreground mt-3">Five decades of building trust across India.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Fast Disbursal", desc: "Get loan amounts credited within 24 hours of approval." },
              { icon: Users, title: "Trusted by Thousands", desc: "Over 25 lakh happy customers across 1,200+ branches." },
              { icon: BadgeCheck, title: "RBI Registered", desc: "A regulated NBFC compliant with all RBI guidelines." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card rounded-xl p-7 shadow-card border border-border">
                <div className="h-12 w-12 rounded-lg grid place-items-center bg-[var(--brand-navy)] text-[var(--brand-gold)] mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App banner */}
      <section id="apply" className="container-x py-16">
        <div className="rounded-2xl bg-[var(--brand-navy)] text-white p-10 md:p-14 grid md:grid-cols-2 gap-8 items-center relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[var(--brand-gold)]/20 blur-3xl" />
          <div className="relative">
            <h3 className="text-3xl md:text-4xl font-bold">Manage your money on the go</h3>
            <p className="text-white/75 mt-3">Apply for loans, track FDs, pay EMIs and file claims — all from the XCapital app.</p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="bg-white text-[var(--brand-navy)] px-5 py-3 rounded-md font-semibold text-sm">App Store</a>
              <a href="#" className="bg-[var(--brand-gold)] text-[var(--brand-navy)] px-5 py-3 rounded-md font-semibold text-sm">Google Play</a>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="h-56 w-56 rounded-full bg-[var(--brand-gold)]/20 grid place-items-center">
              <Smartphone className="h-32 w-32 text-[var(--brand-gold)]" />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
