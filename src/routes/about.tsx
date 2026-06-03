import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  MapPin, Phone, Mail, Briefcase, Search, FileCheck, Building2,
  FileText, CheckCircle2, RefreshCw, Clock, Users, Handshake,
  ShieldCheck, Sparkles, ChevronDown, CheckCircle, Globe,
  GraduationCap, Upload, User as UserIcon,
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

const careerPerks = [
  { icon: Sparkles, title: "Growth & Learning", desc: "Continuous learning, mentorship and clear career progression across functions." },
  { icon: Users, title: "Collaborative Culture", desc: "A respectful, transparent and team-first environment where ideas matter." },
  { icon: Handshake, title: "Meaningful Work", desc: "Help businesses, professionals and families access smarter financial solutions." },
  { icon: ShieldCheck, title: "Stability & Trust", desc: "Work with an established advisory firm backed by leading institutional partners." },
];

const applicationSchema = z.object({
  candidateName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  contactNumber: z
    .string()
    .trim()
    .regex(/^(\+?91[\-\s]?)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  education: z.string().trim().min(2, "Please enter your highest education").max(150),
});

type ApplicationForm = z.infer<typeof applicationSchema>;
type ApplicationErrors = Partial<Record<keyof ApplicationForm | "resume", string>>;

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

const leaders = [
  {
    name: "Amey Jaguste",
    role: "Founder",
    phone: "+91 88791 09148",
    email: "amey.jaguste@xcapital.co.in",
  },
  {
    name: "Durgesh Patel",
    role: "Co-Founder",
    phone: "+91 99678 90467",
    email: "durgesh.patel@xcapital.co.in",
  },
];

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100, "Name must be under 100 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?91[\-\s]?)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email("Enter a valid email address").max(255, "Email too long"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message must be under 1000 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;
type FieldErrors = Partial<Record<keyof ContactForm, string>>;

function AboutPage() {
  const [form, setForm] = useState<ContactForm>({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [appForm, setAppForm] = useState<ApplicationForm>({
    candidateName: "", email: "", contactNumber: "", education: "",
  });
  const [resume, setResume] = useState<File | null>(null);
  const [appErrors, setAppErrors] = useState<ApplicationErrors>({});
  const [appSubmitted, setAppSubmitted] = useState(false);

  const updateApp = (k: keyof ApplicationForm, v: string) => {
    setAppForm((f) => ({ ...f, [k]: v }));
    if (appErrors[k]) setAppErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applicationSchema.safeParse(appForm);
    const next: ApplicationErrors = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof ApplicationForm;
        if (!next[k]) next[k] = issue.message;
      }
    }
    if (!resume) {
      next.resume = "Please attach your resume";
    } else {
      const okType = /\.(pdf|doc|docx)$/i.test(resume.name);
      const okSize = resume.size <= 5 * 1024 * 1024;
      if (!okType) next.resume = "Resume must be PDF, DOC or DOCX";
      else if (!okSize) next.resume = "Resume must be under 5MB";
    }
    if (Object.keys(next).length) {
      setAppErrors(next);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setAppErrors({});
    setAppSubmitted(true);
    setAppForm({ candidateName: "", email: "", contactNumber: "", education: "" });
    setResume(null);
    toast.success("Application received! We'll be in touch.");
  };

  const update = (k: keyof ContactForm, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof ContactForm;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErrors({});
    setSubmitted(true);
    setForm({ name: "", phone: "", email: "", message: "" });
    toast.success("Thanks! Our team will reach out shortly.");
  };

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

      {/* Leadership */}
      <section id="leadership" className="bg-secondary/50">
        <div className="container-x py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-foreground">Leadership</h2>
            <p className="text-muted-foreground mt-3">Meet the people behind X Capital.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {leaders.map((l) => (
              <div
                key={l.email}
                className="bg-card rounded-xl p-7 border border-border shadow-card border-b-[3px] border-b-[var(--brand-yellow)]"
              >
                <div className="flex items-start gap-5">
                  <div className="h-16 w-16 shrink-0 rounded-full bg-[var(--brand-black)] text-[var(--brand-yellow)] grid place-items-center text-xl font-bold">
                    {l.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-[var(--brand-black)] tracking-wide">{l.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{l.role}, X Capital</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[var(--brand-yellow)] shrink-0" />
                        <a href={`tel:${l.phone.replace(/\s/g, "")}`} className="hover:text-[var(--brand-black)]">{l.phone}</a>
                      </li>
                      <li className="flex items-center gap-2 min-w-0">
                        <Mail className="h-4 w-4 text-[var(--brand-yellow)] shrink-0" />
                        <a href={`mailto:${l.email}`} className="truncate hover:text-[var(--brand-black)]">{l.email}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reach-us" className="container-x py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Reach Us</h2>
            <p className="text-muted-foreground mt-3">We'd love to hear from you. Fill the form or reach us directly.</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3"><MapPin className="h-5 w-5 text-[var(--brand-yellow)] shrink-0" /><span>Sakinaka, Andheri East, Mumbai 400072</span></li>
              <li className="flex gap-3"><Phone className="h-5 w-5 text-[var(--brand-yellow)] shrink-0" /><span>+91 88791 09148</span></li>
              <li className="flex gap-3"><Mail className="h-5 w-5 text-[var(--brand-yellow)] shrink-0" /><span>amey.jaguste@xcapital.co.in</span></li>
              <li className="flex gap-3"><Globe className="h-5 w-5 text-[var(--brand-yellow)] shrink-0" /><span>www.xcapital.co.in</span></li>
            </ul>
          </div>
          {submitted ? (
            <div className="bg-card border border-border rounded-xl p-8 shadow-card flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-green-100 text-green-700 grid place-items-center mb-4">
                <CheckCircle className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[var(--brand-black)]">Message Received</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Thank you for reaching out to X Capital. Our advisory team will get back to you within one business day.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-sm font-semibold text-[var(--brand-black)] hover:text-amber-700"
              >
                Send another message →
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="bg-card border border-border rounded-xl p-7 shadow-card space-y-4">
              {([
                { k: "name", placeholder: "Full Name", type: "text", maxLength: 100 },
                { k: "phone", placeholder: "Phone (10-digit mobile)", type: "tel", maxLength: 15 },
                { k: "email", placeholder: "Email", type: "email", maxLength: 255 },
              ] as const).map(({ k, placeholder, type, maxLength }) => (
                <div key={k}>
                  <input
                    type={type}
                    value={form[k]}
                    maxLength={maxLength}
                    onChange={(e) => update(k, e.target.value)}
                    placeholder={placeholder}
                    aria-invalid={!!errors[k]}
                    className={`w-full rounded-md border px-4 py-3 text-sm bg-background ${
                      errors[k] ? "border-red-500" : "border-input"
                    }`}
                  />
                  {errors[k] && <p className="text-xs text-red-600 mt-1">{errors[k]}</p>}
                </div>
              ))}
              <div>
                <textarea
                  rows={4}
                  value={form.message}
                  maxLength={1000}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="How can we help you?"
                  aria-invalid={!!errors.message}
                  className={`w-full rounded-md border px-4 py-3 text-sm bg-background ${
                    errors.message ? "border-red-500" : "border-input"
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {errors.message
                    ? <p className="text-xs text-red-600">{errors.message}</p>
                    : <span />}
                  <span className="text-xs text-muted-foreground">{form.message.length}/1000</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--brand-yellow)] text-[var(--brand-black)] font-semibold py-3 rounded-md hover:brightness-110"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>

      <section id="careers" className="bg-secondary/50">
        <div className="container-x py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block text-xs font-bold tracking-widest text-[var(--brand-black)] bg-[var(--brand-yellow)] px-3 py-1 rounded-full">CAREERS</span>
            <h2 className="text-3xl font-bold text-foreground mt-3">Build Your Career at X Capital</h2>
            <p className="text-muted-foreground mt-3">
              We're always on the lookout for passionate, driven individuals who want to make a real impact in the world of finance. At X Capital, you'll work alongside experienced professionals, learn from industry experts and help shape financial solutions that matter.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {careerPerks.map((p) => (
              <div key={p.title} className="bg-card rounded-xl p-6 border border-border shadow-card">
                <div className="h-11 w-11 rounded-lg bg-[var(--brand-yellow-soft)] text-[var(--brand-black)] grid place-items-center mb-3">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-[var(--brand-black)]">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground">Apply Now</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Share your details and resume — we'll reach out when the right opportunity opens up.
              </p>
            </div>

            {appSubmitted ? (
              <div className="bg-card border border-border rounded-xl p-8 shadow-card flex flex-col items-center text-center border-b-[3px] border-b-[var(--brand-yellow)]">
                <div className="h-14 w-14 rounded-full bg-green-100 text-green-700 grid place-items-center mb-4">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-[var(--brand-black)]">Application Received</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                  Thank you for applying to X Capital. Our team will review your profile and get back to you soon.
                </p>
                <button
                  onClick={() => setAppSubmitted(false)}
                  className="mt-6 text-sm font-semibold text-[var(--brand-black)] hover:text-amber-700"
                >
                  Submit another application →
                </button>
              </div>
            ) : (
              <form onSubmit={onApplicationSubmit} noValidate className="bg-card border border-border rounded-xl p-7 shadow-card space-y-4">
                {([
                  { k: "candidateName", placeholder: "Candidate Name", type: "text", icon: UserIcon, maxLength: 100 },
                  { k: "email", placeholder: "Email", type: "email", icon: Mail, maxLength: 255 },
                  { k: "contactNumber", placeholder: "Contact Number (10-digit mobile)", type: "tel", icon: Phone, maxLength: 15 },
                  { k: "education", placeholder: "Highest Education (e.g. MBA Finance, B.Com)", type: "text", icon: GraduationCap, maxLength: 150 },
                ] as const).map(({ k, placeholder, type, icon: Icon, maxLength }) => (
                  <div key={k}>
                    <div className={`flex items-center gap-2 rounded-md border bg-background px-3 ${appErrors[k] ? "border-red-500" : "border-input"}`}>
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <input
                        type={type}
                        value={appForm[k]}
                        maxLength={maxLength}
                        onChange={(e) => updateApp(k, e.target.value)}
                        placeholder={placeholder}
                        aria-invalid={!!appErrors[k]}
                        className="w-full bg-transparent py-3 text-sm outline-none"
                      />
                    </div>
                    {appErrors[k] && <p className="text-xs text-red-600 mt-1">{appErrors[k]}</p>}
                  </div>
                ))}

                <div>
                  <label className={`flex items-center gap-3 rounded-md border-2 border-dashed bg-background px-4 py-4 cursor-pointer hover:bg-secondary/40 transition ${appErrors.resume ? "border-red-500" : "border-input"}`}>
                    <div className="h-10 w-10 rounded-lg bg-[var(--brand-yellow-soft)] text-[var(--brand-black)] grid place-items-center shrink-0">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-[var(--brand-black)]">
                        {resume ? resume.name : "Attach your resume"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        PDF, DOC or DOCX · Max 5MB
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        setResume(e.target.files?.[0] ?? null);
                        if (appErrors.resume) setAppErrors((er) => ({ ...er, resume: undefined }));
                      }}
                      className="hidden"
                    />
                  </label>
                  {appErrors.resume && <p className="text-xs text-red-600 mt-1">{appErrors.resume}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[var(--brand-yellow)] text-[var(--brand-black)] font-semibold py-3 rounded-md hover:brightness-110"
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}