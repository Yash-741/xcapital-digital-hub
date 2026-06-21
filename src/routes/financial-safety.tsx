import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";
import { ShieldAlert, Lock, Link2, Phone, Banknote, Landmark, FileLock2, AlertTriangle, UserCheck, Siren, BookOpen } from "lucide-react";

export const Route = createFileRoute("/financial-safety")({
  head: () => ({
    meta: [
      { title: "Financial Safety & Digital Awareness — XCapital" },
      { name: "description", content: "Stay protected from financial and digital fraud. Learn safe banking practices, recognise scams, and know your customer rights with X Capital." },
      { property: "og:title", content: "Financial Safety & Digital Awareness — XCapital" },
      { property: "og:description", content: "Awareness centre with safe banking practices, fraud warning signs, customer rights, and RBI resources." },
      { property: "og:url", content: "/financial-safety" },
    ],
    links: [{ rel: "canonical", href: "/financial-safety" }],
  }),
  component: FinancialSafetyPage,
});

function SectionCard({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg grid place-items-center bg-[var(--brand-yellow-soft)] text-[var(--brand-black)]">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">{title}</h2>
      </div>
      <div className="space-y-3 pl-1">{children}</div>
    </div>
  );
}

function FinancialSafetyPage() {
  const { tEn } = useI18n();

  return (
    <SiteLayout>
      <PageHeader
        eyebrow={tEn("Awareness Centre")}
        title={tEn("Financial Safety & Digital Awareness")}
        subtitle={tEn("Protecting you against financial & digital fraud. At X Capital, we believe that financial awareness is the foundation of financial security.")}
      />

      <section className="container-x py-10 md:py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-card border border-border p-6 md:p-10 space-y-10 leading-relaxed text-sm md:text-base text-foreground/80">

          <p>
            As digital banking, online transactions, and financial products become increasingly accessible, fraudsters continue to develop sophisticated methods to target individuals and businesses. Our objective is to help clients stay informed, protect sensitive information, and make safe financial decisions.
          </p>
          <p>
            This awareness centre has been developed to educate our clients on safe banking practices, cyber security awareness, fraud prevention, customer rights, and responsible financial behaviour.
          </p>

          <hr className="border-border" />

          <SectionCard icon={ShieldAlert} title="Never Share These Details">
            <p>Under no circumstances should you share:</p>
            <div className="grid sm:grid-cols-2 gap-2 mt-2">
              {["OTP (One-Time Password)","UPI PIN","ATM PIN","CVV Number","Net Banking Passwords","Mobile Banking Credentials","Debit/Credit Card PINs","Screen Sharing Access"].map((x) => (
                <div key={x} className="flex items-start gap-2 bg-destructive/5 border border-destructive/20 rounded-md p-2.5">
                  <span className="text-destructive font-bold">✕</span>
                  <span className="text-sm">{x}</span>
                </div>
              ))}
            </div>
            <p className="font-semibold text-[var(--brand-black)] mt-3">
              Banks, NBFCs, financial institutions, and X Capital representatives will never ask for these confidential details.
            </p>
          </SectionCard>

          <SectionCard icon={Lock} title="Safe Digital Banking Practices">
            <p className="font-semibold text-[var(--brand-black)]">Always use official channels</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access only official banking websites</li>
              <li>Download applications from official app stores</li>
              <li>Verify website URLs carefully</li>
              <li>Confirm official contact numbers before engaging</li>
              <li>Avoid public Wi-Fi for financial transactions</li>
            </ul>
          </SectionCard>

          <SectionCard icon={Link2} title="Beware of Suspicious Links">
            <p>Fraudsters often send fake links through SMS, WhatsApp, Email, and Social Media.</p>
            <p className="font-semibold text-[var(--brand-black)]">Before clicking any link:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verify the sender</li>
              <li>Check the website domain</li>
              <li>Contact the institution directly if unsure</li>
              <li>Never download files from unknown sources</li>
            </ul>
          </SectionCard>

          <SectionCard icon={Phone} title="Common Financial Frauds">
            <p>Be cautious of callers claiming to be Bank Officials, Loan Officers, Insurance Representatives, RBI Representatives, Income Tax Officers, or Credit Card Teams.</p>
            <p className="font-semibold text-[var(--brand-black)]">Never trust anyone who:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Promises guaranteed loan approvals</li>
              <li>Requests OTPs or passwords</li>
              <li>Demands urgent payments</li>
              <li>Threatens account suspension</li>
              <li>Asks for remote access to your phone or computer</li>
            </ul>
          </SectionCard>

          <SectionCard icon={Banknote} title="Loan & Funding Fraud Awareness">
            <p className="font-semibold text-[var(--brand-black)]">Before applying for any loan:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verify the institution</li>
              <li>Verify payment instructions</li>
              <li>Confirm processing charges officially</li>
              <li>Review all documents carefully</li>
            </ul>
            <p className="font-semibold text-[var(--brand-black)] mt-3">Never transfer money to personal accounts for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Loan approval</li>
              <li>Credit limit enhancement</li>
              <li>Funding guarantees</li>
              <li>Sanction letter issuance</li>
            </ul>
            <div className="bg-[var(--brand-yellow-soft)]/30 border border-[var(--brand-yellow-soft)] rounded-lg p-4 mt-3">
              <p className="font-semibold text-[var(--brand-black)]">Important</p>
              <p className="text-sm mt-1">X Capital does not guarantee approvals, sanctions, or interest rates. All approvals remain subject to the policies and discretion of the respective financial institution.</p>
            </div>
          </SectionCard>

          <SectionCard icon={Landmark} title="Fixed Deposit & Treasury Safety Tips">
            <p className="font-semibold text-[var(--brand-black)]">Before investing:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verify the financial institution</li>
              <li>Confirm account details</li>
              <li>Review FD terms and conditions</li>
              <li>Obtain official receipts and confirmations</li>
              <li>Ensure investments are made through regulated institutions</li>
            </ul>
            <p className="italic text-sm">Always verify investment opportunities before proceeding.</p>
          </SectionCard>

          <SectionCard icon={FileLock2} title="Protect Your Personal & Financial Documents">
            <p>Treat the following documents as confidential:</p>
            <div className="grid sm:grid-cols-2 gap-2 mt-2">
              {["PAN Card","Aadhaar Card","Passport","Bank Statements","ITR Documents","GST Returns","Financial Statements","Loan Sanction Letters"].map((x) => (
                <div key={x} className="bg-[var(--brand-yellow-soft)]/20 border border-[var(--brand-yellow-soft)] rounded-md p-2.5 text-sm">{x}</div>
              ))}
            </div>
            <p className="font-medium text-[var(--brand-black)] mt-3">Share documents only through verified and secure channels.</p>
          </SectionCard>

          <SectionCard icon={AlertTriangle} title="Warning Signs of Financial Fraud">
            <ul className="list-disc pl-5 space-y-1">
              <li>Guaranteed approvals</li>
              <li>Unrealistically low interest rates</li>
              <li>Pressure to act immediately</li>
              <li>Requests for confidential information</li>
              <li>Unverified payment accounts</li>
              <li>Fake websites or domains</li>
              <li>Too-good-to-be-true offers</li>
            </ul>
            <p className="font-semibold text-[var(--brand-black)] mt-2">If something feels suspicious, stop and verify before proceeding.</p>
          </SectionCard>

          <SectionCard icon={UserCheck} title="Customer Rights">
            <p>As a valued client, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fair Treatment</li>
              <li>Transparent Communication</li>
              <li>Privacy & Confidentiality</li>
              <li>Clear Product Information</li>
              <li>Grievance Redressal</li>
              <li>Ethical Business Practices</li>
            </ul>
            <p>X Capital is committed to maintaining the highest standards of professionalism and transparency in every client interaction.</p>
          </SectionCard>

          <SectionCard icon={Siren} title="If You Suspect Fraud">
            <p>Immediately:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Stop all communication.</li>
              <li>Do not share additional information.</li>
              <li>Contact your bank immediately.</li>
              <li>Block affected cards or accounts.</li>
              <li>Report the incident to the relevant authorities.</li>
              <li>Inform X Capital if our name, logo, or representatives are being misused.</li>
            </ol>
          </SectionCard>

          <SectionCard icon={BookOpen} title="Helpful RBI Resources">
            <p>At X Capital, we encourage our clients to stay informed through official regulatory resources.</p>
            <div className="space-y-3 mt-2">
              {[
                { name: "RBI Financial Education Portal", desc: "Learn about banking, digital payments, customer rights, cyber security, and financial literacy.", url: "https://www.rbi.org.in/financialeducation/" },
                { name: "RBI Complaint Management System (CMS)", desc: "Submit complaints against regulated entities if your grievance remains unresolved.", url: "https://cms.rbi.org.in" },
                { name: "RBI UDGAM Portal", desc: "Search for unclaimed deposits across participating banks.", url: "https://udgam.rbi.org.in" },
                { name: "RBI Consumer Awareness Resources", desc: "Access educational content on safe banking and fraud prevention.", url: "https://www.rbi.org.in/financialeducation/" },
                { name: "Additional Digital Awareness Resource", desc: "For further awareness and educational guidance, clients may also refer to this resource.", url: "https://www.shriramfinance.in/rbi-digital-awareness" },
              ].map((r) => (
                <div key={r.url + r.name} className="border border-border rounded-lg p-4 hover:border-[var(--brand-yellow)] transition-colors">
                  <p className="font-semibold text-[var(--brand-black)]">{r.name}</p>
                  <p className="text-sm mt-1">{r.desc}</p>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--brand-black)] hover:text-[var(--brand-yellow)] underline break-all mt-1 inline-block">
                    {r.url}
                  </a>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="bg-muted/30 border border-border rounded-lg p-5 space-y-2">
            <p className="font-bold text-[var(--brand-black)]">Important Disclaimer</p>
            <p className="text-sm">X Capital is an independent financial advisory, banking facilitation, and treasury solutions company.</p>
            <p className="text-sm">X Capital is not affiliated with, endorsed by, authorized by, or acting on behalf of the Reserve Bank of India (RBI), Shriram Finance Limited, or any other financial institution unless specifically stated.</p>
            <p className="text-sm">The external links provided above are for educational and awareness purposes only. Users are encouraged to verify information directly through official sources before making financial decisions.</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">Our Commitment</h2>
            <p>At X Capital, we are committed to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Financial Awareness</li>
              <li>Client Protection</li>
              <li>Data Confidentiality</li>
              <li>Ethical Financial Advisory</li>
              <li>Transparent Communication</li>
              <li>Responsible Banking Practices</li>
            </ul>
          </div>

          <div className="bg-[var(--brand-yellow-soft)]/10 p-6 rounded-lg border border-border space-y-2">
            <p className="font-bold text-[var(--brand-black)]">X CAPITAL</p>
            <p className="text-sm text-foreground/80">Strategic Banking, Lending & Treasury Solutions</p>
            <p className="text-sm italic">Structured Capital. Trusted Relationships.</p>
            <div className="font-semibold text-[var(--brand-black)] space-y-1 pt-2">
              <p>📞 +91 88791 09148</p>
              <p>📧 info@xcapital.co.in</p>
              <p>🌐 www.xcapital.co.in</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border text-center">
            <p className="font-semibold text-[var(--brand-yellow)]">"Financial Awareness Today. Financial Security Tomorrow."</p>
          </div>

        </div>
      </section>
    </SiteLayout>
  );
}