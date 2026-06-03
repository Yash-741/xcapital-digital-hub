import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Briefcase } from "lucide-react";
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

function AboutPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <SiteLayout>
      <PageHeader eyebrow="About" title="About XCapital" subtitle="Building India's financial future, one customer at a time." />

      <section id="about-us" className="container-x py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">A trusted name in Indian finance</h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            XCapital is a pan-India NBFC providing loans, investments and insurance products since 1985. With over 25 lakh customers and 1,200+ branches, we combine local presence with cutting-edge digital experiences to make finance accessible to every Indian.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            ["40+", "Years of Trust"],
            ["1,200+", "Branches"],
            ["25L+", "Customers"],
            ["₹50,000Cr", "AUM"],
          ].map(([v, l]) => (
            <div key={l} className="bg-secondary/50 rounded-xl p-6 text-center border border-border">
              <div className="text-2xl font-bold text-[var(--brand-navy)]">{v}</div>
              <div className="text-sm text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="our-vision" className="bg-secondary/50">
        <div className="container-x py-16 grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl p-8 border border-border shadow-card">
            <h3 className="text-xl font-semibold text-[var(--brand-navy)]">Our Mission</h3>
            <p className="text-muted-foreground mt-3">Empower every Indian household and business with simple, transparent and accessible financial products that help them grow, protect and invest.</p>
          </div>
          <div className="bg-card rounded-xl p-8 border border-border shadow-card">
            <h3 className="text-xl font-semibold text-[var(--brand-navy)]">Our Vision</h3>
            <p className="text-muted-foreground mt-3">To be India's most trusted and customer-centric NBFC, recognized for innovation, integrity and inclusive finance by 2030.</p>
          </div>
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
            <button className="w-full bg-[var(--brand-gold)] text-[var(--brand-navy)] font-semibold py-3 rounded-md hover:brightness-110">{submitted ? "Thanks! We'll reach out." : "Send Message"}</button>
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
                <div className="h-10 w-10 rounded-lg bg-[var(--brand-navy)] text-[var(--brand-gold)] grid place-items-center mb-4">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">{j.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{j.location} · {j.type}</p>
                <button className="mt-4 text-sm font-semibold text-[var(--brand-navy)] hover:text-[var(--brand-gold)]">Apply →</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}