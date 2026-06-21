import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";
import { Scale } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — XCapital" },
      { name: "description", content: "Terms of use, service details, limitations of liability, and client declarations for XCapital." },
      { property: "og:title", content: "Terms & Conditions — XCapital" },
      { property: "og:description", content: "Welcome to X Capital. By accessing our website, submitting an enquiry, or using our services, you agree to be bound by these Terms & Conditions." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { tEn } = useI18n();

  return (
    <SiteLayout>
      <PageHeader
        eyebrow={tEn("Agreement")}
        title={tEn("Terms & Conditions")}
        subtitle={tEn("Welcome to X Capital. By accessing our website, submitting an enquiry, sharing information, or using our services, you agree to be bound by these Terms & Conditions.")}
      />

      <section className="container-x py-10 md:py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-card border border-border p-6 md:p-10 space-y-8 leading-relaxed text-sm md:text-base text-foreground/80">
          
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            <div className="h-10 w-10 rounded-lg grid place-items-center bg-[var(--brand-yellow-soft)] text-[var(--brand-black)]">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{tEn("Effective Date")}</p>
              <p className="text-sm font-semibold text-[var(--brand-black)]">June 2026</p>
            </div>
          </div>

          <p>
            If you do not agree with any part of these Terms, please refrain from using our website and services.
          </p>

          <hr className="border-border" />

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">1. About X Capital</h2>
            <p>
              X Capital is a strategic banking, lending, and treasury solutions company that assists businesses, professionals, entrepreneurs, investors, and individuals in identifying suitable financial solutions through its network of banks, NBFCs, and financial institutions.
            </p>
            <p className="font-semibold text-[var(--brand-black)]">
              X Capital acts as a facilitator, advisor, and relationship manager and does not directly lend money, accept deposits, provide regulated investment products, or guarantee approvals.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">2. Scope of Services</h2>
            <p>Our services may include:</p>
            
            <div className="grid gap-6 md:grid-cols-2 mt-4">
              <div className="bg-[var(--brand-yellow-soft)]/20 p-5 rounded-lg border border-[var(--brand-yellow-soft)]">
                <h3 className="font-bold text-[var(--brand-black)] mb-2">Lending Solutions</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Business Loans</li>
                  <li>MSME Funding</li>
                  <li>Working Capital Finance</li>
                  <li>Loan Against Property (LAP)</li>
                  <li>Home Loans</li>
                  <li>Credit Facilities</li>
                </ul>
              </div>

              <div className="bg-[var(--brand-yellow-soft)]/20 p-5 rounded-lg border border-[var(--brand-yellow-soft)]">
                <h3 className="font-bold text-[var(--brand-black)] mb-2">Banking Solutions</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Cash Credit (CC)</li>
                  <li>Overdraft Facilities (OD)</li>
                  <li>Banking Relationship Management</li>
                  <li>Credit Enhancement Support</li>
                </ul>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-4">
              <div className="bg-[var(--brand-yellow-soft)]/20 p-5 rounded-lg border border-[var(--brand-yellow-soft)]">
                <h3 className="font-bold text-[var(--brand-black)] mb-2">Treasury Solutions</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Fixed Deposit Solutions</li>
                  <li>Treasury Advisory</li>
                  <li>Liquidity Planning</li>
                  <li>Banking Optimization</li>
                </ul>
              </div>

              <div className="bg-[var(--brand-yellow-soft)]/20 p-5 rounded-lg border border-[var(--brand-yellow-soft)]">
                <h3 className="font-bold text-[var(--brand-black)] mb-2">Financial Advisory</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Financial Structuring</li>
                  <li>Funding Strategy</li>
                  <li>Capital Access Facilitation</li>
                </ul>
              </div>
            </div>

            <p className="italic text-xs text-muted-foreground">
              All products remain subject to the policies, eligibility criteria, risk assessment, and approval processes of the respective financial institution.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">3. No Guarantee of Approval</h2>
            <p>X Capital does not guarantee:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Loan approval</li>
              <li>Sanction amount</li>
              <li>Interest rate</li>
              <li>Processing timeline</li>
              <li>Product availability</li>
              <li>Treasury returns</li>
              <li>Credit limits</li>
            </ul>
            <p>All decisions are solely at the discretion of the concerned bank, NBFC, or financial institution.</p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">4. Client Declaration</h2>
            <p>By engaging with X Capital, the client confirms that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>All information provided is true and accurate.</li>
              <li>All documents submitted are genuine and valid.</li>
              <li>No material information has been intentionally withheld.</li>
              <li>The client has the legal authority to share the information and documents submitted.</li>
            </ul>
            <p className="font-medium text-[var(--brand-black)] mt-2">
              Submission of false, misleading, incomplete, or fraudulent information may result in rejection of services and termination of engagement.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">5. Consent to Verification</h2>
            <p>
              The client authorizes X Capital and its partner institutions to verify information through:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Banks</li>
              <li>Financial Institutions</li>
              <li>Credit Bureaus</li>
              <li>Regulatory Databases</li>
              <li>Verification Agencies</li>
            </ul>
            <p>where required for evaluation and processing purposes.</p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">6. Privacy & Confidentiality</h2>
            <p>X Capital is committed to maintaining the confidentiality and security of client information.</p>
            <p>Information shared by clients may be used solely for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Financial assessment</li>
              <li>Product evaluation</li>
              <li>Processing applications</li>
              <li>Banking coordination</li>
              <li>Treasury advisory</li>
            </ul>
            <p>
              Information may be shared with relevant banks, NBFCs, financial institutions, credit bureaus, verification agencies, and service providers only when necessary for processing the client's request.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">7. Communication Consent</h2>
            <p>By submitting your details, you authorize X Capital to communicate with you through:</p>
            <ul className="list-disc pl-5 space-y-1 font-semibold text-[var(--brand-black)]">
              <li>Telephone Calls</li>
              <li>SMS</li>
              <li>WhatsApp</li>
              <li>Email</li>
              <li>Digital Communication Platforms</li>
            </ul>
            <p>for service updates, application status, document requests, and relevant financial opportunities.</p>
            <p>You may opt out of promotional communications at any time.</p>
          </div>

          {/* Section 8 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">8. Fees & Charges</h2>
            <p>Certain services may be offered free of charge, while others may involve advisory, facilitation, or consulting fees.</p>
            <p>Where applicable:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fees will be communicated in advance.</li>
              <li>No hidden charges will be imposed.</li>
              <li>Third-party charges imposed by banks or institutions shall be payable directly to such institutions unless otherwise agreed.</li>
            </ul>
          </div>

          {/* Section 9 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">9. Third-Party Products & Services</h2>
            <p>X Capital may facilitate access to products offered by third-party institutions. X Capital does not own, control, or guarantee:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Bank products</li>
              <li>NBFC products</li>
              <li>Insurance products</li>
              <li>Investment products</li>
              <li>Third-party services</li>
            </ul>
            <p>
              Clients are advised to independently review all terms and conditions provided by the respective institution before proceeding.
            </p>
          </div>

          {/* Section 10 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">10. Fair Treatment Commitment</h2>
            <p>X Capital is committed to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fair and respectful treatment of all clients.</li>
              <li>Transparent communication.</li>
              <li>Honest and ethical business practices.</li>
              <li>Professional handling of client information.</li>
              <li>Providing suitable financial solutions based on client requirements.</li>
            </ul>
          </div>

          {/* Section 11 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">11. Customer Responsibilities</h2>
            <p>Clients are expected to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide accurate information.</li>
              <li>Submit documents on time.</li>
              <li>Cooperate during verification and assessment.</li>
              <li>Review all product terms before acceptance.</li>
              <li>Comply with applicable laws and regulations.</li>
            </ul>
          </div>

          {/* Section 12 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">12. Intellectual Property</h2>
            <p>
              All content, branding, logos, graphics, designs, documents, brochures, and website materials are the intellectual property of X Capital.
            </p>
            <p className="font-semibold text-[var(--brand-black)]">
              No content may be copied, reproduced, distributed, or modified without prior written permission.
            </p>
          </div>

          {/* Section 13 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">13. Limitation of Liability</h2>
            <p>X Capital shall not be liable for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Loan rejections</li>
              <li>Delayed approvals</li>
              <li>Changes in policies of financial institutions</li>
              <li>Market-related fluctuations</li>
              <li>Technical disruptions</li>
              <li>Decisions made by third-party institutions</li>
              <li>Indirect or consequential losses</li>
            </ul>
            <p className="italic text-sm">
              The client acknowledges that final decisions regarding products and services are made by the respective financial institution.
            </p>
          </div>

          {/* Section 14 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">14. Grievance Redressal</h2>
            <p>X Capital values client feedback and is committed to resolving concerns promptly. For complaints or grievances, clients may contact:</p>
            <div className="font-semibold text-[var(--brand-black)] space-y-1">
              <p>📧 info@xcapital.co.in</p>
              <p>📞 +91 88791 09148</p>
            </div>
            <p>We aim to acknowledge and address complaints within a reasonable timeframe.</p>
          </div>

          {/* Section 15 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">15. Amendments</h2>
            <p>
              X Capital reserves the right to update, modify, or revise these Terms & Conditions at any time without prior notice. Any changes will become effective immediately upon publication on the website.
            </p>
          </div>

          {/* Section 16 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">16. Governing Law & Jurisdiction</h2>
            <p>
              These Terms & Conditions shall be governed by and construed in accordance with the laws of India.
            </p>
            <p>
              Any dispute arising out of or relating to the use of this website, our services, or these Terms & Conditions shall be subject to the exclusive jurisdiction of the competent courts located in Mumbai, Maharashtra.
            </p>
          </div>

          {/* Contact Details */}
          <div className="bg-[var(--brand-yellow-soft)]/10 p-6 rounded-lg border border-border space-y-3">
            <h2 className="text-lg font-bold text-[var(--brand-black)]">Contact Us</h2>
            <div className="font-semibold text-[var(--brand-black)] space-y-1">
              <p>X CAPITAL</p>
              <p className="text-sm text-foreground/80 font-normal">Strategic Banking, Lending & Treasury Solutions</p>
              <p>📞 +91 88791 09148</p>
              <p>📧 info@xcapital.co.in</p>
              <p>🌐 www.xcapital.co.in</p>
            </div>
          </div>

          <div className="pt-6 border-t border-border text-center space-y-2">
            <p className="font-semibold text-[var(--brand-yellow)]">"Structured Capital. Trusted Relationships."</p>
          </div>

        </div>
      </section>
    </SiteLayout>
  );
}
