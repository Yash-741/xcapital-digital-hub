import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  MapPin, Phone, Mail, Search, FileCheck, Building2,
  FileText, CheckCircle2, RefreshCw, Clock, Users, Handshake,
  ShieldCheck, Sparkles, ChevronDown, CheckCircle, Globe,
  GraduationCap, Upload, User as UserIcon,
} from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About XCapital — Our Vision, Team & Careers" },
      { name: "description", content: "XCapital is a trusted Indian financial advisory firm partnering with 50+ banks. Learn our vision, meet the team, find our offices and explore careers." },
      { property: "og:title", content: "About XCapital — Our Vision, Team & Careers" },
      { property: "og:description", content: "Who we are, what drives us, and how to reach or join the XCapital team." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const careerPerks = [
  { icon: Sparkles, key: "1" },
  { icon: Users, key: "2" },
  { icon: Handshake, key: "3" },
  { icon: ShieldCheck, key: "4" },
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
  { icon: Search, key: "1" },
  { icon: FileCheck, key: "2" },
  { icon: Building2, key: "3" },
  { icon: FileText, key: "4" },
  { icon: CheckCircle2, key: "5" },
  { icon: RefreshCw, key: "6" },
];

const whyChoose = [
  { icon: Building2, key: "1" },
  { icon: Clock, key: "2" },
  { icon: Sparkles, key: "3" },
  { icon: Handshake, key: "4" },
  { icon: Users, key: "5" },
  { icon: ShieldCheck, key: "6" },
];

const beneficiaries = [
  { key: "1", items: ["SMEs", "Manufacturers", "Traders", "Retailers", "Service Providers"] },
  { key: "2", items: ["Doctors", "Chartered Accountants", "Architects", "Consultants"] },
  { key: "3", items: ["Salaried Professionals", "Self-Employed", "Property Owners"] },
  { key: "4", items: ["Investors", "Business Owners", "Family Offices"] },
];

const faqs = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const coreValues = ["1", "2", "3", "4", "5"];

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
  const { t } = useI18n();
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
      <PageHeader eyebrow={t("about.header.eyebrow")} title={t("about.header.title")} subtitle={t("about.header.subtitle")} />

      <section id="about-us" className="container-x py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t("about.who.title")}</h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">{t("about.who.p1")}</p>
          <p className="text-muted-foreground mt-3 leading-relaxed">{t("about.who.p2")}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            ["50+", t("about.stat.partners")],
            ["6-Step", t("about.stat.process")],
            ["100%", t("about.stat.fees")],
            ["End-to-End", t("about.stat.support")],
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
          <h2 className="text-3xl font-bold text-foreground">{t("about.how.title")}</h2>
          <p className="text-muted-foreground mt-3">{t("about.how.intro")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.key} className="bg-card rounded-xl p-6 border border-border shadow-card hover:-translate-y-1 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-[var(--brand-yellow)] text-[var(--brand-black)] grid place-items-center">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-muted-foreground">{t("about.how.stepLabel")} {i + 1}</span>
              </div>
              <h3 className="font-semibold text-[var(--brand-black)]">{t(`about.step.${s.key}.title`)}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{t(`about.step.${s.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-secondary/50">
        <div className="container-x py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-foreground">{t("about.why.title")}</h2>
            <p className="text-muted-foreground mt-3">{t("about.why.intro")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((w) => (
              <div key={w.key} className="bg-card rounded-xl p-6 border border-border shadow-card flex gap-4">
                <div className="h-11 w-11 shrink-0 rounded-lg bg-[var(--brand-yellow-soft)] text-[var(--brand-black)] grid place-items-center">
                  <w.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--brand-black)]">{t(`about.why.${w.key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t(`about.why.${w.key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Benefits */}
      <section className="container-x py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-foreground">{t("about.benefit.title")}</h2>
          <p className="text-muted-foreground mt-3">{t("about.benefit.intro")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {beneficiaries.map((b) => (
            <div key={b.key} className="bg-card rounded-xl p-6 border border-border shadow-card border-b-[3px] border-b-[var(--brand-yellow)]">
              <h3 className="font-bold text-[var(--brand-black)]">{t(`about.benefit.${b.key}.title`)}</h3>
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
            <h2 className="text-3xl font-bold">{t("about.values.title")}</h2>
            <p className="text-white/70 mt-3">{t("about.values.intro")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {coreValues.map((v) => (
              <div key={v} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <div className="text-[var(--brand-yellow)] font-bold">{t(`about.value.${v}.title`)}</div>
                <p className="text-sm text-white/70 mt-2">{t(`about.value.${v}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container-x py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-foreground">{t("about.faq.title")}</h2>
          <p className="text-muted-foreground mt-3">{t("about.faq.intro")}</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f} className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-semibold text-[var(--brand-black)]">{t(`about.faq.${f}.q`)}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-[var(--brand-black)] transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                    {t(`about.faq.${f}.a`)}
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
            <h2 className="text-3xl font-bold text-foreground">{t("about.leadership.title")}</h2>
            <p className="text-muted-foreground mt-3">{t("about.leadership.intro")}</p>
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
                    <p className="text-sm text-muted-foreground mt-0.5">{l.role}{t("about.leadership.roleSuffix")}</p>
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
            <h2 className="text-3xl font-bold text-foreground">{t("about.reach.title")}</h2>
            <p className="text-muted-foreground mt-3">{t("about.reach.intro")}</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3"><MapPin className="h-5 w-5 text-[var(--brand-yellow)] shrink-0" /><span>Sakinaka, Andheri East, Mumbai 400072</span></li>
              <li className="flex gap-3"><Phone className="h-5 w-5 text-[var(--brand-yellow)] shrink-0" /><a href="tel:+918879109148" className="hover:text-[var(--brand-yellow)]">+91 88791 09148</a></li>
              <li className="flex gap-3"><Mail className="h-5 w-5 text-[var(--brand-yellow)] shrink-0" /><a href="mailto:info@xcapital.co.in" className="hover:text-[var(--brand-yellow)]">info@xcapital.co.in</a></li>
              <li className="flex gap-3"><Globe className="h-5 w-5 text-[var(--brand-yellow)] shrink-0" /><span>www.xcapital.co.in</span></li>
            </ul>
          </div>
          {submitted ? (
            <div className="bg-card border border-border rounded-xl p-8 shadow-card flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-green-100 text-green-700 grid place-items-center mb-4">
                <CheckCircle className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[var(--brand-black)]">{t("about.reach.success.title")}</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">{t("about.reach.success.body")}</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-sm font-semibold text-[var(--brand-black)] hover:text-amber-700"
              >
                {t("about.reach.success.again")}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="bg-card border border-border rounded-xl p-7 shadow-card space-y-4">
              {([
                { k: "name", placeholder: t("about.reach.placeholder.name"), type: "text", maxLength: 100 },
                { k: "phone", placeholder: t("about.reach.placeholder.phone"), type: "tel", maxLength: 15 },
                { k: "email", placeholder: t("about.reach.placeholder.email"), type: "email", maxLength: 255 },
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
                  placeholder={t("about.reach.placeholder.message")}
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
                {t("about.reach.submit")}
              </button>
            </form>
          )}
        </div>
      </section>

      <section id="careers" className="bg-secondary/50">
        <div className="container-x py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block text-xs font-bold tracking-widest text-[var(--brand-black)] bg-[var(--brand-yellow)] px-3 py-1 rounded-full">{t("about.careers.badge")}</span>
            <h2 className="text-3xl font-bold text-foreground mt-3">{t("about.careers.title")}</h2>
            <p className="text-muted-foreground mt-3">{t("about.careers.intro")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {careerPerks.map((p) => (
              <div key={p.key} className="bg-card rounded-xl p-6 border border-border shadow-card">
                <div className="h-11 w-11 rounded-lg bg-[var(--brand-yellow-soft)] text-[var(--brand-black)] grid place-items-center mb-3">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-[var(--brand-black)]">{t(`about.perks.${p.key}.title`)}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{t(`about.perks.${p.key}.desc`)}</p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground">{t("about.apply.title")}</h3>
              <p className="text-sm text-muted-foreground mt-2">{t("about.apply.intro")}</p>
            </div>

            {appSubmitted ? (
              <div className="bg-card border border-border rounded-xl p-8 shadow-card flex flex-col items-center text-center border-b-[3px] border-b-[var(--brand-yellow)]">
                <div className="h-14 w-14 rounded-full bg-green-100 text-green-700 grid place-items-center mb-4">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-[var(--brand-black)]">{t("about.apply.success.title")}</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">{t("about.apply.success.body")}</p>
                <button
                  onClick={() => setAppSubmitted(false)}
                  className="mt-6 text-sm font-semibold text-[var(--brand-black)] hover:text-amber-700"
                >
                  {t("about.apply.success.again")}
                </button>
              </div>
            ) : (
              <form onSubmit={onApplicationSubmit} noValidate className="bg-card border border-border rounded-xl p-7 shadow-card space-y-4">
                {([
                  { k: "candidateName", placeholder: t("about.apply.placeholder.name"), type: "text", icon: UserIcon, maxLength: 100 },
                  { k: "email", placeholder: t("about.apply.placeholder.email"), type: "email", icon: Mail, maxLength: 255 },
                  { k: "contactNumber", placeholder: t("about.apply.placeholder.phone"), type: "tel", icon: Phone, maxLength: 15 },
                  { k: "education", placeholder: t("about.apply.placeholder.edu"), type: "text", icon: GraduationCap, maxLength: 150 },
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
                        {resume ? resume.name : t("about.apply.resume.attach")}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t("about.apply.resume.hint")}</div>
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
                  {t("about.apply.submit")}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}