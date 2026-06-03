import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calculator, PiggyBank } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/calculators")({
  head: () => ({
    meta: [
      { title: "Calculators — XCapital" },
      { name: "description", content: "Interactive EMI and FD calculators by XCapital." },
      { property: "og:title", content: "Calculators — XCapital" },
      { property: "og:description", content: "Plan your loans and investments with live calculators." },
    ],
  }),
  component: CalculatorsPage,
});

function inr(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function Slider({ label, value, min, max, step, onChange, suffix }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (n: number) => void; suffix: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm font-semibold text-[var(--brand-navy)]">{suffix === "₹" ? inr(value) : `${value}${suffix}`}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-2 accent-[var(--brand-gold)]"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{suffix === "₹" ? inr(min) : `${min}${suffix}`}</span>
        <span>{suffix === "₹" ? inr(max) : `${max}${suffix}`}</span>
      </div>
    </div>
  );
}

function EMICalculator() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(60);

  const { emi, total, interest } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    const e = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const t = e * n;
    return { emi: e, total: t, interest: t - amount };
  }, [amount, rate, tenure]);

  return (
    <div className="bg-card border border-border rounded-xl shadow-card p-7">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-11 w-11 rounded-lg bg-[var(--brand-gold)]/15 grid place-items-center text-[var(--brand-navy)]"><Calculator className="h-5 w-5" /></div>
        <h3 className="text-xl font-semibold">EMI Calculator</h3>
      </div>
      <div className="space-y-6">
        <Slider label="Loan Amount" value={amount} min={50000} max={10000000} step={50000} onChange={setAmount} suffix="₹" />
        <Slider label="Interest Rate" value={rate} min={6} max={24} step={0.1} onChange={setRate} suffix="%" />
        <Slider label="Tenure (months)" value={tenure} min={6} max={360} step={6} onChange={setTenure} suffix=" mo" />
      </div>
      <div className="mt-7 bg-[var(--brand-navy)] text-white rounded-lg p-6 grid grid-cols-3 gap-4 text-center">
        <div><div className="text-xs text-white/70">Monthly EMI</div><div className="text-lg font-bold text-[var(--brand-gold)] mt-1">{inr(emi)}</div></div>
        <div><div className="text-xs text-white/70">Interest</div><div className="text-lg font-bold mt-1">{inr(interest)}</div></div>
        <div><div className="text-xs text-white/70">Total Payable</div><div className="text-lg font-bold mt-1">{inr(total)}</div></div>
      </div>
    </div>
  );
}

function FDCalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(5);

  const { maturity, interest } = useMemo(() => {
    const n = 4;
    const m = principal * Math.pow(1 + rate / 100 / n, n * years);
    return { maturity: m, interest: m - principal };
  }, [principal, rate, years]);

  return (
    <div className="bg-card border border-border rounded-xl shadow-card p-7">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-11 w-11 rounded-lg bg-[var(--brand-gold)]/15 grid place-items-center text-[var(--brand-navy)]"><PiggyBank className="h-5 w-5" /></div>
        <h3 className="text-xl font-semibold">FD Calculator</h3>
      </div>
      <div className="space-y-6">
        <Slider label="Principal" value={principal} min={10000} max={5000000} step={10000} onChange={setPrincipal} suffix="₹" />
        <Slider label="Interest Rate" value={rate} min={3} max={10} step={0.1} onChange={setRate} suffix="%" />
        <Slider label="Tenure (years)" value={years} min={1} max={10} step={1} onChange={setYears} suffix=" yr" />
      </div>
      <div className="mt-7 bg-[var(--brand-navy)] text-white rounded-lg p-6 grid grid-cols-3 gap-4 text-center">
        <div><div className="text-xs text-white/70">Invested</div><div className="text-lg font-bold mt-1">{inr(principal)}</div></div>
        <div><div className="text-xs text-white/70">Interest</div><div className="text-lg font-bold mt-1">{inr(interest)}</div></div>
        <div><div className="text-xs text-white/70">Maturity</div><div className="text-lg font-bold text-[var(--brand-gold)] mt-1">{inr(maturity)}</div></div>
      </div>
    </div>
  );
}

function CalculatorsPage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Tools" title="Plan with precision" subtitle="Use our interactive calculators to estimate your EMIs and FD returns instantly." />
      <section className="container-x py-16 grid lg:grid-cols-2 gap-8">
        <EMICalculator />
        <FDCalculator />
      </section>
    </SiteLayout>
  );
}