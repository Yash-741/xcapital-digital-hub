import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Menu, X, ChevronDown, User, LogOut, Phone, Mail, Search } from "lucide-react";
import logo from "@/assets/xcapital-logo.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { SearchDialog } from "./SearchDialog";

const loanLinks = [
  "Personal Loan", "Home Loan", "Business Loan", "Loans for Doctors",
  "Loan Against Property", "Loan for CAs", "Commercial Lending",
  "Medical Equipment Finance", "Lease Rental Discounting",
  "Loan Against Securities", "Used Car Loan", "Education Loan",
];
const investmentLinks = ["Fixed Deposits", "Bonds"];
const insuranceLinks = ["Health Insurance", "Life Insurance", "Medical Claim"];
const aboutLinks = ["About Us", "Our Vision", "Reach Us", "Careers"];

function Dropdown({ label, items, to, active }: { label: string; items: string[]; to: string; active?: boolean }) {
  const panelId = `menu-${label.toLowerCase()}`;
  return (
    <div className="relative group focus-within:[&>div]:visible focus-within:[&>div]:opacity-100">
      <Link
        to={to}
        className={`relative flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-black)] rounded-sm ${active ? "text-[var(--brand-yellow)]" : "text-white hover:text-[var(--brand-yellow)]"}`}
        aria-haspopup="menu"
        aria-controls={panelId}
        aria-current={active ? "true" : undefined}
      >
        {label} <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        {active && (
          <span aria-hidden="true" className="absolute left-3 right-3 -bottom-px h-[3px] rounded-t bg-[var(--brand-yellow)] transition-all" />
        )}
      </Link>
      <div
        id={panelId}
        role="menu"
        aria-label={label}
        className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute left-0 top-full w-64 bg-white shadow-lg rounded-b-md py-2 transition-all duration-150 z-50 border-t-2 border-[var(--brand-yellow)]"
      >
        {items.map((item) => (
          <a
            key={item}
            href={`${to}#${item.toLowerCase().replace(/\s+/g, "-")}`}
            role="menuitem"
            className="block px-4 py-2.5 text-sm text-foreground hover:bg-[var(--brand-yellow-soft)] hover:text-[var(--brand-black)] focus-visible:outline-none focus-visible:bg-[var(--brand-yellow-soft)] focus-visible:text-[var(--brand-black)]"
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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

  // Scroll-spy for home page sections: Investments / Loans / Insurance
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }
    const ids = ["investments", "loans", "insurance", "calculators", "about"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        }
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        setActiveSection(bestRatio > 0 ? best : null);
      },
      { rootMargin: "-96px 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  // Cmd/Ctrl+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (key: "investments" | "loans" | "insurance" | "calculators" | "about", route: string) => {
    if (pathname === route) return true;
    if (pathname === "/" && activeSection === key) return true;
    return false;
  };

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? "shadow-md" : "shadow-sm"}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-[var(--brand-yellow)] focus:text-[var(--brand-black)] focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>
      {/* Top bar: logo + actions */}
      <div className="bg-white">
        <div className="container-x flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden text-[var(--brand-black)] p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow)]"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
            <Link to="/" className="flex items-center" aria-label="X Capital — Home">
              <img src={logo.url} alt="X Capital" className="h-10 md:h-12 w-auto" />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-5 mr-2">
              <a
                href="tel:+918879109148"
                className="flex items-center gap-2 text-sm text-[var(--brand-black)] hover:text-amber-700 transition rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow)]"
                aria-label="Call us at +91 88791 09148"
              >
                <span aria-hidden="true" className="h-9 w-9 grid place-items-center rounded-full bg-[var(--brand-yellow-soft)]">
                  <Phone className="h-4 w-4" />
                </span>
                <span aria-hidden="true" className="leading-tight">
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Call us</span>
                  <span className="block font-semibold">+91 88791 09148</span>
                </span>
              </a>
              <a
                href="mailto:info@xcapital.co.in"
                className="hidden xl:flex items-center gap-2 text-sm text-[var(--brand-black)] hover:text-amber-700 transition rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow)]"
                aria-label="Email us at info@xcapital.co.in"
              >
                <span aria-hidden="true" className="h-9 w-9 grid place-items-center rounded-full bg-[var(--brand-yellow-soft)]">
                  <Mail className="h-4 w-4" />
                </span>
                <span aria-hidden="true" className="leading-tight">
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Email</span>
                  <span className="block font-semibold">info@xcapital.co.in</span>
                </span>
              </a>
            </div>
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="hidden md:grid h-10 w-10 place-items-center rounded-full border border-[var(--brand-black)]/10 text-[var(--brand-black)] hover:bg-[var(--brand-yellow-soft)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow)]"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
            {signedIn ? (
              <button
                type="button"
                onClick={() => supabase.auth.signOut()}
                className="inline-flex items-center gap-2 rounded-full px-4 md:px-5 py-2.5 text-sm font-semibold text-[var(--brand-black)] bg-[var(--brand-yellow)] hover:brightness-105 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-black)] focus-visible:ring-offset-2"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">Sign out</span><span className="sm:hidden" aria-hidden="true">Out</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full px-4 md:px-5 py-2.5 text-sm font-semibold text-[var(--brand-black)] bg-[var(--brand-yellow)] hover:brightness-105 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-black)] focus-visible:ring-offset-2"
                aria-label="Register or Login"
              >
                <User className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">Register / Login</span><span className="sm:hidden" aria-hidden="true">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Black secondary nav */}
      <nav aria-label="Primary" className="hidden lg:block bg-[var(--brand-black)]">
        <div className="container-x flex items-center justify-center">
          <Link to="/" className={`relative px-4 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow)] rounded-sm ${pathname === "/" && !activeSection ? "text-[var(--brand-yellow)]" : "text-white hover:text-[var(--brand-yellow)]"}`}>
            Home
            {pathname === "/" && !activeSection && (
              <span aria-hidden="true" className="absolute left-3 right-3 -bottom-px h-[3px] rounded-t bg-[var(--brand-yellow)]" />
            )}
          </Link>
          <Dropdown label="Investments" items={investmentLinks} to="/investments" active={isActive("investments", "/investments")} />
          <Dropdown label="Loans" items={loanLinks} to="/loans" active={isActive("loans", "/loans")} />
          <Dropdown label="Insurance" items={insuranceLinks} to="/insurance" active={isActive("insurance", "/insurance")} />
          <Link to="/calculators" className={`relative px-4 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow)] rounded-sm ${isActive("calculators", "/calculators") ? "text-[var(--brand-yellow)]" : "text-white hover:text-[var(--brand-yellow)]"}`}>
            Calculators
            {isActive("calculators", "/calculators") && (
              <span aria-hidden="true" className="absolute left-3 right-3 -bottom-px h-[3px] rounded-t bg-[var(--brand-yellow)]" />
            )}
          </Link>
          <Link to="/store" className="px-4 py-3 text-sm font-medium text-white hover:text-[var(--brand-yellow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow)] rounded-sm">Store</Link>
          <Dropdown label="About" items={aboutLinks} to="/about" active={isActive("about", "/about")} />
        </div>
      </nav>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="lg:hidden bg-[var(--brand-black)] border-t border-white/10">
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
                className="px-3 py-2.5 min-h-11 flex items-center text-white hover:text-[var(--brand-yellow)] text-sm font-medium rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow)]"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}