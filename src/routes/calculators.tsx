import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Calculator, PiggyBank, TrendingUp, Wallet, Home, Briefcase,
  GraduationCap, Car, Building2, Plus, X, Trash2, Trophy,
  Landmark, Coins, Receipt, BarChart3, LineChart, Percent,
  PieChart, BadgeIndianRupee, Banknote, HandCoins, Sigma,
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

function EMICalculator({ onSave }: { onSave: SaveFn }) {
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

const tabs: { key: TabKey; label: string; icon: typeof Calculator }[] = [
  { key: "emi", label: "Loan EMI", icon: Calculator },
  { key: "sip", label: "SIP", icon: TrendingUp },
  { key: "lumpsum", label: "Lumpsum", icon: Wallet },
  { key: "fd", label: "Fixed Deposit", icon: PiggyBank },
];

function CalculatorsPage() {
  const [tab, setTab] = useState<TabKey>("emi");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const tabScenarios = scenarios.filter((s) => s.kind === tab);

  const handleSave: SaveFn = (data) => {
    setScenarios((prev) => {
      const sameKind = prev.filter((s) => s.kind === data.kind);
      const id = `${data.kind}-${Date.now()}`;
      const name = `Scenario ${sameKind.length + 1}`;
      return [...prev, { ...data, id, name }];
    });
  };

  const handleRemove = (id: string) =>
    setScenarios((prev) => prev.filter((s) => s.id !== id));

  const handleClear = () =>
    setScenarios((prev) => prev.filter((s) => s.kind !== tab));

  const handleRename = (id: string, name: string) =>
    setScenarios((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));

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
          {tab === "emi" && <EMICalculator onSave={handleSave} />}
          {tab === "sip" && <SIPCalculator onSave={handleSave} />}
          {tab === "lumpsum" && <LumpsumCalculator onSave={handleSave} />}
          {tab === "fd" && <FDCalculator onSave={handleSave} />}
        </div>

        <div className="max-w-6xl mx-auto">
          <ComparePanel
            scenarios={tabScenarios}
            onRemove={handleRemove}
            onClear={handleClear}
            onRename={handleRename}
          />
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8 max-w-2xl mx-auto">
          Calculations are indicative and based on the inputs provided. Actual figures may vary by lender, taxes and market performance.
        </p>
      </section>
    </SiteLayout>
  );
}