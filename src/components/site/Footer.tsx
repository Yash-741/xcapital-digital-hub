import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/xcapital-logo.asset.json";

export function Footer() {
  return (
    <footer className="bg-[var(--brand-black)] text-white/75 mt-16">
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="inline-block bg-white px-3 py-2 rounded mb-3">
            <img src={logo.url} alt="X Capital" className="h-8 w-auto" />
          </div>
          <p className="text-sm leading-relaxed text-white/70 mt-2">
            Strategic banking, lending and treasury solutions for businesses,
            professionals and individuals.
          </p>
          <div className="flex gap-3 mt-4">
            {[
              { Icon: Twitter, href: "https://x.com/XCapital_tweets", label: "X (Twitter)" },
              { Icon: Instagram, href: "https://www.instagram.com/xcapital.co.in/", label: "Instagram" },
              { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61590165826852", label: "Facebook" },
            ].map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-[var(--brand-yellow)] hover:text-[var(--brand-black)] transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Products</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/loans" className="hover:text-[var(--brand-yellow)]">Loans</Link></li>
            <li><Link to="/investments" className="hover:text-[var(--brand-yellow)]">Investments</Link></li>
            <li><Link to="/insurance" className="hover:text-[var(--brand-yellow)]">Insurance</Link></li>
            <li><Link to="/calculators" className="hover:text-[var(--brand-yellow)]">Calculators</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-[var(--brand-yellow)]">About Us</Link></li>
            <li><a href="/about#our-vision" className="hover:text-[var(--brand-yellow)]">Vision</a></li>
            <li><a href="/about#reach-us" className="hover:text-[var(--brand-yellow)]">Contact</a></li>
            <li><a href="/about#careers" className="hover:text-[var(--brand-yellow)]">Careers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Reach Us</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Sakinaka, Andheri East,<br />Mumbai 400072</li>
            <li>+91 88791 09148</li>
            <li>info@xcapital.co.in</li>
            <li>www.xcapital.co.in</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-5 text-xs text-white/50 flex flex-col md:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} XCapital. All rights reserved.</p>
          <p>Disclaimer: Loan, investment and insurance products are subject to terms and conditions and regulatory approvals.</p>
        </div>
      </div>
    </footer>
  );
}