import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Calculator, PiggyBank, TrendingUp, Wallet, Home, Briefcase,
  GraduationCap, Car, Building2, Plus, X, Trash2, Trophy,
  Landmark, Coins, Receipt, BarChart3, LineChart, Percent,
  PieChart, BadgeIndianRupee, Banknote, HandCoins, Sigma, ShieldCheck, Search,
} from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/calculators")({
  head: () => ({
    meta: [
      { title: "EMI, SIP, FD & Lumpsum Calculators | XCapital" },
      { name: "description", content: "Free online EMI, SIP, Lumpsum, FD and Home Loan calculators. Plan your loan EMIs and investment returns instantly with accurate, India-ready tools." },
      { property: "og:title", content: "EMI, SIP, FD & Lumpsum Calculators | XCapital" },
      { property: "og:description", content: "Live calculators for every loan and investment decision — built for Indian borrowers and investors." },
      { property: "og:url", content: "/calculators" },
    ],
    links: [{ rel: "canonical", href: "/calculators" }],
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

/* ---------------- Scenarios ---------------- */

type TabKey = "emi" | "sip" | "lumpsum" | "fd";
type ScenarioRow = { label: string; value: string };
type Scenario = {
  id: string;
  kind: TabKey;
  name: string;
  inputs: ScenarioRow[];
  outputs: ScenarioRow[];
  /** Label of the output row used to pick the "best" scenario */
  primary: string;
  /** Numeric value of the primary output (raw, not formatted) */
  primaryValue: number;
  /** Whether lower or higher primary wins */
  better: "lower" | "higher";
};

type SaveFn = (s: Omit<Scenario, "id" | "name">) => void;

function SaveScenarioButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[var(--brand-yellow)] text-[var(--brand-black)] font-semibold py-2.5 rounded-md hover:brightness-110 transition"
    >
      <Plus className="h-4 w-4" /> Save scenario to compare
    </button>
  );
}

function ComparePanel({
  scenarios, onRemove, onClear, onRename,
}: {
  scenarios: Scenario[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onRename: (id: string, name: string) => void;
}) {
  if (scenarios.length === 0) {
    return (
      <div className="mt-8 border border-dashed border-border rounded-xl p-8 text-center bg-secondary/30">
        <h4 className="font-semibold text-[var(--brand-black)]">Compare scenarios side-by-side</h4>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Tweak the inputs above and tap <span className="font-semibold text-[var(--brand-black)]">Save scenario</span> to add it here. You can save as many as you'd like, then pick the one that works best.
        </p>
      </div>
    );
  }

  // Determine best
  const bestId = scenarios.reduce((best, s) => {
    if (!best) return s;
    const cmp = s.better === "lower" ? s.primaryValue < best.primaryValue : s.primaryValue > best.primaryValue;
    return cmp ? s : best;
  }, null as Scenario | null)?.id;

  // Build unified row order using first scenario as template
  const template = scenarios[0];
  const inputLabels = template.inputs.map((r) => r.label);
  const outputLabels = template.outputs.map((r) => r.label);
  const get = (s: Scenario, label: string, source: "inputs" | "outputs") =>
    s[source].find((r) => r.label === label)?.value ?? "—";

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-bold text-[var(--brand-black)]">
            Comparison <span className="text-muted-foreground font-normal">({scenarios.length})</span>
          </h4>
          <p className="text-xs text-muted-foreground">
            Best scenario for <span className="font-semibold text-[var(--brand-black)]">{template.primary}</span> is highlighted.
          </p>
        </div>
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear all
        </button>
      </div>

      {/* Mobile: stacked cards */}
      <div className="grid sm:grid-cols-2 lg:hidden gap-4">
        {scenarios.map((s) => {
          const isBest = s.id === bestId;
          return (
            <ScenarioCard
              key={s.id}
              s={s}
              isBest={isBest}
              inputLabels={inputLabels}
              outputLabels={outputLabels}
              get={get}
              onRemove={onRemove}
              onRename={onRename}
            />
          );
        })}
      </div>

      {/* Desktop: comparison table */}
      <div className="hidden lg:block overflow-x-auto bg-card border border-border rounded-xl shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              <th className="text-left px-4 py-3 font-semibold text-[var(--brand-black)] sticky left-0 bg-secondary/40">Metric</th>
              {scenarios.map((s) => {
                const isBest = s.id === bestId;
                return (
                  <th key={s.id} className={`px-4 py-3 text-left font-semibold min-w-[180px] ${isBest ? "bg-[var(--brand-yellow-soft)]" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <input
                          value={s.name}
                          onChange={(e) => onRename(s.id, e.target.value)}
                          className="w-full bg-transparent font-semibold text-[var(--brand-black)] outline-none border-b border-transparent focus:border-[var(--brand-black)]"
                        />
                        {isBest && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--brand-black)] mt-1">
                            <Trophy className="h-3 w-3" /> BEST
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => onRemove(s.id)}
                        className="text-muted-foreground hover:text-red-600 shrink-0"
                        aria-label="Remove scenario"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-secondary/20">
              <td colSpan={scenarios.length + 1} className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Inputs</td>
            </tr>
            {inputLabels.map((label) => (
              <tr key={label} className="border-t border-border">
                <td className="px-4 py-2.5 text-muted-foreground sticky left-0 bg-card">{label}</td>
                {scenarios.map((s) => (
                  <td key={s.id} className={`px-4 py-2.5 text-[var(--brand-black)] ${s.id === bestId ? "bg-[var(--brand-yellow-soft)]/40" : ""}`}>
                    {get(s, label, "inputs")}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-secondary/20">
              <td colSpan={scenarios.length + 1} className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Outputs</td>
            </tr>
            {outputLabels.map((label) => {
              const isPrimary = label === template.primary;
              return (
                <tr key={label} className="border-t border-border">
                  <td className={`px-4 py-2.5 sticky left-0 bg-card ${isPrimary ? "font-semibold text-[var(--brand-black)]" : "text-muted-foreground"}`}>{label}</td>
                  {scenarios.map((s) => (
                    <td key={s.id} className={`px-4 py-2.5 ${s.id === bestId ? "bg-[var(--brand-yellow-soft)]/40" : ""} ${isPrimary ? "font-bold text-[var(--brand-black)]" : "text-[var(--brand-black)]"}`}>
                      {get(s, label, "outputs")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScenarioCard({
  s, isBest, inputLabels, outputLabels, get, onRemove, onRename,
}: {
  s: Scenario;
  isBest: boolean;
  inputLabels: string[];
  outputLabels: string[];
  get: (s: Scenario, label: string, source: "inputs" | "outputs") => string;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  return (
    <div className={`rounded-xl border shadow-card p-4 ${isBest ? "border-[var(--brand-yellow)] bg-[var(--brand-yellow-soft)]/30" : "border-border bg-card"}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <input
            value={s.name}
            onChange={(e) => onRename(s.id, e.target.value)}
            className="w-full bg-transparent font-semibold text-[var(--brand-black)] outline-none border-b border-transparent focus:border-[var(--brand-black)]"
          />
          {isBest && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--brand-black)] mt-1">
              <Trophy className="h-3 w-3" /> BEST
            </span>
          )}
        </div>
        <button onClick={() => onRemove(s.id)} className="text-muted-foreground hover:text-red-600 shrink-0" aria-label="Remove scenario">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Inputs</div>
      <dl className="text-xs space-y-1 mb-3">
        {inputLabels.map((l) => (
          <div key={l} className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{l}</dt>
            <dd className="text-[var(--brand-black)] font-medium">{get(s, l, "inputs")}</dd>
          </div>
        ))}
      </dl>
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Outputs</div>
      <dl className="text-xs space-y-1">
        {outputLabels.map((l) => {
          const isPrimary = l === s.primary;
          return (
            <div key={l} className="flex justify-between gap-3">
              <dt className={isPrimary ? "font-semibold text-[var(--brand-black)]" : "text-muted-foreground"}>{l}</dt>
              <dd className={`${isPrimary ? "font-bold" : "font-medium"} text-[var(--brand-black)]`}>{get(s, l, "outputs")}</dd>
            </div>
          );
        })}
      </dl>
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

function EMICalculator({ onSave, initialPresetKey }: { onSave: SaveFn; initialPresetKey?: string }) {
  const initial = loanPresets.find((p) => p.key === initialPresetKey) ?? loanPresets[0];
  const [preset, setPreset] = useState<LoanPreset>(initial);
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

  const save = () => onSave({
    kind: "emi",
    primary: "Monthly EMI",
    primaryValue: emi,
    better: "lower",
    inputs: [
      { label: "Loan Type", value: preset.label },
      { label: "Loan Amount", value: inr(amount) },
      { label: "Interest Rate", value: `${rate}% p.a.` },
      { label: "Tenure", value: `${tenure} mo` },
    ],
    outputs: [
      { label: "Monthly EMI", value: inr(emi) },
      { label: "Total Interest", value: inr(interest) },
      { label: "Total Payable", value: inr(total) },
    ],
  });

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
      <SaveScenarioButton onClick={save} />
    </div>
  );
}

/* ---------------- SIP ---------------- */

function SIPCalculator({ onSave }: { onSave: SaveFn }) {
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

  const save = () => onSave({
    kind: "sip",
    primary: "Maturity",
    primaryValue: maturity,
    better: "higher",
    inputs: [
      { label: "Monthly Investment", value: inr(monthly) },
      { label: "Expected Return", value: `${rate}% p.a.` },
      { label: "Time Period", value: `${years} yr` },
    ],
    outputs: [
      { label: "Invested", value: inr(invested) },
      { label: "Est. Returns", value: inr(gains) },
      { label: "Maturity", value: inr(maturity) },
    ],
  });

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
      <SaveScenarioButton onClick={save} />
    </div>
  );
}

/* ---------------- Lumpsum ---------------- */

function LumpsumCalculator({ onSave }: { onSave: SaveFn }) {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const { maturity, gains } = useMemo(() => {
    const m = principal * Math.pow(1 + rate / 100, years);
    return { maturity: m, gains: m - principal };
  }, [principal, rate, years]);

  const save = () => onSave({
    kind: "lumpsum",
    primary: "Maturity",
    primaryValue: maturity,
    better: "higher",
    inputs: [
      { label: "Investment Amount", value: inr(principal) },
      { label: "Expected Return", value: `${rate}% p.a.` },
      { label: "Time Period", value: `${years} yr` },
    ],
    outputs: [
      { label: "Invested", value: inr(principal) },
      { label: "Est. Returns", value: inr(gains) },
      { label: "Maturity", value: inr(maturity) },
    ],
  });

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
      <SaveScenarioButton onClick={save} />
    </div>
  );
}

/* ---------------- FD ---------------- */

function FDCalculator({ onSave }: { onSave: SaveFn }) {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(7.5);
  const [years, setYears] = useState(5);

  const { maturity, interest } = useMemo(() => {
    const n = 4;
    const m = principal * Math.pow(1 + rate / 100 / n, n * years);
    return { maturity: m, interest: m - principal };
  }, [principal, rate, years]);

  const save = () => onSave({
    kind: "fd",
    primary: "Maturity",
    primaryValue: maturity,
    better: "higher",
    inputs: [
      { label: "Principal", value: inr(principal) },
      { label: "Interest Rate", value: `${rate}% p.a.` },
      { label: "Tenure", value: `${years} yr` },
    ],
    outputs: [
      { label: "Invested", value: inr(principal) },
      { label: "Interest", value: inr(interest) },
      { label: "Maturity", value: inr(maturity) },
    ],
  });

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
      <SaveScenarioButton onClick={save} />
    </div>
  );
}

/* ---------------- Page ---------------- */

/* Generic calculator infra used by all simple calculators */

type CalcInput = {
  key: string; label: string; default: number;
  min: number; max: number; step: number;
  prefix?: string; suffix?: string;
};
type CalcResult = {
  rows: { label: string; value: string }[];
  primaryLabel: string;
  primaryValue: number;
  better?: "higher" | "lower";
  donut?: { a: number; b: number; labelA: string; labelB: string; center: string };
};
type SimpleDef = {
  id: string; title: string; desc: string;
  icon: typeof Calculator;
  inputs: CalcInput[];
  compute: (v: Record<string, number>) => CalcResult;
};

function SimpleCalc({ def }: { def: SimpleDef }) {
  const [vals, setVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(def.inputs.map((i) => [i.key, i.default])),
  );
  const result = useMemo(() => def.compute(vals), [def, vals]);
  const Icon = def.icon;
  return (
    <div className="bg-card border border-border rounded-xl shadow-card p-7 border-b-[3px] border-b-[var(--brand-yellow)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-11 w-11 rounded-lg bg-[var(--brand-yellow-soft)] grid place-items-center text-[var(--brand-black)]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[var(--brand-black)]">{def.title}</h3>
          <p className="text-xs text-muted-foreground">{def.desc}</p>
        </div>
      </div>
      <div className="space-y-5">
        {def.inputs.map((i) => (
          <Field
            key={i.key}
            label={i.label}
            value={vals[i.key] ?? i.default}
            min={i.min} max={i.max} step={i.step}
            prefix={i.prefix} suffix={i.suffix}
            onChange={(n) => setVals((p) => ({ ...p, [i.key]: n }))}
          />
        ))}
      </div>
      <div className="mt-7 bg-[var(--brand-black)] text-white rounded-lg p-6">
        <div className={`grid gap-4 text-center mb-6 ${result.rows.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          {result.rows.map((r) => {
            const isPrimary = r.label === result.primaryLabel;
            return (
              <div key={r.label}>
                <div className="text-xs text-white/60 uppercase tracking-wider">{r.label}</div>
                <div className={`text-xl font-bold mt-1 ${isPrimary ? "text-[var(--brand-yellow)]" : ""}`}>{r.value}</div>
              </div>
            );
          })}
        </div>
        {result.donut && (
          <div className="bg-white/5 rounded-md p-4">
            <Donut {...result.donut} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Computation helpers ---------------- */

const sipFV = (m: number, ratePct: number, years: number) => {
  const i = ratePct / 12 / 100;
  const n = years * 12;
  if (i === 0) return m * n;
  return m * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
};
const compoundFV = (p: number, ratePct: number, years: number, freq = 1) =>
  p * Math.pow(1 + ratePct / 100 / freq, freq * years);
const emi = (P: number, ratePct: number, months: number) => {
  const r = ratePct / 12 / 100;
  if (r === 0) return P / months;
  return (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
};
const pct = (n: number) => `${n.toFixed(2)}%`;

/* ---------------- Calculator registry ---------------- */

const simpleCalcs: SimpleDef[] = [
  {
    id: "fip", title: "FIP Calculator", desc: "Flexible Investment Plan with annual step-up", icon: TrendingUp,
    inputs: [
      { key: "monthly", label: "Monthly Investment", default: 10000, min: 500, max: 500000, step: 500, prefix: "₹" },
      { key: "stepup", label: "Annual Step-up", default: 10, min: 0, max: 30, step: 1, suffix: "%" },
      { key: "rate", label: "Expected Return (p.a.)", default: 12, min: 1, max: 30, step: 0.1, suffix: "%" },
      { key: "years", label: "Time Period", default: 10, min: 1, max: 40, step: 1, suffix: " yr" },
    ],
    compute: ({ monthly, stepup, rate, years }) => {
      let bal = 0; let invested = 0; let m = monthly;
      const i = rate / 12 / 100;
      for (let y = 0; y < years; y++) {
        for (let mo = 0; mo < 12; mo++) {
          bal = (bal + m) * (1 + i);
          invested += m;
        }
        m *= 1 + stepup / 100;
      }
      return {
        primaryLabel: "Maturity", primaryValue: bal, better: "higher",
        rows: [
          { label: "Invested", value: inr(invested) },
          { label: "Est. Returns", value: inr(bal - invested) },
          { label: "Maturity", value: inr(bal) },
        ],
        donut: { a: invested, b: bal - invested, labelA: "Invested", labelB: "Est. Returns", center: inr(bal) },
      };
    },
  },
  {
    id: "nsc", title: "National Saving Calculator", desc: "NSC compounded annually", icon: Landmark,
    inputs: [
      { key: "p", label: "Investment", default: 100000, min: 1000, max: 5000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Interest Rate (p.a.)", default: 7.7, min: 1, max: 15, step: 0.05, suffix: "%" },
      { key: "years", label: "Tenure", default: 5, min: 1, max: 15, step: 1, suffix: " yr" },
    ],
    compute: ({ p, rate, years }) => {
      const m = compoundFV(p, rate, years, 1);
      return {
        primaryLabel: "Maturity", primaryValue: m, better: "higher",
        rows: [
          { label: "Invested", value: inr(p) },
          { label: "Interest", value: inr(m - p) },
          { label: "Maturity", value: inr(m) },
        ],
        donut: { a: p, b: m - p, labelA: "Principal", labelB: "Interest", center: inr(m) },
      };
    },
  },
  {
    id: "ebitda", title: "EBITDA Calculator", desc: "Earnings before interest, tax, depreciation & amortization", icon: BarChart3,
    inputs: [
      { key: "rev", label: "Revenue", default: 10000000, min: 0, max: 1000000000, step: 100000, prefix: "₹" },
      { key: "opex", label: "Operating Expenses", default: 6000000, min: 0, max: 1000000000, step: 100000, prefix: "₹" },
      { key: "da", label: "Depreciation & Amortization", default: 500000, min: 0, max: 100000000, step: 50000, prefix: "₹" },
    ],
    compute: ({ rev, opex, da }) => {
      const ebitda = rev - opex + da;
      const margin = rev ? (ebitda / rev) * 100 : 0;
      return {
        primaryLabel: "EBITDA", primaryValue: ebitda, better: "higher",
        rows: [
          { label: "EBITDA", value: inr(ebitda) },
          { label: "Margin", value: pct(margin) },
          { label: "Operating Profit", value: inr(ebitda - da) },
        ],
      };
    },
  },
  {
    id: "savings", title: "Savings Calculator", desc: "Future value of regular monthly savings", icon: PiggyBank,
    inputs: [
      { key: "m", label: "Monthly Saving", default: 5000, min: 100, max: 500000, step: 500, prefix: "₹" },
      { key: "rate", label: "Interest Rate (p.a.)", default: 6, min: 1, max: 15, step: 0.1, suffix: "%" },
      { key: "years", label: "Time Period", default: 5, min: 1, max: 40, step: 1, suffix: " yr" },
    ],
    compute: ({ m, rate, years }) => {
      const fv = sipFV(m, rate, years);
      const invested = m * years * 12;
      return {
        primaryLabel: "Maturity", primaryValue: fv, better: "higher",
        rows: [
          { label: "Saved", value: inr(invested) },
          { label: "Interest", value: inr(fv - invested) },
          { label: "Maturity", value: inr(fv) },
        ],
        donut: { a: invested, b: fv - invested, labelA: "Saved", labelB: "Interest", center: inr(fv) },
      };
    },
  },
  {
    id: "elss", title: "ELSS Calculator", desc: "Tax-saving SIP (3-year lock-in)", icon: TrendingUp,
    inputs: [
      { key: "m", label: "Monthly Investment", default: 12500, min: 500, max: 12500 * 10, step: 500, prefix: "₹" },
      { key: "rate", label: "Expected Return (p.a.)", default: 13, min: 1, max: 30, step: 0.1, suffix: "%" },
      { key: "years", label: "Time Period", default: 5, min: 3, max: 30, step: 1, suffix: " yr" },
    ],
    compute: ({ m, rate, years }) => {
      const fv = sipFV(m, rate, years);
      const invested = m * years * 12;
      return {
        primaryLabel: "Maturity", primaryValue: fv, better: "higher",
        rows: [
          { label: "Invested", value: inr(invested) },
          { label: "Est. Returns", value: inr(fv - invested) },
          { label: "Maturity", value: inr(fv) },
        ],
        donut: { a: invested, b: fv - invested, labelA: "Invested", labelB: "Est. Returns", center: inr(fv) },
      };
    },
  },
  {
    id: "pofd", title: "Post Office FD Calculator", desc: "Quarterly-compounded post office fixed deposit", icon: Landmark,
    inputs: [
      { key: "p", label: "Principal", default: 100000, min: 1000, max: 10000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Interest Rate (p.a.)", default: 7.1, min: 3, max: 12, step: 0.05, suffix: "%" },
      { key: "years", label: "Tenure", default: 5, min: 1, max: 10, step: 1, suffix: " yr" },
    ],
    compute: ({ p, rate, years }) => {
      const m = compoundFV(p, rate, years, 4);
      return {
        primaryLabel: "Maturity", primaryValue: m, better: "higher",
        rows: [
          { label: "Invested", value: inr(p) },
          { label: "Interest", value: inr(m - p) },
          { label: "Maturity", value: inr(m) },
        ],
        donut: { a: p, b: m - p, labelA: "Principal", labelB: "Interest", center: inr(m) },
      };
    },
  },
  {
    id: "ssy", title: "Sukanya Samriddhi Calculator", desc: "Yearly deposits compounded for 21 years", icon: BadgeIndianRupee,
    inputs: [
      { key: "y", label: "Yearly Deposit", default: 50000, min: 250, max: 150000, step: 500, prefix: "₹" },
      { key: "rate", label: "Interest Rate (p.a.)", default: 8.2, min: 5, max: 12, step: 0.05, suffix: "%" },
    ],
    compute: ({ y, rate }) => {
      const r = rate / 100;
      let bal = 0;
      for (let i = 0; i < 15; i++) bal = (bal + y) * (1 + r);
      for (let i = 0; i < 6; i++) bal = bal * (1 + r);
      const invested = y * 15;
      return {
        primaryLabel: "Maturity (21 yr)", primaryValue: bal, better: "higher",
        rows: [
          { label: "Deposited", value: inr(invested) },
          { label: "Interest", value: inr(bal - invested) },
          { label: "Maturity (21 yr)", value: inr(bal) },
        ],
        donut: { a: invested, b: bal - invested, labelA: "Deposited", labelB: "Interest", center: inr(bal) },
      };
    },
  },
  {
    id: "ulip", title: "ULIP Calculator", desc: "Unit-linked insurance plan returns (post charges)", icon: ShieldCheck,
    inputs: [
      { key: "m", label: "Monthly Premium", default: 10000, min: 500, max: 200000, step: 500, prefix: "₹" },
      { key: "rate", label: "Expected Return (p.a.)", default: 10, min: 1, max: 25, step: 0.1, suffix: "%" },
      { key: "charges", label: "Annual Charges", default: 2, min: 0, max: 8, step: 0.1, suffix: "%" },
      { key: "years", label: "Policy Term", default: 15, min: 5, max: 40, step: 1, suffix: " yr" },
    ],
    compute: ({ m, rate, charges, years }) => {
      const net = Math.max(rate - charges, 0);
      const fv = sipFV(m, net, years);
      const invested = m * years * 12;
      return {
        primaryLabel: "Maturity", primaryValue: fv, better: "higher",
        rows: [
          { label: "Invested", value: inr(invested) },
          { label: "Net Return", value: pct(net) + " p.a." },
          { label: "Maturity", value: inr(fv) },
        ],
        donut: { a: invested, b: fv - invested, labelA: "Invested", labelB: "Est. Returns", center: inr(fv) },
      };
    },
  },
  {
    id: "apr", title: "APR Calculator", desc: "Annual Percentage Rate including fees", icon: Percent,
    inputs: [
      { key: "amt", label: "Loan Amount", default: 500000, min: 10000, max: 50000000, step: 10000, prefix: "₹" },
      { key: "rate", label: "Interest Rate (p.a.)", default: 12, min: 1, max: 30, step: 0.1, suffix: "%" },
      { key: "fees", label: "Fees & Charges", default: 5000, min: 0, max: 5000000, step: 500, prefix: "₹" },
      { key: "tenure", label: "Tenure (months)", default: 36, min: 3, max: 360, step: 1, suffix: " mo" },
    ],
    compute: ({ amt, rate, fees, tenure }) => {
      const e = emi(amt, rate, tenure);
      const totalInt = e * tenure - amt;
      const apr = ((totalInt + fees) / amt) * (12 / tenure) * 100;
      return {
        primaryLabel: "APR", primaryValue: apr, better: "lower",
        rows: [
          { label: "Monthly EMI", value: inr(e) },
          { label: "Total Cost", value: inr(totalInt + fees) },
          { label: "APR", value: pct(apr) },
        ],
      };
    },
  },
  {
    id: "si", title: "Simple Interest Calculator", desc: "P × R × T / 100", icon: Sigma,
    inputs: [
      { key: "p", label: "Principal", default: 100000, min: 100, max: 50000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Interest Rate (p.a.)", default: 8, min: 1, max: 25, step: 0.1, suffix: "%" },
      { key: "years", label: "Time Period", default: 5, min: 1, max: 40, step: 1, suffix: " yr" },
    ],
    compute: ({ p, rate, years }) => {
      const si = (p * rate * years) / 100;
      const total = p + si;
      return {
        primaryLabel: "Total Amount", primaryValue: total, better: "higher",
        rows: [
          { label: "Principal", value: inr(p) },
          { label: "Interest", value: inr(si) },
          { label: "Total Amount", value: inr(total) },
        ],
        donut: { a: p, b: si, labelA: "Principal", labelB: "Interest", center: inr(total) },
      };
    },
  },
  {
    id: "ci", title: "Compound Interest Calculator", desc: "Monthly-compounded interest growth", icon: Sigma,
    inputs: [
      { key: "p", label: "Principal", default: 100000, min: 100, max: 50000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Interest Rate (p.a.)", default: 8, min: 1, max: 25, step: 0.1, suffix: "%" },
      { key: "years", label: "Time Period", default: 5, min: 1, max: 40, step: 1, suffix: " yr" },
    ],
    compute: ({ p, rate, years }) => {
      const m = compoundFV(p, rate, years, 12);
      return {
        primaryLabel: "Maturity", primaryValue: m, better: "higher",
        rows: [
          { label: "Principal", value: inr(p) },
          { label: "Interest", value: inr(m - p) },
          { label: "Maturity", value: inr(m) },
        ],
        donut: { a: p, b: m - p, labelA: "Principal", labelB: "Interest", center: inr(m) },
      };
    },
  },
  {
    id: "loan-interest", title: "Loan Interest Calculator", desc: "Total interest payable on a loan", icon: Receipt,
    inputs: [
      { key: "amt", label: "Loan Amount", default: 500000, min: 10000, max: 50000000, step: 10000, prefix: "₹" },
      { key: "rate", label: "Interest Rate (p.a.)", default: 11, min: 1, max: 30, step: 0.1, suffix: "%" },
      { key: "tenure", label: "Tenure (months)", default: 60, min: 3, max: 360, step: 1, suffix: " mo" },
    ],
    compute: ({ amt, rate, tenure }) => {
      const e = emi(amt, rate, tenure);
      const total = e * tenure;
      return {
        primaryLabel: "Total Interest", primaryValue: total - amt, better: "lower",
        rows: [
          { label: "Monthly EMI", value: inr(e) },
          { label: "Total Interest", value: inr(total - amt) },
          { label: "Total Payable", value: inr(total) },
        ],
        donut: { a: amt, b: total - amt, labelA: "Principal", labelB: "Interest", center: inr(total) },
      };
    },
  },
  {
    id: "roi", title: "ROI Calculator", desc: "Return on investment and annualised CAGR", icon: LineChart,
    inputs: [
      { key: "initial", label: "Initial Investment", default: 100000, min: 100, max: 100000000, step: 1000, prefix: "₹" },
      { key: "final", label: "Final Value", default: 150000, min: 100, max: 1000000000, step: 1000, prefix: "₹" },
      { key: "years", label: "Holding Period", default: 3, min: 1, max: 40, step: 1, suffix: " yr" },
    ],
    compute: ({ initial, final, years }) => {
      const roi = ((final - initial) / initial) * 100;
      const cagr = (Math.pow(final / initial, 1 / years) - 1) * 100;
      return {
        primaryLabel: "ROI", primaryValue: roi, better: "higher",
        rows: [
          { label: "Gain", value: inr(final - initial) },
          { label: "ROI", value: pct(roi) },
          { label: "CAGR", value: pct(cagr) },
        ],
      };
    },
  },
  {
    id: "fv", title: "Future Value Calculator", desc: "Future value of a one-time investment", icon: TrendingUp,
    inputs: [
      { key: "p", label: "Investment", default: 100000, min: 100, max: 100000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Expected Return (p.a.)", default: 10, min: 1, max: 30, step: 0.1, suffix: "%" },
      { key: "years", label: "Time Period", default: 10, min: 1, max: 40, step: 1, suffix: " yr" },
    ],
    compute: ({ p, rate, years }) => {
      const fv = compoundFV(p, rate, years, 1);
      return {
        primaryLabel: "Future Value", primaryValue: fv, better: "higher",
        rows: [
          { label: "Invested", value: inr(p) },
          { label: "Gains", value: inr(fv - p) },
          { label: "Future Value", value: inr(fv) },
        ],
        donut: { a: p, b: fv - p, labelA: "Invested", labelB: "Gains", center: inr(fv) },
      };
    },
  },
  {
    id: "mf", title: "Mutual Fund Returns Calculator", desc: "Combined lumpsum + SIP returns", icon: PieChart,
    inputs: [
      { key: "lump", label: "Lumpsum", default: 100000, min: 0, max: 50000000, step: 1000, prefix: "₹" },
      { key: "m", label: "Monthly SIP", default: 5000, min: 0, max: 500000, step: 500, prefix: "₹" },
      { key: "rate", label: "Expected Return (p.a.)", default: 12, min: 1, max: 30, step: 0.1, suffix: "%" },
      { key: "years", label: "Time Period", default: 10, min: 1, max: 40, step: 1, suffix: " yr" },
    ],
    compute: ({ lump, m, rate, years }) => {
      const fv = compoundFV(lump, rate, years, 1) + sipFV(m, rate, years);
      const invested = lump + m * years * 12;
      return {
        primaryLabel: "Maturity", primaryValue: fv, better: "higher",
        rows: [
          { label: "Invested", value: inr(invested) },
          { label: "Est. Returns", value: inr(fv - invested) },
          { label: "Maturity", value: inr(fv) },
        ],
        donut: { a: invested, b: fv - invested, labelA: "Invested", labelB: "Returns", center: inr(fv) },
      };
    },
  },
  {
    id: "apy", title: "Atal Pension Yojana Calculator", desc: "Projected APY corpus & monthly pension", icon: HandCoins,
    inputs: [
      { key: "m", label: "Monthly Contribution", default: 500, min: 100, max: 5000, step: 50, prefix: "₹" },
      { key: "years", label: "Years till Age 60", default: 30, min: 5, max: 42, step: 1, suffix: " yr" },
      { key: "rate", label: "Expected Return (p.a.)", default: 8, min: 4, max: 12, step: 0.1, suffix: "%" },
    ],
    compute: ({ m, years, rate }) => {
      const corpus = sipFV(m, rate, years);
      const pension = (corpus * 0.08) / 12;
      return {
        primaryLabel: "Monthly Pension", primaryValue: pension, better: "higher",
        rows: [
          { label: "Contributed", value: inr(m * years * 12) },
          { label: "Corpus at 60", value: inr(corpus) },
          { label: "Monthly Pension", value: inr(pension) },
        ],
      };
    },
  },
  {
    id: "invest", title: "Investment Calculator", desc: "Generic investment growth projection", icon: BadgeIndianRupee,
    inputs: [
      { key: "p", label: "Initial Investment", default: 100000, min: 0, max: 100000000, step: 1000, prefix: "₹" },
      { key: "m", label: "Monthly Addition", default: 5000, min: 0, max: 500000, step: 500, prefix: "₹" },
      { key: "rate", label: "Expected Return (p.a.)", default: 10, min: 1, max: 30, step: 0.1, suffix: "%" },
      { key: "years", label: "Time Period", default: 10, min: 1, max: 40, step: 1, suffix: " yr" },
    ],
    compute: ({ p, m, rate, years }) => {
      const fv = compoundFV(p, rate, years, 12) + sipFV(m, rate, years);
      const invested = p + m * years * 12;
      return {
        primaryLabel: "Maturity", primaryValue: fv, better: "higher",
        rows: [
          { label: "Invested", value: inr(invested) },
          { label: "Gains", value: inr(fv - invested) },
          { label: "Maturity", value: inr(fv) },
        ],
        donut: { a: invested, b: fv - invested, labelA: "Invested", labelB: "Gains", center: inr(fv) },
      };
    },
  },
  {
    id: "swp", title: "SWP Calculator", desc: "Systematic withdrawal plan ending balance", icon: Banknote,
    inputs: [
      { key: "p", label: "Total Corpus", default: 1000000, min: 10000, max: 100000000, step: 10000, prefix: "₹" },
      { key: "w", label: "Monthly Withdrawal", default: 10000, min: 100, max: 1000000, step: 500, prefix: "₹" },
      { key: "rate", label: "Expected Return (p.a.)", default: 8, min: 1, max: 20, step: 0.1, suffix: "%" },
      { key: "years", label: "Time Period", default: 10, min: 1, max: 40, step: 1, suffix: " yr" },
    ],
    compute: ({ p, w, rate, years }) => {
      const i = rate / 12 / 100;
      let bal = p;
      const n = years * 12;
      for (let k = 0; k < n; k++) { bal = bal * (1 + i) - w; if (bal < 0) { bal = 0; break; } }
      const withdrawn = w * n;
      return {
        primaryLabel: "Ending Balance", primaryValue: bal, better: "higher",
        rows: [
          { label: "Total Withdrawn", value: inr(withdrawn) },
          { label: "Ending Balance", value: inr(bal) },
          { label: "Total Paid Out", value: inr(withdrawn + bal) },
        ],
      };
    },
  },
  {
    id: "cagr", title: "CAGR Calculator", desc: "Compound annual growth rate", icon: LineChart,
    inputs: [
      { key: "initial", label: "Initial Value", default: 100000, min: 1, max: 1000000000, step: 1000, prefix: "₹" },
      { key: "final", label: "Final Value", default: 200000, min: 1, max: 1000000000, step: 1000, prefix: "₹" },
      { key: "years", label: "Period", default: 5, min: 1, max: 40, step: 1, suffix: " yr" },
    ],
    compute: ({ initial, final, years }) => {
      const cagr = (Math.pow(final / initial, 1 / years) - 1) * 100;
      return {
        primaryLabel: "CAGR", primaryValue: cagr, better: "higher",
        rows: [
          { label: "Absolute Gain", value: inr(final - initial) },
          { label: "CAGR", value: pct(cagr) },
          { label: "Multiple", value: (final / initial).toFixed(2) + "x" },
        ],
      };
    },
  },
  {
    id: "gratuity", title: "Gratuity Calculator", desc: "Gratuity = (Salary × 15 × Years) / 26", icon: Receipt,
    inputs: [
      { key: "salary", label: "Last Drawn Monthly Salary (Basic+DA)", default: 50000, min: 5000, max: 1000000, step: 500, prefix: "₹" },
      { key: "years", label: "Years of Service", default: 10, min: 5, max: 40, step: 1, suffix: " yr" },
    ],
    compute: ({ salary, years }) => {
      const g = (salary * 15 * years) / 26;
      return {
        primaryLabel: "Gratuity", primaryValue: g, better: "higher",
        rows: [
          { label: "Monthly Salary", value: inr(salary) },
          { label: "Years of Service", value: `${years} yr` },
          { label: "Gratuity", value: inr(g) },
        ],
      };
    },
  },
  {
    id: "budget", title: "Budget Calculator", desc: "Monthly savings & savings rate", icon: Coins,
    inputs: [
      { key: "income", label: "Monthly Income", default: 80000, min: 0, max: 5000000, step: 1000, prefix: "₹" },
      { key: "needs", label: "Needs (rent, food, bills)", default: 35000, min: 0, max: 5000000, step: 500, prefix: "₹" },
      { key: "wants", label: "Wants (lifestyle)", default: 15000, min: 0, max: 5000000, step: 500, prefix: "₹" },
      { key: "emi", label: "Loan EMIs", default: 10000, min: 0, max: 5000000, step: 500, prefix: "₹" },
    ],
    compute: ({ income, needs, wants, emi }) => {
      const spend = needs + wants + emi;
      const savings = income - spend;
      const rate = income ? (savings / income) * 100 : 0;
      return {
        primaryLabel: "Monthly Savings", primaryValue: savings, better: "higher",
        rows: [
          { label: "Total Spend", value: inr(spend) },
          { label: "Monthly Savings", value: inr(savings) },
          { label: "Savings Rate", value: pct(rate) },
        ],
        donut: { a: spend, b: Math.max(savings, 0), labelA: "Spent", labelB: "Saved", center: inr(income) },
      };
    },
  },
  {
    id: "pension", title: "Pension Calculator", desc: "Retirement corpus & pension projection", icon: HandCoins,
    inputs: [
      { key: "m", label: "Monthly Contribution", default: 5000, min: 500, max: 500000, step: 500, prefix: "₹" },
      { key: "rate", label: "Pre-retirement Return (p.a.)", default: 10, min: 4, max: 20, step: 0.1, suffix: "%" },
      { key: "years", label: "Years till Retirement", default: 25, min: 1, max: 45, step: 1, suffix: " yr" },
      { key: "ann", label: "Annuity Rate (p.a.)", default: 6, min: 3, max: 10, step: 0.1, suffix: "%" },
    ],
    compute: ({ m, rate, years, ann }) => {
      const corpus = sipFV(m, rate, years);
      const pension = (corpus * ann) / 100 / 12;
      return {
        primaryLabel: "Monthly Pension", primaryValue: pension, better: "higher",
        rows: [
          { label: "Invested", value: inr(m * years * 12) },
          { label: "Corpus", value: inr(corpus) },
          { label: "Monthly Pension", value: inr(pension) },
        ],
      };
    },
  },
  {
    id: "nps", title: "NPS Calculator", desc: "60% lump + 40% annuity at retirement", icon: HandCoins,
    inputs: [
      { key: "m", label: "Monthly Contribution", default: 5000, min: 500, max: 500000, step: 500, prefix: "₹" },
      { key: "rate", label: "Expected Return (p.a.)", default: 10, min: 4, max: 18, step: 0.1, suffix: "%" },
      { key: "years", label: "Years till 60", default: 30, min: 1, max: 42, step: 1, suffix: " yr" },
      { key: "ann", label: "Annuity Rate (p.a.)", default: 6, min: 3, max: 10, step: 0.1, suffix: "%" },
    ],
    compute: ({ m, rate, years, ann }) => {
      const corpus = sipFV(m, rate, years);
      const lump = corpus * 0.6;
      const annuityCorpus = corpus * 0.4;
      const pension = (annuityCorpus * ann) / 100 / 12;
      return {
        primaryLabel: "Monthly Pension", primaryValue: pension, better: "higher",
        rows: [
          { label: "Total Corpus", value: inr(corpus) },
          { label: "Lumpsum (60%)", value: inr(lump) },
          { label: "Monthly Pension", value: inr(pension) },
        ],
        donut: { a: lump, b: annuityCorpus, labelA: "Lumpsum", labelB: "Annuity", center: inr(corpus) },
      };
    },
  },
  {
    id: "retirement", title: "Retirement Calculator", desc: "Corpus needed to retire comfortably", icon: PiggyBank,
    inputs: [
      { key: "expense", label: "Current Monthly Expense", default: 40000, min: 5000, max: 5000000, step: 1000, prefix: "₹" },
      { key: "yearsTo", label: "Years till Retirement", default: 25, min: 1, max: 45, step: 1, suffix: " yr" },
      { key: "yearsAfter", label: "Years in Retirement", default: 25, min: 5, max: 50, step: 1, suffix: " yr" },
      { key: "inflation", label: "Inflation (p.a.)", default: 6, min: 1, max: 12, step: 0.1, suffix: "%" },
    ],
    compute: ({ expense, yearsTo, yearsAfter, inflation }) => {
      const futureExpense = expense * Math.pow(1 + inflation / 100, yearsTo);
      const corpus = futureExpense * 12 * yearsAfter;
      return {
        primaryLabel: "Required Corpus", primaryValue: corpus, better: "lower",
        rows: [
          { label: "Future Expense (monthly)", value: inr(futureExpense) },
          { label: "Annual Expense at Retirement", value: inr(futureExpense * 12) },
          { label: "Required Corpus", value: inr(corpus) },
        ],
      };
    },
  },
  {
    id: "annuity", title: "Annuity Calculator", desc: "Monthly payout from a corpus", icon: Banknote,
    inputs: [
      { key: "p", label: "Corpus", default: 2000000, min: 10000, max: 1000000000, step: 10000, prefix: "₹" },
      { key: "rate", label: "Annuity Rate (p.a.)", default: 7, min: 3, max: 12, step: 0.1, suffix: "%" },
      { key: "years", label: "Payout Period", default: 20, min: 1, max: 40, step: 1, suffix: " yr" },
    ],
    compute: ({ p, rate, years }) => {
      const r = rate / 12 / 100;
      const n = years * 12;
      const pay = r === 0 ? p / n : (p * r) / (1 - Math.pow(1 + r, -n));
      return {
        primaryLabel: "Monthly Payout", primaryValue: pay, better: "higher",
        rows: [
          { label: "Monthly Payout", value: inr(pay) },
          { label: "Total Received", value: inr(pay * n) },
          { label: "Effective Gain", value: inr(pay * n - p) },
        ],
      };
    },
  },
];

/* ---------------- Categorized page ---------------- */

type CalcEntry =
  | { kind: "rich"; id: TabKey; label: string }
  | { kind: "simple"; id: string; label: string }
  | { kind: "emiPreset"; id: string; label: string; presetKey: string };

const categories: { id: string; label: string; items: CalcEntry[] }[] = [
  {
    id: "investment", label: "Investment Calculators",
    items: [
      { kind: "rich", id: "fd", label: "FD Calculator" },
      { kind: "simple", id: "fip", label: "FIP Calculator" },
      { kind: "simple", id: "nsc", label: "National Saving Calculator" },
      { kind: "simple", id: "ebitda", label: "EBITDA Calculator" },
      { kind: "simple", id: "savings", label: "Savings Calculator" },
      { kind: "rich", id: "lumpsum", label: "Lumpsum Calculator" },
      { kind: "simple", id: "elss", label: "ELSS Calculator" },
      { kind: "rich", id: "sip", label: "SIP Calculator" },
      { kind: "simple", id: "pofd", label: "Post Office FD Calculator" },
      { kind: "simple", id: "ssy", label: "Sukanya Samriddhi Yojana Calculator" },
      { kind: "simple", id: "ulip", label: "ULIP Calculator" },
      { kind: "simple", id: "apr", label: "APR Calculator" },
      { kind: "simple", id: "si", label: "Simple Interest Calculator" },
      { kind: "simple", id: "ci", label: "Compound Interest Calculator" },
      { kind: "simple", id: "loan-interest", label: "Loan Interest Calculator" },
      { kind: "simple", id: "roi", label: "ROI Calculator" },
      { kind: "simple", id: "fv", label: "Future Value Calculator" },
      { kind: "simple", id: "mf", label: "Mutual Fund Returns Calculator" },
      { kind: "simple", id: "apy", label: "Atal Pension Yojana Calculator" },
      { kind: "simple", id: "invest", label: "Investment Calculator" },
      { kind: "simple", id: "swp", label: "SWP Calculator" },
      { kind: "simple", id: "cagr", label: "CAGR Calculator" },
      { kind: "simple", id: "gratuity", label: "Gratuity Calculator" },
      { kind: "simple", id: "budget", label: "Budget Calculator" },
      { kind: "simple", id: "pension", label: "Pension Calculator" },
      { kind: "simple", id: "nps", label: "NPS Calculator" },
      { kind: "simple", id: "retirement", label: "Retirement Calculator" },
      { kind: "simple", id: "annuity", label: "Annuity Calculator" },
    ],
  },
  {
    id: "loan", label: "Loan EMI Calculators",
    items: [
      { kind: "rich", id: "emi", label: "EMI Calculator" },
      { kind: "emiPreset", id: "emi-personal", label: "Personal Loan EMI", presetKey: "personal" },
      { kind: "emiPreset", id: "emi-home", label: "Home Loan EMI", presetKey: "home" },
      { kind: "emiPreset", id: "emi-business", label: "Business Loan EMI", presetKey: "business" },
      { kind: "emiPreset", id: "emi-car", label: "Car Loan EMI", presetKey: "car" },
      { kind: "emiPreset", id: "emi-education", label: "Education Loan EMI", presetKey: "education" },
      { kind: "emiPreset", id: "emi-lap", label: "Loan Against Property EMI", presetKey: "property" },
    ],
  },
  {
    id: "other", label: "Other Calculators",
    items: [
      { kind: "simple", id: "gratuity", label: "Gratuity Calculator" },
      { kind: "simple", id: "budget", label: "Budget Calculator" },
      { kind: "simple", id: "retirement", label: "Retirement Calculator" },
      { kind: "simple", id: "annuity", label: "Annuity Calculator" },
      { kind: "simple", id: "cagr", label: "CAGR Calculator" },
      { kind: "simple", id: "roi", label: "ROI Calculator" },
      { kind: "simple", id: "ebitda", label: "EBITDA Calculator" },
    ],
  },
];

function getSimple(id: string) {
  return simpleCalcs.find((c) => c.id === id);
}

function CalculatorsPage() {
  const { t } = useI18n();
  const [catId, setCatId] = useState(categories[0].id);
  const [calcKey, setCalcKey] = useState("emi"); // entry id from above lists
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [query, setQuery] = useState("");

  const cat = categories.find((c) => c.id === catId)!;
  const entry = cat.items.find((i) => i.id === calcKey) ?? cat.items[0];

  // when switching category, default to first item
  useEffect(() => { setCalcKey(cat.items[0].id); }, [catId, cat.items]);

  const q = query.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!q) return [];
    const out: { catId: string; catLabel: string; item: CalcEntry }[] = [];
    const seen = new Set<string>();
    for (const c of categories) {
      for (const i of c.items) {
        const k = `${c.id}:${i.id}`;
        if (seen.has(k)) continue;
        if (i.label.toLowerCase().includes(q)) {
          seen.add(k);
          out.push({ catId: c.id, catLabel: c.label, item: i });
        }
      }
    }
    return out;
  }, [q]);

  const selectResult = (r: { catId: string; item: CalcEntry }) => {
    setCatId(r.catId);
    // setCalcKey runs after effect that resets calcKey on catId change, so defer
    setTimeout(() => setCalcKey(r.item.id), 0);
    setQuery("");
  };

  const handleSave: SaveFn = (data) => {
    setScenarios((prev) => {
      const sameKind = prev.filter((s) => s.kind === data.kind);
      const id = `${data.kind}-${Date.now()}`;
      const name = `Scenario ${sameKind.length + 1}`;
      return [...prev, { ...data, id, name }];
    });
  };
  const handleRemove = (id: string) => setScenarios((p) => p.filter((s) => s.id !== id));
  const handleClear = () => setScenarios([]);
  const handleRename = (id: string, name: string) =>
    setScenarios((p) => p.map((s) => (s.id === id ? { ...s, name } : s)));

  const richKey: TabKey | null =
    entry.kind === "rich" ? entry.id
    : entry.kind === "emiPreset" ? "emi"
    : null;
  const tabScenarios = richKey ? scenarios.filter((s) => s.kind === richKey) : [];

  return (
    <SiteLayout>
      <PageHeader eyebrow={t("calc.header.eyebrow")} title={t("calc.header.title")} subtitle={t("calc.header.subtitle")} />
      <section className="container-x py-12">
        {/* Search bar */}
        <div className="mb-6 relative max-w-xl">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("calc.search")}
            className="w-full border border-input rounded-md pl-9 pr-9 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {q && (
            <div className="absolute z-20 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-80 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="px-3 py-3 text-sm text-muted-foreground">{t("calc.noResults")}</div>
              ) : (
                searchResults.map((r, idx) => (
                  <button
                    key={`${r.catId}-${r.item.id}-${idx}`}
                    onClick={() => selectResult(r)}
                    className="w-full text-left px-3 py-2 hover:bg-secondary flex justify-between items-center gap-3"
                  >
                    <span className="text-sm text-foreground">{r.item.label}</span>
                    <span className="text-xs text-muted-foreground">{r.catLabel}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Mobile category + calc dropdowns */}
        <div className="md:hidden mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select value={catId} onChange={(e) => setCatId(e.target.value)} className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <select value={calcKey} onChange={(e) => setCalcKey(e.target.value)} className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background">
            {cat.items.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
          </select>
        </div>

        <div className="grid md:grid-cols-[180px_minmax(0,220px)_1fr] gap-4 md:gap-6">
          {/* Categories sidebar */}
          <aside className="hidden md:block">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {categories.map((c) => {
                const active = c.id === catId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCatId(c.id)}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold border-l-4 transition ${
                      active
                        ? "border-[var(--brand-yellow)] bg-[var(--brand-yellow-soft)] text-[var(--brand-black)]"
                        : "border-transparent text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Calculator list */}
          <aside className="hidden md:block">
            <div className="bg-card rounded-lg border border-border p-2 max-h-[640px] overflow-y-auto">
              {cat.items.map((i) => {
                const active = i.id === calcKey;
                return (
                  <button
                    key={i.id}
                    onClick={() => setCalcKey(i.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                      active
                        ? "bg-[var(--brand-black)] text-[var(--brand-yellow)] font-semibold"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {i.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Calculator panel */}
          <div className="min-w-0">
            {entry.kind === "rich" && entry.id === "emi" && <EMICalculator onSave={handleSave} />}
            {entry.kind === "rich" && entry.id === "sip" && <SIPCalculator onSave={handleSave} />}
            {entry.kind === "rich" && entry.id === "lumpsum" && <LumpsumCalculator onSave={handleSave} />}
            {entry.kind === "rich" && entry.id === "fd" && <FDCalculator onSave={handleSave} />}
            {entry.kind === "emiPreset" && <EMICalculator key={entry.presetKey} initialPresetKey={entry.presetKey} onSave={handleSave} />}
            {entry.kind === "simple" && (() => {
              const def = getSimple(entry.id);
              return def ? <SimpleCalc key={def.id} def={def} /> : null;
            })()}

            {richKey && (
              <ComparePanel
                scenarios={tabScenarios}
                onRemove={handleRemove}
                onClear={handleClear}
                onRename={handleRename}
              />
            )}

            <p className="text-xs text-muted-foreground mt-6">{t("calc.disclaimer")}</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}