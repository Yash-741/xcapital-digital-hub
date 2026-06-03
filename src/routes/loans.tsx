import { createFileRoute } from "@tanstack/react-router";
import {
  Wallet, Home, Briefcase, Stethoscope, Building2, Calculator as CalcIcon,
  Factory, Activity, Building, LineChart, Car, GraduationCap,
} from "lucide-react";
import { SiteLayout, PageHeader, ProductCard } from "@/components/site/Layout";

export const Route = createFileRoute("/loans")({
  head: () => ({
    meta: [
      { title: "Loans — XCapital" },
      { name: "description", content: "Personal, Home, Business and specialised loans from XCapital — fast disbursal, competitive rates." },
      { property: "og:title", content: "Loans — XCapital" },
      { property: "og:description", content: "Explore 12+ loan products designed for every Indian." },
    ],
  }),
  component: LoansPage,
});

const loans = [
  { icon: Wallet, name: "Personal Loan", description: "Up to ₹40L for any life goal — weddings, travel, emergencies." },
  { icon: Home, name: "Home Loan", description: "Own your dream home with rates starting at 8.4% p.a." },
  { icon: Briefcase, name: "Business Loan", description: "Working capital and expansion finance for SMEs and MSMEs." },
  { icon: Stethoscope, name: "Loans for Doctors", description: "Tailored finance for clinics, equipment and practice growth." },
  { icon: Building2, name: "Loan Against Property", description: "Unlock value of your residential or commercial property." },
  { icon: CalcIcon, name: "Loan for CAs", description: "Special rates and quick disbursal for Chartered Accountants." },
  { icon: Factory, name: "Commercial Lending", description: "Term loans and credit lines for large enterprises." },
  { icon: Activity, name: "Medical Equipment Finance", description: "Fund advanced diagnostic and surgical equipment." },
  { icon: Building, name: "Lease Rental Discounting", description: "Monetise future rentals from leased commercial assets." },
  { icon: LineChart, name: "Loan Against Securities", description: "Borrow against mutual funds, shares and bonds." },
  { icon: Car, name: "Used Car Loan", description: "Finance pre-owned cars with minimal paperwork." },
  { icon: GraduationCap, name: "Education Loan", description: "Fund higher studies in India and abroad." },
];

function LoansPage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Loans" title="Borrow with confidence" subtitle="From personal goals to business growth — choose from our wide range of loan products." />
      <section className="container-x py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((l) => <ProductCard key={l.name} {...l} />)}
        </div>
      </section>
    </SiteLayout>
  );
}