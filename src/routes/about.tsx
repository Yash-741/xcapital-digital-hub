import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin, Phone, Mail, Briefcase, Search, FileCheck, Building2,
  FileText, CheckCircle2, RefreshCw, Clock, Users, Handshake,
  ShieldCheck, Sparkles, ChevronDown,
} from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About XCapital" },
      { name: "description", content: "Learn about XCapital — vision, contact and careers at India's trusted NBFC." },
      { property: "og:title", content: "About XCapital" },
      { property: "og:description", content: "About us, vision, contact and careers." },
    ],
  }),
  component: AboutPage,
});

const jobs = [
  { title: "Relationship Manager", location: "Mumbai", type: "Full-time" },
  { title: "Credit Risk Analyst", location: "Bengaluru", type: "Full-time" },
  { title: "Mobile App Engineer", location: "Remote (India)", type: "Full-time" },
];

const steps = [
  { icon: Search, title: "Understand Your Requirement", desc: "We start by understanding your financial requirement, business profile, banking profile and existing liabilities." },
  { icon: FileCheck, title: "Analyze Eligibility", desc: "Our team reviews your financial documents, credit profile, banking history and loan requirement." },
  { icon: Building2, title: "Identify Suitable Institutions", desc: "We compare banks, NBFCs and financial institutions to identify the most suitable option." },
  { icon: FileText, title: "Application & Documentation", desc: "We assist with documentation, application submission, follow-up and coordination." },
  { icon: CheckCircle2, title: "Approval & Disbursement", desc: "We coordinate with lenders until successful approval and disbursement." },
  { icon: RefreshCw, title: "Ongoing Relationship Support", desc: "Continued support for renewals, enhancements, additional facilities and treasury solutions." },
];

const whyChoose = [
  { icon: Building2, title: "Access to Multiple Institutions", desc: "Evaluate options across leading banks and NBFCs instead of approaching a single lender." },
  { icon: Clock, title: "Time Saving", desc: "No need to visit multiple branches or institutions — we handle the legwork." },
  { icon: Sparkles, title: "Expert Guidance", desc: "We help you understand available options and navigate the process with clarity." },
  { icon: Handshake, title: "Faster Coordination", desc: "We coordinate documentation and communication efficiently end-to-end." },
  { icon: Users, title: "Relationship Driven", desc: "We focus on long-term partnerships rather than one-time transactions." },
  { icon: ShieldCheck, title: "Transparency", desc: "Ethical, transparent business practices at every stage of engagement." },
];

const beneficiaries = [
  { title: "Businesses", items: ["SMEs", "Manufacturers", "Traders", "Retailers", "Service Providers"] },
  { title: "Professionals", items: ["Doctors", "Chartered Accountants", "Architects", "Consultants"] },
  { title: "Individuals", items: ["Salaried Professionals", "Self-Employed", "Property Owners"] },
  { title: "HNIs", items: ["Investors", "Business Owners", "Family Offices"] },
];

const faqs = [
  { q: "Is X Capital a bank?", a: "No. X Capital is an independent financial solutions and banking advisory firm." },
  { q: "Does X Capital provide loans directly?", a: "No. We assist clients in identifying and accessing suitable financial institutions." },
  { q: "Why use X Capital instead of approaching a bank directly?", a: "Every institution has different policies, products and eligibility criteria. X Capital helps you evaluate available options and navigate the process more efficiently." },
  { q: "Will my information remain confidential?", a: "Yes. Client information is handled with strict confidentiality and professionalism." },
  { q: "Does X Capital charge fees?", a: "Fees, if applicable, are communicated transparently before engagement. Certain services may also be compensated through institutional partnerships." },
  { q: "What documents are required?", a: "Requirements vary depending on the product and institution. Our team provides a customized document checklist for every case." },
  { q: "How long does the process take?", a: "Timelines depend on product type, documentation readiness and institution policies. Our team works to facilitate the process as efficiently as possible." },
  { q: "Can X Capital help with existing loans?", a: "Yes — balance transfers, loan restructuring discussions, facility enhancement and additional funding requirements." },
  { q: "Can X Capital help with large funding requirements?", a: "Yes. We support funding from small business loans to large corporate and structured financing opportunities." },
];

const coreValues = [
  { title: "Integrity", desc: "Doing business ethically." },
  { title: "Transparency", desc: "Clear communication at every stage." },
  { title: "Professionalism", desc: "Maintaining the highest standards." },
  { title: "Client First", desc: "Client success comes first." },
  { title: "Long-Term Relationships", desc: "Building partnerships, not transactions." },
];

function AboutPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <SiteLayout>
      <PageHeader eyebrow="About" title="About X Capital" subtitle="Strategic Banking, Lending & Treasury Solutions — helping businesses, professionals and individuals access smarter financial solutions." />

      <section id="about-us" className="container-x py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Who We Are</h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            X Capital is a financial solutions and banking advisory firm that helps businesses, professionals and individuals access the right banking, lending and treasury solutions through a network of leading banks, NBFCs and financial institutions.
          </p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Our objective is simple — help our clients save time, secure better financial opportunities, and build stronger banking relationships.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            ["50+", "Partner Institutions"],
            ["6-Step", "Advisory Process"],
            ["100%", "Transparent Fees"],
            ["End-to-End", "Relationship Support"],
          ].map(([v, l]) => (
            <div key={l} className="bg-secondary/50 rounded-xl p-6 text-center border border-border">
              <div className="text-2xl font-bold text-[var(--brand-black)]">{v}</div>
              <div className="text-sm text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="our-vision" className="bg-secondary/50">
        <div className="container-x py-16 grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl p-8 border border-border shadow-card">
            <h3 className="text-xl font-semibold text-[var(--brand-black)]">Our Mission</h3>
            <p className="text-muted-foreground mt-3">To simplify access to capital, banking and treasury solutions through expertise, transparency and strategic partnerships.</p>
          </div>
          <div className="bg-card rounded-xl p-8 border border-border shadow-card">
            <h3 className="text-xl font-semibold text-[var(--brand-black)]">Our Vision</h3>
            <p className="text-muted-foreground mt-3">To become India's most trusted financial solutions ecosystem for businesses, professionals and high-net-worth individuals.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container-x py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-foreground">How X Capital Works</h2>
          <p className="text-muted-foreground mt-3">A structured six-step advisory process from requirement to long-term relationship support.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="bg-card rounded-xl p-6 border border-border shadow-card hover:-translate-y-1 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-[var(--brand-yellow)] text-[var(--brand-black)] grid place-items-center">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-muted-foreground">STEP {i + 1}</span>
              </div>
              <h3 className="font-semibold text-[var(--brand-black)]">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-secondary/50">
        <div className="container-x py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-foreground">Why Choose X Capital</h2>
            <p className="text-muted-foreground mt-3">Built on access, expertise and trust.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((w) => (
              <div key={w.title} className="bg-card rounded-xl p-6 border border-border shadow-card flex gap-4">
                <div className="h-11 w-11 shrink-0 rounded-lg bg-[var(--brand-yellow-soft)] text-[var(--brand-black)] grid place-items-center">
                  <w.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--brand-black)]">{w.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Benefits */}
      <section className="container-x py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-foreground">Who Can Benefit</h2>
          <p className="text-muted-foreground mt-3">From SMEs and professionals to salaried individuals and HNIs.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {beneficiaries.map((b) => (
            <div key={b.title} className="bg-card rounded-xl p-6 border border-border shadow-card border-b-[3px] border-b-[var(--brand-yellow)]">
              <h3 className="font-bold text-[var(--brand-black)]">{b.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {b.items.map((i) => (
                  <li key={i} className="flex gap-2"><span className="text-[var(--brand-yellow)]">•</span><span>{i}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-[var(--brand-black)] text-white">
        <div className="container-x py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold">Our Core Values</h2>
            <p className="text-white/70 mt-3">The principles that guide every engagement.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {coreValues.map((v) => (
              <div key={v.title} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <div className="text-[var(--brand-yellow)] font-bold">{v.title}</div>
                <p className="text-sm text-white/70 mt-2">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container-x py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-3">Everything you need to know about working with X Capital.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f.q} className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-semibold text-[var(--brand-black)]">{f.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-[var(--brand-black)] transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section id="reach-us" className="container-x py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Reach Us</h2>
            <p className="text-muted-foreground mt-3">We'd love to hear from you. Fill the form or reach us directly.</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3"><MapPin className="h-5 w-5 text-[var(--brand-yellow)] shrink-0" /><span>XCapital Tower, Bandra Kurla Complex, Mumbai 400051</span></li>
              <li className="flex gap-3"><Phone className="h-5 w-5 text-[var(--brand-yellow)] shrink-0" /><span>+91 1800 123 4567</span></li>
              <li className="flex gap-3"><Mail className="h-5 w-5 text-[var(--brand-yellow)] shrink-0" /><span>care@xcapital.in</span></li>
            </ul>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="bg-card border border-border rounded-xl p-7 shadow-card space-y-4"
          >
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className="w-full rounded-md border border-input px-4 py-3 text-sm bg-background" />
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full rounded-md border border-input px-4 py-3 text-sm bg-background" />
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full rounded-md border border-input px-4 py-3 text-sm bg-background" />
            <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message" className="w-full rounded-md border border-input px-4 py-3 text-sm bg-background" />
            <button className="w-full bg-[var(--brand-yellow)] text-[var(--brand-black)] font-semibold py-3 rounded-md hover:brightness-110">{submitted ? "Thanks! We'll reach out." : "Send Message"}</button>
          </form>
        </div>
      </section>

      <section id="careers" className="bg-secondary/50">
        <div className="container-x py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-foreground">Join Our Team</h2>
            <p className="text-muted-foreground mt-3">Be part of a mission-driven team transforming finance in India.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {jobs.map((j) => (
              <div key={j.title} className="bg-card rounded-xl p-6 border border-border shadow-card hover:-translate-y-1 transition">
                <div className="h-10 w-10 rounded-lg bg-[var(--brand-black)] text-[var(--brand-yellow)] grid place-items-center mb-4">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">{j.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{j.location} · {j.type}</p>
                <button className="mt-4 text-sm font-semibold text-[var(--brand-black)] hover:text-amber-700">Apply →</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}