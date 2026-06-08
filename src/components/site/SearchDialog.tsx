import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

type Entry = { label: string; category: string; to: string; hash?: string };

const INDEX: Entry[] = [
  // Loans
  ...["Personal Loan","Home Loan","Business Loan","Loans for Doctors","Loan Against Property","Loan for CAs","Commercial Lending","Medical Equipment Finance","Lease Rental Discounting","Loan Against Securities","Used Car Loan","Education Loan"]
    .map((l) => ({ label: l, category: "Loans", to: "/loans", hash: l.toLowerCase().replace(/\s+/g, "-") })),
  // Investments
  { label: "Fixed Deposits", category: "Investments", to: "/investments", hash: "fixed-deposits" },
  { label: "Bonds", category: "Investments", to: "/investments", hash: "bonds" },
  // Insurance
  { label: "Health Insurance", category: "Insurance", to: "/insurance", hash: "health-insurance" },
  { label: "Life Insurance", category: "Insurance", to: "/insurance", hash: "life-insurance" },
  { label: "Medical Claim", category: "Insurance", to: "/insurance", hash: "medical-claim" },
  // Calculators
  ...["EMI Calculator","SIP Calculator","Lumpsum Calculator","FD Calculator","Home Loan Calculator","Car Loan Calculator","Education Loan Calculator","Gold Calculator","Income Tax Calculator"]
    .map((l) => ({ label: l, category: "Calculators", to: "/calculators" })),
  // Store categories
  ...[
    ["Payment & Merchant Solutions","payment-merchant"],
    ["POS Machines","payment-merchant"],
    ["Soundbox Devices","payment-merchant"],
    ["QR Payment Solutions","payment-merchant"],
    ["Android POS","payment-merchant"],
    ["Wireless POS","payment-merchant"],
    ["Retail & Billing Solutions","retail-billing"],
    ["Billing Software","retail-billing"],
    ["Barcode Scanners","retail-billing"],
    ["Receipt Printers","retail-billing"],
    ["Cash Drawers","retail-billing"],
    ["Biometric & KYC Solutions","biometric-kyc"],
    ["Fingerprint Scanners","biometric-kyc"],
    ["Face Recognition Systems","biometric-kyc"],
    ["Aadhaar Authentication Devices","biometric-kyc"],
    ["eKYC Devices","biometric-kyc"],
    ["Banking & Fintech Devices","banking-fintech"],
    ["Micro ATM Devices","banking-fintech"],
    ["AePS Machines","banking-fintech"],
    ["Banking Kiosks","banking-fintech"],
    ["Security & Surveillance","security-surveillance"],
    ["CCTV Cameras","security-surveillance"],
    ["NVR Systems","security-surveillance"],
    ["DVR Systems","security-surveillance"],
    ["Video Door Phones","security-surveillance"],
    ["Access Control Systems","security-surveillance"],
    ["Office Infrastructure","office-infrastructure"],
    ["Laptops","office-infrastructure"],
    ["Printers","office-infrastructure"],
    ["Monitors","office-infrastructure"],
    ["WiFi Routers","office-infrastructure"],
    ["UPS Systems","office-infrastructure"],
    ["Business Consumables","business-consumables"],
    ["Thermal Paper Rolls","business-consumables"],
    ["Printer Ink","business-consumables"],
    ["Packaging Materials","business-consumables"],
    ["Office Stationery","business-consumables"],
  ].map(([label, hash]) => ({ label, category: "Store", to: "/store", hash })),
  // Pages
  { label: "About Us", category: "About", to: "/about", hash: "about-us" },
  { label: "Careers", category: "About", to: "/about", hash: "careers" },
  { label: "Reach Us", category: "About", to: "/about", hash: "reach-us" },
  { label: "Our Vision", category: "About", to: "/about", hash: "our-vision" },
];

function score(entry: Entry, q: string) {
  const l = entry.label.toLowerCase();
  if (l === q) return 100;
  if (l.startsWith(q)) return 80;
  if (l.includes(q)) return 60;
  if (entry.category.toLowerCase().includes(q)) return 30;
  return 0;
}

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => { if (!open) { setQ(""); setActive(0); } }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [] as Entry[];
    return INDEX
      .map((e) => ({ e, s: score(e, term) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((r) => r.e);
  }, [q]);

  function go(entry: Entry) {
    onOpenChange(false);
    navigate({
      to: entry.to,
      hash: entry.hash,
      resetScroll: !entry.hash,
    } as never);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-xl overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Search XCapital</DialogTitle>
          <DialogDescription>Search loans, investments, insurance, calculators and store products.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              else if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active]); }
            }}
            placeholder="Search loans, FDs, insurance, calculators, store…"
            aria-label="Search query"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">Esc</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2" role="listbox">
          {q.trim() === "" ? (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">
              Try "personal loan", "EMI", "POS", "health insurance"…
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">No results for "{q}".</p>
          ) : (
            results.map((r, i) => (
              <button
                key={`${r.to}-${r.hash ?? ""}-${r.label}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
                className={`w-full text-left flex items-center justify-between gap-3 px-4 py-2.5 text-sm ${
                  i === active ? "bg-[var(--brand-yellow-soft)] text-[var(--brand-black)]" : "hover:bg-muted"
                }`}
              >
                <span className="font-medium">{r.label}</span>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{r.category}</span>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}