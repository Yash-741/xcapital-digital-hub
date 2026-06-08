import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import logo from "@/assets/xcapital-logo.asset.json";
import { supabase } from "@/integrations/supabase/client";

const loanLinks = [
  "Personal Loan", "Home Loan", "Business Loan", "Loans for Doctors",
  "Loan Against Property", "Loan for CAs", "Commercial Lending",
  "Medical Equipment Finance", "Lease Rental Discounting",
  "Loan Against Securities", "Used Car Loan", "Education Loan",
];
const investmentLinks = ["Fixed Deposits", "Bonds"];
const insuranceLinks = ["Health Insurance", "Life Insurance", "Medical Claim"];
const aboutLinks = ["About Us", "Our Vision", "Reach Us", "Careers"];

function Dropdown({ label, items, to }: { label: string; items: string[]; to: string }) {
  return (
    <div className="relative group">
      <Link
        to={to}
        className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-white hover:text-[var(--brand-yellow)] transition-colors"
      >
        {label} <ChevronDown className="h-3.5 w-3.5" />
      </Link>
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute left-0 top-full w-64 bg-white shadow-lg rounded-b-md py-2 transition-all duration-150 z-50 border-t-2 border-[var(--brand-yellow)]">
        {items.map((item) => (
          <a
            key={item}
            href={`${to}#${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="block px-4 py-2.5 text-sm text-foreground hover:bg-[var(--brand-yellow-soft)] hover:text-[var(--brand-black)]"
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
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? "shadow-md" : "shadow-sm"}`}>
      {/* Top bar: logo + actions */}
      <div className="bg-white">
        <div className="container-x flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden text-[var(--brand-black)] p-2"
              aria-label="Menu"
            >
              {open ? <X /> : <Menu />}
            </button>
            <Link to="/" className="flex items-center" aria-label="X Capital — Home">
              <img src={logo.url} alt="X Capital" className="h-10 md:h-12 w-auto" />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {signedIn ? (
              <button
                onClick={() => supabase.auth.signOut()}
                className="inline-flex items-center gap-2 rounded-full px-4 md:px-5 py-2.5 text-sm font-semibold text-[var(--brand-black)] bg-[var(--brand-yellow)] hover:brightness-105 transition"
              >
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span><span className="sm:hidden">Out</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full px-4 md:px-5 py-2.5 text-sm font-semibold text-[var(--brand-black)] bg-[var(--brand-yellow)] hover:brightness-105 transition"
              >
                <User className="h-4 w-4" /> <span className="hidden sm:inline">Register / Login</span><span className="sm:hidden">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Black secondary nav */}
      <nav className="hidden lg:block bg-[var(--brand-black)]">
        <div className="container-x flex items-center justify-center">
          <Link to="/" className="px-4 py-3 text-sm font-medium text-white hover:text-[var(--brand-yellow)]">Home</Link>
          <Dropdown label="Investments" items={investmentLinks} to="/investments" />
          <Dropdown label="Loans" items={loanLinks} to="/loans" />
          <Dropdown label="Insurance" items={insuranceLinks} to="/insurance" />
          <Link to="/calculators" className="px-4 py-3 text-sm font-medium text-white hover:text-[var(--brand-yellow)]">Calculators</Link>
          <Link to="/store" className="px-4 py-3 text-sm font-medium text-white hover:text-[var(--brand-yellow)]">Store</Link>
          <Dropdown label="About" items={aboutLinks} to="/about" />
        </div>
      </nav>

      {open && (
        <div className="lg:hidden bg-[var(--brand-black)] border-t border-white/10">
          <div className="container-x py-3 flex flex-col gap-1">
            {[
              ["Home", "/"],
              ["Investments", "/investments"],
              ["Loans", "/loans"],
              ["Insurance", "/insurance"],
              ["Calculators", "/calculators"],
              ["Store", "/store"],
              ["About", "/about"],
            ].map(([label, to]) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-white hover:text-[var(--brand-yellow)] text-sm font-medium"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}