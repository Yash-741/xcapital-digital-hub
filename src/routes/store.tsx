import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, Smartphone, Volume2, QrCode, CreditCard,
  Printer, ScanLine, Receipt, Tag, Archive, FileText, Boxes,
  Fingerprint, UserCheck, ScanFace, ShieldCheck, IdCard, Users,
  Landmark, Banknote, Building2, HandCoins, Wallet, PiggyBank,
  Camera, Video, MonitorPlay, HardDrive, DoorOpen, KeyRound,
  Laptop, Monitor, Projector, Wifi, Network, BatteryCharging,
  Scroll, Sticker, Droplets, Container, Package, PenTool,
  type LucideIcon,
} from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "X Capital Store — Smart Commerce & Fintech Solutions" },
      { name: "description", content: "Shop POS machines, soundboxes, QR & card payment devices, billing, biometric KYC, banking fintech devices, CCTV, office infrastructure and business consumables at X Capital Store." },
      { property: "og:title", content: "X Capital Store — Smart Commerce & Fintech Solutions" },
      { property: "og:description", content: "Empowering Businesses with Smart Commerce & Financial Technology Solutions." },
    ],
  }),
  component: StorePage,
});

type Item = { name: string; icon: LucideIcon };
type Sub = { name: string; items?: Item[] };
type Category = { id: string; title: string; tagline: string; subs: Sub[] };

const categories: Category[] = [
  {
    id: "payment-merchant",
    title: "Payment & Merchant Solutions",
    tagline: "Accept payments anywhere — in-store, on the counter, on the go.",
    subs: [
      { name: "POS Machines", items: [
        { name: "Android POS", icon: Smartphone },
        { name: "Wireless POS", icon: Wifi },
        { name: "Countertop POS", icon: CreditCard },
        { name: "Smart POS", icon: Smartphone },
      ]},
      { name: "Soundbox Devices", items: [
        { name: "WiFi Soundbox", icon: Volume2 },
        { name: "SIM-based Soundbox", icon: Volume2 },
      ]},
      { name: "QR Payment Solutions", items: [
        { name: "Static QR", icon: QrCode },
        { name: "Dynamic QR", icon: QrCode },
        { name: "Table QR", icon: QrCode },
        { name: "Counter QR", icon: QrCode },
      ]},
      { name: "Payment Acceptance Devices", items: [
        { name: "Card Readers", icon: CreditCard },
        { name: "NFC Payment Devices", icon: CreditCard },
        { name: "Tap-to-Pay Devices", icon: CreditCard },
      ]},
    ],
  },
  {
    id: "retail-billing",
    title: "Retail & Billing Solutions",
    tagline: "Complete billing & inventory toolkit for modern retail.",
    subs: [
      { name: "Android Billing Machines", items: [{ name: "Android Billing Machine", icon: Smartphone }] },
      { name: "Barcode Scanners", items: [{ name: "Barcode Scanner", icon: ScanLine }] },
      { name: "Receipt Printers", items: [{ name: "Receipt Printer", icon: Receipt }] },
      { name: "Label Printers", items: [{ name: "Label Printer", icon: Tag }] },
      { name: "Cash Drawers", items: [{ name: "Cash Drawer", icon: Archive }] },
      { name: "Billing Software", items: [{ name: "Billing Software", icon: FileText }] },
      { name: "Inventory Management Devices", items: [{ name: "Inventory Device", icon: Boxes }] },
    ],
  },
  {
    id: "biometric-kyc",
    title: "Biometric & KYC Solutions",
    tagline: "Trusted identity verification for compliant onboarding.",
    subs: [
      { name: "Fingerprint Scanners", items: [{ name: "Fingerprint Scanner", icon: Fingerprint }] },
      { name: "Biometric Attendance Machines", items: [{ name: "Attendance Machine", icon: UserCheck }] },
      { name: "Face Recognition Systems", items: [{ name: "Face Recognition", icon: ScanFace }] },
      { name: "Aadhaar Authentication Devices", items: [{ name: "Aadhaar Auth Device", icon: ShieldCheck }] },
      { name: "eKYC Devices", items: [{ name: "eKYC Device", icon: IdCard }] },
      { name: "Customer Verification Devices", items: [{ name: "Customer Verification", icon: Users }] },
    ],
  },
  {
    id: "banking-fintech",
    title: "Banking & Fintech Devices",
    tagline: "Bring banking services to every doorstep.",
    subs: [
      { name: "Micro ATM Devices", items: [{ name: "Micro ATM", icon: Landmark }] },
      { name: "AePS Machines", items: [{ name: "AePS Machine", icon: Banknote }] },
      { name: "Banking Kiosks", items: [{ name: "Banking Kiosk", icon: Building2 }] },
      { name: "CSP Devices", items: [{ name: "CSP Device", icon: HandCoins }] },
      { name: "Merchant Collection Devices", items: [{ name: "Merchant Collection", icon: Wallet }] },
      { name: "Financial Inclusion Devices", items: [{ name: "Financial Inclusion", icon: PiggyBank }] },
    ],
  },
  {
    id: "security-surveillance",
    title: "Security & Surveillance",
    tagline: "Keep your premises safe, 24/7.",
    subs: [
      { name: "CCTV Cameras", items: [{ name: "CCTV Camera", icon: Camera }] },
      { name: "CCTV Kits", items: [{ name: "CCTV Kit", icon: Video }] },
      { name: "NVR Systems", items: [{ name: "NVR System", icon: MonitorPlay }] },
      { name: "DVR Systems", items: [{ name: "DVR System", icon: HardDrive }] },
      { name: "Video Door Phones", items: [{ name: "Video Door Phone", icon: DoorOpen }] },
      { name: "Access Control Systems", items: [{ name: "Access Control", icon: KeyRound }] },
    ],
  },
  {
    id: "office-infrastructure",
    title: "Office Infrastructure",
    tagline: "Everything your workspace needs to run smoothly.",
    subs: [
      { name: "Laptops", items: [{ name: "Laptop", icon: Laptop }] },
      { name: "Printers", items: [{ name: "Printer", icon: Printer }] },
      { name: "Monitors", items: [{ name: "Monitor", icon: Monitor }] },
      { name: "Projectors", items: [{ name: "Projector", icon: Projector }] },
      { name: "WiFi Routers", items: [{ name: "WiFi Router", icon: Wifi }] },
      { name: "Networking Equipment", items: [{ name: "Networking Equipment", icon: Network }] },
      { name: "UPS Systems", items: [{ name: "UPS System", icon: BatteryCharging }] },
    ],
  },
  {
    id: "business-consumables",
    title: "Business Consumables",
    tagline: "Daily essentials, delivered on time.",
    subs: [
      { name: "Thermal Paper Rolls", items: [{ name: "Thermal Paper Roll", icon: Scroll }] },
      { name: "Barcode Labels", items: [{ name: "Barcode Label", icon: Sticker }] },
      { name: "Printer Ink", items: [{ name: "Printer Ink", icon: Droplets }] },
      { name: "Printer Toners", items: [{ name: "Printer Toner", icon: Container }] },
      { name: "Packaging Materials", items: [{ name: "Packaging Material", icon: Package }] },
      { name: "Office Stationery", items: [{ name: "Office Stationery", icon: PenTool }] },
    ],
  },
];

function StorePage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return categories;
    return categories
      .map((c) => ({
        ...c,
        subs: c.subs
          .map((s) => ({
            ...s,
            items: (s.items ?? []).filter(
              (i) => i.name.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
            ),
          }))
          .filter((s) => (s.items?.length ?? 0) > 0 || s.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)),
      }))
      .filter((c) => c.subs.length > 0 || c.title.toLowerCase().includes(q));
  }, [q]);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="X Capital Store"
        title="Smart Commerce & Financial Technology Solutions"
        subtitle="Empowering businesses with POS, payment, billing, biometric, banking, security, office and consumable solutions — all in one place."
      />

      <section className="container-x py-8">
        {/* Search */}
        <div className="relative max-w-xl mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products (e.g. POS, soundbox, CCTV)…"
            className="w-full rounded-md border border-border bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)]"
          />
        </div>

        {/* Category quick nav */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-border hover:bg-[var(--brand-yellow-soft)] hover:border-[var(--brand-yellow)] transition"
            >
              {c.title}
            </a>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">No products match your search.</p>
          )}
          {filtered.map((cat) => (
            <div key={cat.id} id={cat.id} className="scroll-mt-24">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-[var(--brand-black)]">{cat.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{cat.tagline}</p>
              </div>

              <div className="space-y-6">
                {cat.subs.map((sub) => (
                  <div key={sub.name} className="bg-white rounded-lg shadow-card border-b-[3px] border-[var(--brand-yellow)] p-5">
                    <h3 className="text-sm font-bold text-[var(--brand-black)] uppercase tracking-wide mb-4">{sub.name}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {(sub.items ?? []).map((it) => {
                        const Icon = it.icon;
                        return (
                          <div
                            key={it.name}
                            className="group flex flex-col items-center text-center p-3 rounded-md border border-transparent hover:border-[var(--brand-yellow)] hover:bg-[var(--brand-yellow-soft)] transition cursor-pointer"
                          >
                            <div className="h-12 w-12 grid place-items-center rounded-md bg-[var(--brand-yellow-soft)] text-[var(--brand-black)] group-hover:bg-white">
                              <Icon className="h-6 w-6" strokeWidth={1.5} />
                            </div>
                            <span className="mt-2 text-xs font-medium text-[var(--brand-black)] leading-tight">
                              {it.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-[var(--brand-black)] text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold">Need help choosing the right device?</h3>
            <p className="text-sm text-white/80 mt-1">Talk to our specialists for bulk orders, custom bundles and onboarding.</p>
          </div>
          <Link
            to="/about"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--brand-black)] bg-[var(--brand-yellow)] hover:brightness-105 transition"
          >
            Contact Sales
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}