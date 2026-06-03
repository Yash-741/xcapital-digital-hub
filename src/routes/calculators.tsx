import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Calculator, PiggyBank, TrendingUp, Wallet, Home, Briefcase,
  GraduationCap, Car, Building2,
} from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/calculators")({
  head: () => ({
    meta: [
      { title: "Calculators — XCapital" },
      { name: "description", content: "Interactive EMI, SIP, Lumpsum and FD calculators by XCapital." },
      { property: "og:title", content: "Calculators — XCapital" },
      { property: "og:description", content: "Plan your loans and investments with live, accurate calculators." },
    ],
  }),
  component: CalculatorsPage,
});

function inr(n: number) {
  if (!isFinite(n) || isNaN(n)) return "₹0";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function clamp(n: number, min: number, max: number) {
  if (isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}

function Field({
  label, value, min, max, step, onChange, suffix, prefix,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (n: number) => void; suffix?: string; prefix?: string;
}) {
  const display = suffix === "₹" || prefix === "₹"
    ? Math.round(value).toLocaleString("en-IN")
    : String(value);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <div className={`flex items-center rounded-md border px-2 py-1 bg-background border-input focus-within:border-[var(--brand-yellow)] focus-within:ring-2 focus-within:ring-[var(--brand-yellow)]/30`}>
          {prefix && <span className="text-sm font-semibold text-[var(--brand-black)]">{prefix}</span>}
          <input
            type="text"
            inputMode="decimal"
            value={display}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, "").replace(/[^0-9.]/g, "");
              const n = Number(raw);
              if (raw === "" || isNaN(n)) return onChange(min);
              onChange(clamp(n, min, max));
            }}
            className="w-24 text-right text-sm font-semibold text-[var(--brand-black)] bg-transparent outline-none"
          />
          {suffix && <span className="text-sm font-semibold text-[var(--brand-black)] ml-1">{suffix}</span>}
        </div>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--brand-yellow)]"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{prefix === "₹" ? inr(min) : `${min}${suffix ?? ""}`}</span>
        <span>{prefix === "₹" ? inr(max) : `${max}${suffix ?? ""}`}</span>
      </div>
    </div>
  );
}

/** Two-segment donut showing split between two values */
function Donut({ a, b, labelA, labelB, center }: {
  a: number; b: number; labelA: string; labelB: string; center: string;
}) {
  const total = Math.max(a + b, 1);
  const pctA = (a / total) * 100;
  const C = 2 * Math.PI * 56;
  const dashA = (pctA / 100) * C;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
          <circle cx="80" cy="80" r="56" fill="none" stroke="var(--brand-yellow)" strokeWidth="20" />
          <circle cx="80" cy="80" r="56" fill="none" stroke="#1a1a1a" strokeWidth="20"
            strokeDasharray={`${dashA} ${C - dashA}`} />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</div>
            <div className="text-sm font-bold text-[var(--brand-black)]">{center}</div>
          </div>
        </div>
      </div>
      <ul className="text-sm space-y-2">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[var(--brand-black)]" />
          <span className="text-muted-foreground">{labelA}</span>
          <span className="ml-auto font-semibold text-[var(--brand-black)]">{inr(a)}</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[var(--brand-yellow)]" />
          <span className="text-muted-foreground">{labelB}</span>
          <span className="ml-auto font-semibold text-[var(--brand-black)]">{inr(b)}</span>
        </li>
      </ul>
    </div>
  );
}

/* ---------------- EMI ---------------- */

type LoanPreset = { key: string; label: string; icon: typeof Home; defaultRate: number; defaultTenure: number; defaultAmount: number; maxAmount: number; };
const loanPresets: LoanPreset[] = [
  { key: "personal", label: "Personal", icon: Wallet, defaultRate: 12, defaultTenure: 36, defaultAmount: 500000, maxAmount: 4000000 },
  { key: "home", label: "Home", icon: Home, defaultRate: 8.5, defaultTenure: 240, defaultAmount: 5000000, maxAmount: 100000000 },
  { key: "business", label: "Business", icon: Briefcase, defaultRate: 14, defaultTenure: 60, defaultAmount: 2000000, maxAmount: 50000000 },
  { key: "car", label: "Car", icon: Car, defaultRate: 9.5, defaultTenure: 60, defaultAmount: 800000, maxAmount: 10000000 },
  { key: "education", label: "Education", icon: GraduationCap, defaultRate: 10.5, defaultTenure: 84, defaultAmount: 1500000, maxAmount: 20000000 },
  { key: "property", label: "LAP", icon: Building2, defaultRate: 10, defaultTenure: 180, defaultAmount: 3000000, maxAmount: 50000000 },
];

function EMICalculator() {
  const [preset, setPreset] = useState<LoanPreset>(loanPresets[0]);
  const [amount, setAmount] = useState(preset.defaultAmount);
  const [rate, setRate] = useState(preset.defaultRate);
  const [tenure, setTenure] = useState(preset.defaultTenure);

  const pickPreset = (p: LoanPreset) => {
    setPreset(p);
    setAmount(p.defaultAmount);
    setRate(p.defaultRate);
    setTenure(p.defaultTenure);
  };

  const { emi, total, interest } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    const e = r === 0 ? amount / n : (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const t = e * n;
    return { emi: e, total: t, interest: t - amount };
  }, [amount, rate, tenure]);

  return (
    <div className="bg-card border border-border rounded-xl shadow-card p-7 border-b-[3px] border-b-[var(--brand-yellow)]">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-11 w-11 rounded-lg bg-[var(--brand-yellow-soft)] grid place-items-center text-[var(--brand-black)]">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[var(--brand-black)]">Loan EMI Calculator</h3>
          <p className="text-xs text-muted-foreground">Estimate monthly EMI, interest and total payable</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {loanPresets.map((p) => {
          const active = p.key === preset.key;
          const Icon = p.icon;
          return (
            <button
              key={p.key}
              onClick={() => pickPreset(p)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                active
                  ? "bg-[var(--brand-black)] text-[var(--brand-yellow)] border-[var(--brand-black)]"
                  : "bg-background text-muted-foreground border-border hover:border-[var(--brand-yellow)]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {p.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-5">
        <Field label="Loan Amount" value={amount} min={50000} max={preset.maxAmount} step={50000} onChange={setAmount} prefix="₹" />
        <Field label="Interest Rate (p.a.)" value={rate} min={4} max={30} step={0.1} onChange={setRate} suffix="%" />
        <Field label="Tenure (months)" value={tenure} min={3} max={360} step={1} onChange={setTenure} suffix=" mo" />
      </div>

      <div className="mt-7 bg-[var(--brand-black)] text-white rounded-lg p-6">
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wider">Monthly EMI</div>
            <div className="text-xl font-bold text-[var(--brand-yellow)] mt-1">{inr(emi)}</div>
          </div>
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wider">Interest</div>
            <div className="text-xl font-bold mt-1">{inr(interest)}</div>
          </div>
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wider">Total Payable</div>
            <div className="text-xl font-bold mt-1">{inr(total)}</div>
          </div>
        </div>
        <div className="bg-white/5 rounded-md p-4">
          <Donut a={amount} b={interest} labelA="Principal" labelB="Interest" center={inr(total)} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- SIP ---------------- */

function SIPCalculator() {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const { invested, maturity, gains } = useMemo(() => {
    const i = rate / 12 / 100;
    const n = years * 12;
    const m = monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const inv = monthly * n;
    return { invested: inv, maturity: m, gains: m - inv };
  }, [monthly, rate, years]);

  return (
    <div className="bg-card border border-border rounded-xl shadow-card p-7 border-b-[3px] border-b-[var(--brand-yellow)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-11 w-11 rounded-lg bg-[var(--brand-yellow-soft)] grid place-items-center text-[var(--brand-black)]">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[var(--brand-black)]">SIP Calculator</h3>
          <p className="text-xs text-muted-foreground">Project your mutual-fund SIP returns</p>
        </div>
      </div>
      <div className="space-y-5">
        <Field label="Monthly Investment" value={monthly} min={500} max={500000} step={500} onChange={setMonthly} prefix="₹" />
        <Field label="Expected Return (p.a.)" value={rate} min={1} max={30} step={0.1} onChange={setRate} suffix="%" />
        <Field label="Time Period" value={years} min={1} max={40} step={1} onChange={setYears} suffix=" yr" />
      </div>
      <div className="mt-7 bg-[var(--brand-black)] text-white rounded-lg p-6">
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div><div className="text-xs text-white/60 uppercase tracking-wider">Invested</div><div className="text-xl font-bold mt-1">{inr(invested)}</div></div>
          <div><div className="text-xs text-white/60 uppercase tracking-wider">Est. Returns</div><div className="text-xl font-bold mt-1">{inr(gains)}</div></div>
          <div><div className="text-xs text-white/60 uppercase tracking-wider">Maturity</div><div className="text-xl font-bold text-[var(--brand-yellow)] mt-1">{inr(maturity)}</div></div>
        </div>
        <div className="bg-white/5 rounded-md p-4">
          <Donut a={invested} b={gains} labelA="Invested" labelB="Est. Returns" center={inr(maturity)} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Lumpsum ---------------- */

function LumpsumCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const { maturity, gains } = useMemo(() => {
    const m = principal * Math.pow(1 + rate / 100, years);
    return { maturity: m, gains: m - principal };
  }, [principal, rate, years]);

  return (
    <div className="bg-card border border-border rounded-xl shadow-card p-7 border-b-[3px] border-b-[var(--brand-yellow)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-11 w-11 rounded-lg bg-[var(--brand-yellow-soft)] grid place-items-center text-[var(--brand-black)]">
          <Wallet className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[var(--brand-black)]">Lumpsum Calculator</h3>
          <p className="text-xs text-muted-foreground">One-time investment growth</p>
        </div>
      </div>
      <div className="space-y-5">
        <Field label="Investment Amount" value={principal} min={1000} max={50000000} step={1000} onChange={setPrincipal} prefix="₹" />
        <Field label="Expected Return (p.a.)" value={rate} min={1} max={30} step={0.1} onChange={setRate} suffix="%" />
        <Field label="Time Period" value={years} min={1} max={40} step={1} onChange={setYears} suffix=" yr" />
      </div>
      <div className="mt-7 bg-[var(--brand-black)] text-white rounded-lg p-6">
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div><div className="text-xs text-white/60 uppercase tracking-wider">Invested</div><div className="text-xl font-bold mt-1">{inr(principal)}</div></div>
          <div><div className="text-xs text-white/60 uppercase tracking-wider">Est. Returns</div><div className="text-xl font-bold mt-1">{inr(gains)}</div></div>
          <div><div className="text-xs text-white/60 uppercase tracking-wider">Maturity</div><div className="text-xl font-bold text-[var(--brand-yellow)] mt-1">{inr(maturity)}</div></div>
        </div>
        <div className="bg-white/5 rounded-md p-4">
          <Donut a={principal} b={gains} labelA="Invested" labelB="Est. Returns" center={inr(maturity)} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- FD ---------------- */

function FDCalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(7.5);
  const [years, setYears] = useState(5);

  const { maturity, interest } = useMemo(() => {
    const n = 4;
    const m = principal * Math.pow(1 + rate / 100 / n, n * years);
    return { maturity: m, interest: m - principal };
  }, [principal, rate, years]);

  return (
    <div className="bg-card border border-border rounded-xl shadow-card p-7 border-b-[3px] border-b-[var(--brand-yellow)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-11 w-11 rounded-lg bg-[var(--brand-yellow-soft)] grid place-items-center text-[var(--brand-black)]">
          <PiggyBank className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[var(--brand-black)]">Fixed Deposit Calculator</h3>
          <p className="text-xs text-muted-foreground">Quarterly compounding maturity value</p>
        </div>
      </div>
      <div className="space-y-5">
        <Field label="Principal Amount" value={principal} min={10000} max={20000000} step={10000} onChange={setPrincipal} prefix="₹" />
        <Field label="Interest Rate (p.a.)" value={rate} min={3} max={12} step={0.05} onChange={setRate} suffix="%" />
        <Field label="Tenure" value={years} min={1} max={20} step={1} onChange={setYears} suffix=" yr" />
      </div>
      <div className="mt-7 bg-[var(--brand-black)] text-white rounded-lg p-6">
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div><div className="text-xs text-white/60 uppercase tracking-wider">Invested</div><div className="text-xl font-bold mt-1">{inr(principal)}</div></div>
          <div><div className="text-xs text-white/60 uppercase tracking-wider">Interest</div><div className="text-xl font-bold mt-1">{inr(interest)}</div></div>
          <div><div className="text-xs text-white/60 uppercase tracking-wider">Maturity</div><div className="text-xl font-bold text-[var(--brand-yellow)] mt-1">{inr(maturity)}</div></div>
        </div>
        <div className="bg-white/5 rounded-md p-4">
          <Donut a={principal} b={interest} labelA="Principal" labelB="Interest" center={inr(maturity)} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

type TabKey = "emi" | "sip" | "lumpsum" | "fd";
const tabs: { key: TabKey; label: string; icon: typeof Calculator }[] = [
  { key: "emi", label: "Loan EMI", icon: Calculator },
  { key: "sip", label: "SIP", icon: TrendingUp },
  { key: "lumpsum", label: "Lumpsum", icon: Wallet },
  { key: "fd", label: "Fixed Deposit", icon: PiggyBank },
];

function CalculatorsPage() {
  const [tab, setTab] = useState<TabKey>("emi");

  return (
    <SiteLayout>
      <PageHeader eyebrow="Tools" title="Plan with precision" subtitle="Interactive calculators to estimate EMIs, SIP returns and deposit maturity instantly." />
      <section className="container-x py-16">
        <div className="flex flex-wrap justify-center gap-2 mb-10 bg-secondary/50 border border-border rounded-full p-1.5 max-w-2xl mx-auto">
          {tabs.map((t) => {
            const active = t.key === tab;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full transition ${
                  active
                    ? "bg-[var(--brand-black)] text-[var(--brand-yellow)] shadow"
                    : "text-muted-foreground hover:text-[var(--brand-black)]"
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto">
          {tab === "emi" && <EMICalculator />}
          {tab === "sip" && <SIPCalculator />}
          {tab === "lumpsum" && <LumpsumCalculator />}
          {tab === "fd" && <FDCalculator />}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8 max-w-2xl mx-auto">
          Calculations are indicative and based on the inputs provided. Actual figures may vary by lender, taxes and market performance.
        </p>
      </section>
    </SiteLayout>
  );
}