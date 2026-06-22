import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wallet, Home as HomeIcon, Briefcase, Car, PiggyBank, Landmark, Coins,
  HeartPulse, ShieldCheck, FileText, Calculator,
  ArrowRight, Sparkles, Clock, CheckCircle2,
  CreditCard, ScanLine, Fingerprint, Building2,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "XCapital — Loans, Investments & Insurance in India" },
      { name: "description", content: "Compare loans, fixed deposits, bonds and insurance from 50+ leading Indian banks. Fast approvals, transparent rates, expert advisory — all under one trusted roof." },
      { property: "og:title", content: "XCapital — Loans, Investments & Insurance in India" },
      { property: "og:description", content: "Personal & home loans, FDs up to 8.5%, health & life cover from India's top banks and insurers. Apply online with XCapital." },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "XCapital — Loans, Investments & Insurance in India" },
      { name: "twitter:description", content: "Compare loans, fixed deposits, bonds and insurance from 50+ leading Indian banks with XCapital." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function GridCard({
  title, viewAllTo, children,
}: { title: string; viewAllTo: string; children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="bg-white rounded-lg shadow-card border-b-[3px] border-[var(--brand-yellow)] overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5">
        <h3 className="text-lg font-bold text-[var(--brand-black)]">{title}</h3>
        <Link to={viewAllTo} className="text-sm font-semibold text-blue-600 hover:underline">{t("common.viewAll")}</Link>
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
  const { tEn } = useI18n();
  return (
    <div className={`rounded-lg p-6 text-white relative overflow-hidden h-32 md:h-36 ${gradient}`}>
      <h4 className="font-bold text-lg leading-snug max-w-[60%]">{title}</h4>
      <p className="text-sm text-white/90 mt-1 max-w-[60%]">{sub}</p>
      <span className="absolute bottom-2 right-3 text-[10px] text-white/70">{tEn("*T&C Apply")}</span>
    </div>
  );
}

function Index() {
  const { t, tEn } = useI18n();
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#2b2b2b] text-white">
        <div className="container-x relative py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-yellow)]/15 text-[var(--brand-yellow)] px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> {t("hero.eyebrow")}
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-white/80 text-base md:text-lg max-w-xl">
              {t("hero.subtitle")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/loans"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-yellow)] text-[var(--brand-black)] px-6 py-3 text-sm font-semibold hover:brightness-105 transition"
              >
                {t("hero.applyLoan")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/calculators"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition"
              >
                {t("hero.tryCalc")}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--brand-yellow)]" /> {t("hero.partners")}</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-[var(--brand-yellow)]" /> {t("hero.disbursal")}</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--brand-yellow)]" /> {t("hero.secure")}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[
              { label: tEn("Fixed Deposit"), value: "8.50%*", sub: tEn("p.a. interest"), icon: PiggyBank },
              { label: tEn("Personal Loan"), value: "₹40L", sub: tEn("up to disbursal"), icon: Wallet },
              { label: tEn("Home Loan"), value: "8.35%*", sub: tEn("starting rate"), icon: HomeIcon },
              { label: tEn("Health Cover"), value: "₹1Cr", sub: tEn("sum insured"), icon: HeartPulse },
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
        <div className="container-x grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div id="investments" className="scroll-mt-32">
          <GridCard title={t("section.investments")} viewAllTo="/investments">
            <div className="grid grid-cols-2 gap-2">
              <Link to="/investments" className="bg-[var(--brand-yellow-soft)]/60 hover:bg-[var(--brand-yellow-soft)] rounded-lg p-3 flex flex-col items-center text-center transition">
                <PiggyBank className="h-9 w-9 text-[var(--brand-black)]" strokeWidth={1.5} />
                <span className="mt-2 text-[11px] font-bold text-green-700">{tEn("Earn up to 8.50%* p.a.")}</span>
                <span className="text-xs font-medium mt-0.5">{tEn("Fixed Deposit")}</span>
              </Link>
              <Link to="/investments" className="bg-[var(--brand-yellow-soft)]/60 hover:bg-[var(--brand-yellow-soft)] rounded-lg p-3 flex flex-col items-center text-center transition">
                <Landmark className="h-9 w-9 text-[var(--brand-black)]" strokeWidth={1.5} />
                <span className="mt-2 text-[11px] font-bold text-green-700">{tEn("AAA Rated")}</span>
                <span className="text-xs font-medium mt-0.5">{tEn("Bonds")}</span>
              </Link>
            </div>
          </GridCard>
          </div>

          <div id="loans" className="scroll-mt-32">
          <GridCard title={t("section.loans")} viewAllTo="/loans">
            <div className="grid grid-cols-4 gap-1">
              <IconTile icon={Wallet} label={tEn("Personal Loan")} to="/loans" />
              <IconTile icon={HomeIcon} label={tEn("Home Loan")} to="/loans" />
              <IconTile icon={Car} label={tEn("Used Car Loan")} to="/loans" />
              <IconTile icon={Briefcase} label={tEn("Business Loan")} to="/loans" />
            </div>
          </GridCard>
          </div>

          <div id="insurance" className="scroll-mt-32">
          <GridCard title={t("section.insurance")} viewAllTo="/insurance">
            <div className="grid grid-cols-3 gap-1">
              <IconTile icon={HeartPulse} label={tEn("Health")} to="/insurance" />
              <IconTile icon={ShieldCheck} label={tEn("Life")} to="/insurance" />
              <IconTile icon={FileText} label={tEn("Claim")} to="/insurance" />
            </div>
          </GridCard>
          </div>

          <div id="store" className="scroll-mt-32">
            <GridCard title={tEn("Store")} viewAllTo="/store">
              <div className="grid grid-cols-4 gap-1">
                <IconTile icon={CreditCard} label={tEn("Payment")} to="/store" />
                <IconTile icon={ScanLine} label={tEn("Retail")} to="/store" />
                <IconTile icon={Fingerprint} label={tEn("Biometric")} to="/store" />
                <IconTile icon={Building2} label={tEn("Banking")} to="/store" />
              </div>
            </GridCard>
          </div>
        </div>
      </section>

      {/* Promo banners */}
      <section className="container-x mt-4 grid gap-4 md:grid-cols-3">
        <PromoBanner
          title={tEn("Grow. Protect. Invest.")}
          sub={tEn("One trusted partner for every Indian household.")}
          gradient="bg-gradient-to-br from-[#2b2b2b] to-[#0a0a0a]"
        />
        <PromoBanner
          title={tEn("Fixed Deposits up to 8.50% p.a.")}
          sub={tEn("Stable returns with flexible tenures.")}
          gradient="bg-gradient-to-br from-amber-700 to-amber-500"
        />
        <PromoBanner
          title={tEn("Apply for a Personal Loan")}
          sub={tEn("Get up to ₹40 Lakh disbursed in 24 hours.")}
          gradient="bg-gradient-to-br from-[#b45309] to-[#FDB813]"
        />
      </section>

      {/* Insurance + Calculators row */}
      <section className="container-x mt-4 grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-card border-b-[3px] border-[var(--brand-yellow)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[var(--brand-black)]">{t("section.generalInsurance")}</h3>
            <Link to="/insurance" className="text-sm font-semibold text-blue-600 hover:underline">{t("common.viewAll")}</Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <IconTile icon={HeartPulse} label={tEn("Health Insurance")} to="/insurance" />
            <IconTile icon={ShieldCheck} label={tEn("Life Insurance")} to="/insurance" />
            <IconTile icon={FileText} label={tEn("Medical Claim")} to="/insurance" />
          </div>
        </div>
        <div id="calculators" className="scroll-mt-32 bg-white rounded-lg shadow-card border-b-[3px] border-[var(--brand-yellow)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[var(--brand-black)]">{t("section.calculators")}</h3>
            <Link to="/calculators" className="text-sm font-semibold text-blue-600 hover:underline">{t("common.viewAll")}</Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <IconTile icon={Calculator} label={tEn("EMI Calculator")} to="/calculators" />
            <IconTile icon={PiggyBank} label={tEn("FD Calculator")} to="/calculators" />
            <IconTile icon={Coins} label={tEn("Gold Calculator")} to="/calculators" />
          </div>
        </div>
      </section>

      {/* We have your finances covered */}
      <section id="about" className="scroll-mt-32 container-x mt-12">
        <div className="grid md:grid-cols-4 gap-6 items-start">
          <div className="md:col-span-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--brand-black)]">{t("about.title")}</h2>
            <p className="text-sm text-muted-foreground mt-3">{t("about.body")}</p>
            <Link to="/loans" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[var(--brand-black)] hover:text-amber-700">
              {t("about.cta")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {[
            { title: tEn("Invest"), body: tEn("Grow your savings with industry-leading FD rates and bonds."), color: "bg-purple-50" },
            { title: tEn("Borrow"), body: tEn("Quick approvals on personal, home, business and vehicle loans."), color: "bg-yellow-50" },
            { title: tEn("Protect"), body: tEn("Comprehensive health and life cover for your family."), color: "bg-blue-50" },
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
