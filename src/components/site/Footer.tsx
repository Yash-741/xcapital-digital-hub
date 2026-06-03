import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[var(--brand-navy)] text-white/80 mt-20">
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="text-2xl font-extrabold mb-3">
            <span style={{ color: "var(--brand-gold)" }}>X</span>Capital
          </div>
          <p className="text-sm leading-relaxed text-white/70">
            A trusted Indian NBFC offering loans, investments and insurance to
            millions of customers across India.
          </p>
          <div className="flex gap-3 mt-4">
            {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-[var(--brand-gold)] hover:text-[var(--brand-navy)] transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Products</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/loans" className="hover:text-[var(--brand-gold)]">Loans</Link></li>
            <li><Link to="/investments" className="hover:text-[var(--brand-gold)]">Investments</Link></li>
            <li><Link to="/insurance" className="hover:text-[var(--brand-gold)]">Insurance</Link></li>
            <li><Link to="/calculators" className="hover:text-[var(--brand-gold)]">Calculators</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-[var(--brand-gold)]">About Us</Link></li>
            <li><a href="/about#our-vision" className="hover:text-[var(--brand-gold)]">Vision</a></li>
            <li><a href="/about#reach-us" className="hover:text-[var(--brand-gold)]">Contact</a></li>
            <li><a href="/about#careers" className="hover:text-[var(--brand-gold)]">Careers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Reach Us</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>XCapital Tower, Bandra Kurla Complex,<br />Mumbai, Maharashtra 400051</li>
            <li>+91 1800 123 4567</li>
            <li>care@xcapital.in</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-5 text-xs text-white/50 flex flex-col md:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} XCapital Finance Ltd. All rights reserved. RBI Registered NBFC.</p>
          <p>Disclaimer: Loan, investment and insurance products are subject to terms and conditions and regulatory approvals.</p>
        </div>
      </div>
    </footer>
  );
}