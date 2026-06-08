import {
  Smartphone, Volume2, QrCode, CreditCard,
  Printer, ScanLine, Receipt, Tag, Archive, FileText, Boxes,
  Fingerprint, UserCheck, ScanFace, ShieldCheck, IdCard, Users,
  Landmark, Banknote, Building2, HandCoins, Wallet, PiggyBank,
  Camera, Video, MonitorPlay, HardDrive, DoorOpen, KeyRound,
  Laptop, Monitor, Projector, Wifi, Network, BatteryCharging,
  Scroll, Sticker, Droplets, Container, Package, PenTool,
  type LucideIcon,
} from "lucide-react";

export type Product = {
  slug: string;
  name: string;
  icon: LucideIcon;
  description: string;
  features: string[];
  useCases: string[];
  specs: string[];
};

export type SubCategory = { name: string; items: Product[] };
export type Category = {
  id: string;
  title: string;
  tagline: string;
  subs: SubCategory[];
};

const p = (
  slug: string, name: string, icon: LucideIcon,
  description: string, features: string[], useCases: string[], specs: string[],
): Product => ({ slug, name, icon, description, features, useCases, specs });

const PRICING = "Contact sales for pricing & bulk pricing";

export const categories: Category[] = [
  {
    id: "payment-merchant",
    title: "Payment & Merchant Solutions",
    tagline: "Accept payments anywhere — in-store, on the counter, on the go.",
    subs: [
      { name: "POS Machines", items: [
        p("android-pos", "Android POS", Smartphone,
          "All-in-one Android-powered POS terminal that accepts cards, UPI, QR and wallets with a built-in printer.",
          ["Android OS with touchscreen", "Built-in thermal printer", "Accepts card, UPI, QR & wallets", "4G + Wi-Fi connectivity", "Long-life rechargeable battery"],
          ["Retail counters & quick-service restaurants", "Field collection agents", "Pop-up stores & exhibitions"],
          ["Display: 5\"–6\" HD touchscreen", "Connectivity: 4G / Wi-Fi / Bluetooth", "Printer: 58 mm thermal", PRICING]),
        p("wireless-pos", "Wireless POS", Wifi,
          "Portable wireless card-payment terminal with SIM and Wi-Fi for payments anywhere on the move.",
          ["Compact handheld design", "SIM + Wi-Fi connectivity", "EMV chip, magstripe & contactless", "Up to 12-hour battery", "Built-in printer"],
          ["Home delivery & field sales", "Restaurants with table-side payments", "On-site service businesses"],
          ["Battery: 2000–2500 mAh", "Printer: 58 mm thermal", "PCI-PTS certified", PRICING]),
        p("countertop-pos", "Countertop POS", CreditCard,
          "Reliable wired countertop terminal for high-volume billing counters.",
          ["Wired Ethernet + dial-up backup", "Accepts all card networks", "Fast transaction speed", "Durable for heavy daily use"],
          ["Supermarkets & retail chains", "Pharmacies & clinics", "Hotel front desks"],
          ["Connectivity: Ethernet / PSTN", "Display: backlit monochrome / colour", PRICING]),
        p("smart-pos", "Smart POS", Smartphone,
          "Next-gen Android Smart POS with app ecosystem for billing, inventory and loyalty in one device.",
          ["Android OS with Play apps", "Integrated billing & inventory", "Loyalty & CRM ready", "Multi-payment acceptance"],
          ["Modern retail & QSR chains", "Salons & wellness studios", "Specialty stores"],
          ["RAM: 2–4 GB / Storage: 16–32 GB", "Camera: dual scanner-grade", PRICING]),
      ]},
      { name: "Soundbox Devices", items: [
        p("wifi-soundbox", "Wi-Fi Soundbox", Volume2,
          "Audio confirmation device that announces every UPI/QR payment over Wi-Fi.",
          ["Real-time voice payment alerts", "Multi-language support", "Wi-Fi connectivity", "Loud, clear speaker"],
          ["Retail counters with Wi-Fi", "Cafés & food courts", "Service centres"],
          ["Connectivity: Wi-Fi 2.4 GHz", "Battery: rechargeable Li-ion", PRICING]),
        p("sim-soundbox", "SIM-based Soundbox", Volume2,
          "4G SIM-powered soundbox that confirms payments even where Wi-Fi is unreliable.",
          ["4G SIM connectivity", "Multi-language voice alerts", "Long battery life", "Plug-and-play setup"],
          ["Street vendors & kirana stores", "Mobile carts & kiosks", "Rural merchants"],
          ["SIM: nano-SIM 4G", "Battery: 1500–2000 mAh", PRICING]),
      ]},
      { name: "QR Payment Solutions", items: [
        p("static-qr", "Static QR", QrCode,
          "Printed/laminated UPI QR code accepted across all UPI apps.",
          ["Universal UPI acceptance", "Zero hardware required", "Tamper-evident lamination", "Free settlements"],
          ["Small shops & vendors", "Parking & toll counters", "Donation & ticket booths"],
          ["Format: PVC / acrylic stand", PRICING]),
        p("dynamic-qr", "Dynamic QR", QrCode,
          "Bill-amount QR generated per transaction for error-free, faster checkout.",
          ["Amount auto-pushed to UPI app", "Per-bill audit trail", "Integrates with POS / billing software"],
          ["Pharmacies & supermarkets", "Restaurants with billing systems", "Service businesses"],
          ["Integration: API / SDK / POS", PRICING]),
        p("table-qr", "Table QR", QrCode,
          "Per-table QR for self-order and contactless payment in restaurants.",
          ["Table-level identification", "Menu + ordering option", "Reduces wait staff load"],
          ["Restaurants & cafés", "Bars & lounges", "Food courts"],
          ["Material: acrylic table stand", PRICING]),
        p("counter-qr", "Counter QR", QrCode,
          "Premium counter-top QR stand for high-visibility, branded payment acceptance.",
          ["Sturdy weighted stand", "Branding options", "Works with all UPI apps"],
          ["Retail billing counters", "Reception desks", "Showrooms"],
          ["Material: acrylic / metal", PRICING]),
      ]},
      { name: "Payment Acceptance Devices", items: [
        p("card-reader", "Card Readers", CreditCard,
          "Compact mPOS card reader that pairs with your phone to accept card payments.",
          ["Bluetooth pairing with app", "Chip, magstripe & contactless", "PCI-certified security", "Pocket-size form factor"],
          ["Field sales & delivery", "Small merchants starting card acceptance", "Events & exhibitions"],
          ["Connectivity: Bluetooth 4.0+", "Battery: rechargeable", PRICING]),
        p("nfc-payment", "NFC Payment Devices", CreditCard,
          "Dedicated NFC reader for tap-and-pay cards and mobile wallets.",
          ["NFC tap-to-pay", "Supports cards, wallets, wearables", "Fast transaction confirmation"],
          ["Transit & parking", "Quick-service counters", "Vending operators"],
          ["Standards: ISO 14443 A/B, NFC", PRICING]),
        p("tap-to-pay", "Tap-to-Pay Devices", CreditCard,
          "Modern tap-to-pay terminal with no PIN entry up to RBI contactless limit.",
          ["Contactless first", "Fast checkout flow", "PCI compliant", "Battery operated"],
          ["Modern retail", "Cafés & QSR", "Service businesses"],
          ["Battery: rechargeable", PRICING]),
      ]},
    ],
  },
  {
    id: "retail-billing",
    title: "Retail & Billing Solutions",
    tagline: "Complete billing & inventory toolkit for modern retail.",
    subs: [
      { name: "Android Billing Machines", items: [
        p("android-billing-machine", "Android Billing Machine", Smartphone,
          "All-in-one Android billing device with built-in printer, scanner and payments.",
          ["Android OS with billing apps", "Built-in thermal printer", "Barcode scanner option", "Accepts UPI, card & cash"],
          ["Kirana & grocery stores", "Pharmacies", "Quick-service restaurants"],
          ["Display: HD touchscreen", "Printer: 58 mm thermal", PRICING]),
      ]},
      { name: "Barcode Scanners", items: [
        p("barcode-scanner", "Barcode Scanner", ScanLine,
          "Fast 1D/2D barcode scanner for retail billing and inventory.",
          ["1D & 2D code support", "USB / Bluetooth options", "Reads from screens & paper", "Rugged drop-resistant body"],
          ["Retail counters", "Warehouses & stockrooms", "Logistics & dispatch"],
          ["Interface: USB / Bluetooth", "Decode: Code 128, QR, PDF417", PRICING]),
      ]},
      { name: "Receipt Printers", items: [
        p("receipt-printer", "Receipt Printer", Receipt,
          "High-speed thermal receipt printer for quick billing.",
          ["Up to 250 mm/s print speed", "Auto-cutter option", "USB + LAN + Bluetooth", "Easy paper-roll loading"],
          ["Retail POS counters", "Restaurants & cafés", "Hospitality front desks"],
          ["Paper width: 58 / 80 mm", "Interfaces: USB / LAN / BT", PRICING]),
      ]},
      { name: "Label Printers", items: [
        p("label-printer", "Label Printer", Tag,
          "Thermal label printer for barcodes, price tags and shipping labels.",
          ["Direct & transfer thermal", "Multi-size label support", "USB / LAN connectivity", "Compatible with billing software"],
          ["Supermarkets", "E-commerce fulfilment", "Warehouses"],
          ["Print width: up to 4\"", "Resolution: 203 dpi", PRICING]),
      ]},
      { name: "Cash Drawers", items: [
        p("cash-drawer", "Cash Drawer", Archive,
          "Heavy-duty cash drawer that opens via printer or manual key.",
          ["RJ11 printer trigger", "Lockable with key", "Multi-coin & note slots", "Durable metal build"],
          ["Retail billing counters", "Hospitality", "Pharmacies"],
          ["Compartments: 5 notes + 8 coins", PRICING]),
      ]},
      { name: "Billing Software", items: [
        p("billing-software", "Billing Software", FileText,
          "GST-ready billing & inventory software for retail and services.",
          ["GST invoicing & reports", "Inventory & stock alerts", "Multi-user & multi-outlet", "Customer & loyalty management"],
          ["Retail chains", "Restaurants", "Service businesses"],
          ["Platform: Windows / Android / Cloud", PRICING]),
      ]},
      { name: "Inventory Management Devices", items: [
        p("inventory-device", "Inventory Device", Boxes,
          "Handheld terminal for stock counting, receiving and audits.",
          ["Built-in barcode scanner", "Wi-Fi / 4G sync", "Rugged industrial design", "Works with major ERP/billing apps"],
          ["Warehouses & distribution", "Retail back-office", "Logistics"],
          ["OS: Android", "Battery: hot-swappable option", PRICING]),
      ]},
    ],
  },
  {
    id: "biometric-kyc",
    title: "Biometric & KYC Solutions",
    tagline: "Trusted identity verification for compliant onboarding.",
    subs: [
      { name: "Fingerprint Scanners", items: [
        p("fingerprint-scanner", "Fingerprint Scanner", Fingerprint,
          "STQC-certified fingerprint scanner for Aadhaar & enterprise auth.",
          ["STQC / UIDAI certified", "USB plug-and-play", "Fast 500 dpi capture", "Anti-spoof detection"],
          ["Banking eKYC", "Government schemes", "Attendance systems"],
          ["Resolution: 500 dpi", "Interface: USB 2.0", PRICING]),
      ]},
      { name: "Biometric Attendance Machines", items: [
        p("attendance-machine", "Attendance Machine", UserCheck,
          "Fingerprint + RFID attendance machine with cloud reports.",
          ["Fingerprint + RFID + PIN", "Wi-Fi / LAN connectivity", "Cloud attendance dashboard", "Payroll-ready exports"],
          ["Offices & factories", "Schools & coaching", "Retail chains"],
          ["Users: up to 1000", "Logs: up to 100k", PRICING]),
      ]},
      { name: "Face Recognition Systems", items: [
        p("face-recognition", "Face Recognition", ScanFace,
          "Contactless face-recognition terminal for attendance & access.",
          ["AI face matching", "Mask detection", "Temperature sensor option", "Cloud + on-device modes"],
          ["Offices & co-working", "Factories & warehouses", "Gated communities"],
          ["Database: 10k+ faces", "Recognition: <0.5 s", PRICING]),
      ]},
      { name: "Aadhaar Authentication Devices", items: [
        p("aadhaar-auth", "Aadhaar Auth Device", ShieldCheck,
          "UIDAI-registered device for Aadhaar-based authentication.",
          ["UIDAI registered device (RD)", "Encrypted biometric capture", "USB & Android support", "Tamper-resistant firmware"],
          ["Banking correspondents", "PDS & subsidy delivery", "Government services"],
          ["Standards: UIDAI L0/L1", PRICING]),
      ]},
      { name: "eKYC Devices", items: [
        p("ekyc-device", "eKYC Device", IdCard,
          "Integrated eKYC tablet kit for paperless customer onboarding.",
          ["Aadhaar + PAN + face capture", "Digital signature pad option", "4G / Wi-Fi connectivity", "API integration"],
          ["NBFCs & lenders", "Telecom onboarding", "Insurance & fintech"],
          ["Display: 8–10\" tablet", PRICING]),
      ]},
      { name: "Customer Verification Devices", items: [
        p("customer-verification", "Customer Verification", Users,
          "Multi-modal verification kit combining face, fingerprint and document scan.",
          ["Face + fingerprint + OCR", "PAN / DL / passport OCR", "Liveness detection", "Encrypted audit trail"],
          ["Banks & NBFCs", "Hotels & hospitality", "Co-working & access control"],
          ["Modes: face / FP / document", PRICING]),
      ]},
    ],
  },
  {
    id: "banking-fintech",
    title: "Banking & Fintech Devices",
    tagline: "Bring banking services to every doorstep.",
    subs: [
      { name: "Micro ATM Devices", items: [
        p("micro-atm", "Micro ATM", Landmark,
          "Handheld Micro ATM for cash withdrawal, balance enquiry & mini statement.",
          ["Card + biometric auth", "Withdrawal, balance, mini statement", "Built-in printer", "4G connectivity"],
          ["Banking correspondents", "Rural BC outlets", "Retail kirana banking"],
          ["Printer: 58 mm thermal", "Battery: rechargeable", PRICING]),
      ]},
      { name: "AePS Machines", items: [
        p("aeps-machine", "AePS Machine", Banknote,
          "Aadhaar-Enabled Payment System device for biometric banking.",
          ["Aadhaar biometric auth", "Withdraw / deposit / balance", "Multi-bank support", "Real-time settlement"],
          ["Banking correspondents", "Rural last-mile banking", "Fintech agents"],
          ["Biometric: UIDAI RD", PRICING]),
      ]},
      { name: "Banking Kiosks", items: [
        p("banking-kiosk", "Banking Kiosk", Building2,
          "Self-service banking kiosk for branch and BC outlets.",
          ["Touchscreen self-service", "Card + biometric auth", "Receipt printer", "Remote management"],
          ["Bank branches", "BC outlets", "Public-sector service points"],
          ["Display: 15–21\" touchscreen", PRICING]),
      ]},
      { name: "CSP Devices", items: [
        p("csp-device", "CSP Device", HandCoins,
          "Customer Service Point device kit for banking correspondents.",
          ["Laptop / tablet + biometric + printer", "Multi-bank software", "4G & Wi-Fi ready"],
          ["Banking correspondents", "Common service centres", "Rural fintech agents"],
          ["Kit: device + RD + printer", PRICING]),
      ]},
      { name: "Merchant Collection Devices", items: [
        p("merchant-collection", "Merchant Collection", Wallet,
          "All-in-one collection device for EMI, bill and field cash collection.",
          ["Cash + UPI + card collection", "Receipts on the spot", "Real-time backend sync"],
          ["NBFC & MFI field collection", "Utility billers", "Society/society dues"],
          ["Printer: built-in thermal", PRICING]),
      ]},
      { name: "Financial Inclusion Devices", items: [
        p("financial-inclusion", "Financial Inclusion", PiggyBank,
          "Rugged device kit for last-mile financial inclusion programs.",
          ["Biometric + card auth", "Multi-language UI", "Offline-tolerant sync", "Long battery life"],
          ["Government schemes", "Rural BC network", "NGO field programs"],
          ["Battery: extended", PRICING]),
      ]},
    ],
  },
  {
    id: "security-surveillance",
    title: "Security & Surveillance",
    tagline: "Keep your premises safe, 24/7.",
    subs: [
      { name: "CCTV Cameras", items: [
        p("cctv-camera", "CCTV Camera", Camera,
          "HD/4K CCTV camera with night vision for indoor and outdoor use.",
          ["2 MP / 4 MP / 4K options", "IR night vision up to 30 m", "IP66 weatherproof", "Motion detection alerts"],
          ["Retail stores", "Offices & factories", "Homes & societies"],
          ["Sensor: CMOS", "Lens: 2.8 / 3.6 mm", PRICING]),
      ]},
      { name: "CCTV Kits", items: [
        p("cctv-kit", "CCTV Kit", Video,
          "Pre-bundled CCTV kit with cameras, DVR/NVR, cables and power supply.",
          ["4 / 8 / 16 channel kits", "Includes HDD option", "Mobile app remote viewing", "Plug-and-play installation"],
          ["Small businesses", "Homes & villas", "Warehouses"],
          ["Channels: 4 / 8 / 16", PRICING]),
      ]},
      { name: "NVR Systems", items: [
        p("nvr-system", "NVR System", MonitorPlay,
          "Network Video Recorder for IP cameras with high-resolution recording.",
          ["Up to 4K recording", "PoE channel options", "Mobile + web access", "Multiple HDD bays"],
          ["Enterprise surveillance", "Multi-site retail", "Industrial campuses"],
          ["Channels: 8 / 16 / 32", PRICING]),
      ]},
      { name: "DVR Systems", items: [
        p("dvr-system", "DVR System", HardDrive,
          "Digital Video Recorder for analog/HDCVI cameras with cloud playback.",
          ["Hybrid analog + IP inputs", "Cloud P2P access", "Motion-based recording", "Mobile alerts"],
          ["Retail chains", "Offices", "Residential security"],
          ["Channels: 4 / 8 / 16", PRICING]),
      ]},
      { name: "Video Door Phones", items: [
        p("video-door-phone", "Video Door Phone", DoorOpen,
          "Wired/wireless video door phone for secure visitor verification.",
          ["HD video & two-way audio", "Remote door unlock", "Night vision", "Mobile app option"],
          ["Homes & apartments", "Offices", "Clinics"],
          ["Display: 7\" colour", PRICING]),
      ]},
      { name: "Access Control Systems", items: [
        p("access-control", "Access Control", KeyRound,
          "Card/biometric access control for doors and turnstiles.",
          ["RFID + biometric", "Time-zone access rules", "Audit logs & reports", "Integrates with attendance"],
          ["Offices & data centres", "Hotels", "Industrial sites"],
          ["Users: 1k–10k", PRICING]),
      ]},
    ],
  },
  {
    id: "office-infrastructure",
    title: "Office Infrastructure",
    tagline: "Everything your workspace needs to run smoothly.",
    subs: [
      { name: "Laptops", items: [
        p("laptop", "Laptop", Laptop,
          "Business laptops configured for productivity, design or development.",
          ["Intel / AMD configurations", "SSD storage", "Business warranty options", "Bulk imaging support"],
          ["Corporate fleets", "Startups & SMBs", "Hybrid teams"],
          ["RAM: 8–32 GB", "Storage: 256 GB–1 TB SSD", PRICING]),
      ]},
      { name: "Printers", items: [
        p("printer", "Printer", Printer,
          "Mono / colour laser & inkjet printers for office use.",
          ["Mono & colour options", "Network + Wi-Fi printing", "Duplex printing", "Low cost per page"],
          ["Offices", "Schools & coaching", "Retail back-office"],
          ["Speed: 20–40 ppm", PRICING]),
      ]},
      { name: "Monitors", items: [
        p("monitor", "Monitor", Monitor,
          "FHD/QHD/4K monitors for productivity, design and meeting rooms.",
          ["IPS panels", "HDMI + DisplayPort", "VESA mount ready", "Eye-care modes"],
          ["Office workstations", "Design studios", "Trading desks"],
          ["Size: 22\"–32\"", PRICING]),
      ]},
      { name: "Projectors", items: [
        p("projector", "Projector", Projector,
          "Bright HD/4K projectors for boardrooms and training halls.",
          ["3000–5000 lumens", "HDMI + wireless options", "Long-life lamp/LED", "Ceiling-mount ready"],
          ["Boardrooms", "Training rooms", "Auditoriums"],
          ["Resolution: HD / FHD / 4K", PRICING]),
      ]},
      { name: "Wi-Fi Routers", items: [
        p("wifi-router", "Wi-Fi Router", Wifi,
          "Dual-band / Wi-Fi 6 routers for office and branch connectivity.",
          ["Dual-band & Wi-Fi 6", "Guest network & VLAN", "VPN support", "Cloud management option"],
          ["Branch offices", "Co-working spaces", "Retail stores"],
          ["Standards: 802.11ac / ax", PRICING]),
      ]},
      { name: "Networking Equipment", items: [
        p("networking-equipment", "Networking Equipment", Network,
          "Switches, access points and network appliances for offices.",
          ["Managed & unmanaged switches", "PoE access points", "Firewall / UTM options", "Cabling & rack accessories"],
          ["Office LAN", "Multi-floor branches", "Warehouses"],
          ["Ports: 8 / 16 / 24 / 48", PRICING]),
      ]},
      { name: "UPS Systems", items: [
        p("ups-system", "UPS System", BatteryCharging,
          "Online / line-interactive UPS for uninterrupted business power.",
          ["600 VA – 10 kVA", "Pure sine-wave output", "Smart battery management", "Remote monitoring option"],
          ["Workstations", "Server rooms", "POS counters"],
          ["Topology: line-interactive / online", PRICING]),
      ]},
    ],
  },
  {
    id: "business-consumables",
    title: "Business Consumables",
    tagline: "Daily essentials, delivered on time.",
    subs: [
      { name: "Thermal Paper Rolls", items: [
        p("thermal-paper", "Thermal Paper Roll", Scroll,
          "High-quality thermal paper rolls for POS and billing printers.",
          ["BPA-free options", "55–80 gsm grades", "Long-life print", "Bulk packs available"],
          ["Retail POS", "Restaurants", "Banking & ATMs"],
          ["Sizes: 58 mm / 80 mm", PRICING]),
      ]},
      { name: "Barcode Labels", items: [
        p("barcode-label", "Barcode Label", Sticker,
          "Direct thermal & thermal-transfer labels for retail and logistics.",
          ["Multi-size rolls", "Smudge-resistant", "Adhesive variants", "Custom printing option"],
          ["Retail price tagging", "Warehouse SKUs", "Shipping labels"],
          ["Materials: paper / synthetic", PRICING]),
      ]},
      { name: "Printer Ink", items: [
        p("printer-ink", "Printer Ink", Droplets,
          "Genuine and compatible ink cartridges for office inkjet printers.",
          ["OEM & compatible options", "Pigment & dye variants", "Bulk packs available"],
          ["Office printing", "Photo & design studios"],
          ["Models: all major brands", PRICING]),
      ]},
      { name: "Printer Toners", items: [
        p("printer-toner", "Printer Toner", Container,
          "Original & compatible toner cartridges for laser printers.",
          ["High-yield options", "OEM & compatible", "Mono & colour variants"],
          ["Offices", "Print shops"],
          ["Models: all major brands", PRICING]),
      ]},
      { name: "Packaging Materials", items: [
        p("packaging", "Packaging Material", Package,
          "Corrugated boxes, mailers, tapes and fillers for e-commerce dispatch.",
          ["Multiple sizes & strengths", "Custom branding option", "Eco-friendly variants"],
          ["E-commerce sellers", "Warehouses", "D2C brands"],
          ["Types: boxes, mailers, tapes", PRICING]),
      ]},
      { name: "Office Stationery", items: [
        p("office-stationery", "Office Stationery", PenTool,
          "Daily office stationery from pens and files to whiteboards and notepads.",
          ["Curated office bundles", "Branded options", "Subscription replenishment"],
          ["Offices", "Schools & coaching", "Co-working spaces"],
          ["Categories: writing, filing, presentation", PRICING]),
      ]},
    ],
  },
];

export function findProduct(slug: string): { product: Product; category: Category; sub: SubCategory } | null {
  for (const c of categories) {
    for (const s of c.subs) {
      const found = s.items.find((i) => i.slug === slug);
      if (found) return { product: found, category: c, sub: s };
    }
  }
  return null;
}

export function allProducts(): { product: Product; category: Category }[] {
  const out: { product: Product; category: Category }[] = [];
  for (const c of categories) for (const s of c.subs) for (const i of s.items) out.push({ product: i, category: c });
  return out;
}