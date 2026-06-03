import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const loanLinks = [
  "Personal Loan", "Home Loan", "Business Loan", "Loans for Doctors",
  "Loan Against Property", "Loan for CAs", "Commercial Lending",
  "Medical Equipment Finance", "Lease Rental Discounting",
  "Loan Against Securities", "Used Car Loan", "Education Loan",
];
const investmentLinks = ["Fixed Deposits", "Bonds"];
const aboutLinks = ["About Us", "Our Vision", "Reach Us", "Careers"];

function Dropdown({ label, items, to }: { label: string; items: string[]; to: string }) {
  return (
    <div className="relative group">
      <Link
        to={to}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/90 hover:text-[var(--brand-gold)] transition-colors"
      >
        {label} <ChevronDown className="h-3.5 w-3.5" />
      </Link>
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute right-0 top-full mt-0 w-64 bg-white shadow-card rounded-md py-2 transition-all duration-150 z-50 border border-border">
        {items.map((item) => (
          <a
            key={item}
            href={`${to}#${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="block px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary"
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-[var(--brand-navy)] transition-shadow ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="container-x flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          <span style={{ color: "var(--brand-gold)" }}>X</span>
          <span className="text-white">Capital</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Link to="/" className="px-3 py-2 text-sm font-medium text-white/90 hover:text-[var(--brand-gold)]">Home</Link>
          <Dropdown label="Loans" items={loanLinks} to="/loans" />
          <Dropdown label="Investments" items={investmentLinks} to="/investments" />
          <Link to="/insurance" className="px-3 py-2 text-sm font-medium text-white/90 hover:text-[var(--brand-gold)]">Insurance</Link>
          <Link to="/calculators" className="px-3 py-2 text-sm font-medium text-white/90 hover:text-[var(--brand-gold)]">Calculators</Link>
          <Dropdown label="About" items={aboutLinks} to="/about" />
          <a
            href="#apply"
            className="ml-3 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-[var(--brand-navy)] bg-[var(--brand-gold)] hover:brightness-110 transition"
          >
            Apply Now
          </a>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-white p-2"
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-[var(--brand-navy)] border-t border-white/10">
          <div className="container-x py-3 flex flex-col gap-1">
            {[
              ["Home", "/"],
              ["Loans", "/loans"],
              ["Investments", "/investments"],
              ["Insurance", "/insurance"],
              ["Calculators", "/calculators"],
              ["About", "/about"],
            ].map(([label, to]) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-white/90 hover:text-[var(--brand-gold)] text-sm font-medium"
              >
                {label}
              </Link>
            ))}
            <a
              href="#apply"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold text-[var(--brand-navy)] bg-[var(--brand-gold)]"
            >
              Apply Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}