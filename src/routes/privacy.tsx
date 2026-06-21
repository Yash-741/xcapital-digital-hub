import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — XCapital" },
      { name: "description", content: "Learn how XCapital collects, uses, processes and protects your personal and financial information." },
      { property: "og:title", content: "Privacy Policy — XCapital" },
      { property: "og:description", content: "At XCapital, we are committed to protecting the privacy, confidentiality, and security of your personal and financial information." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { tEn } = useI18n();

  return (
    <SiteLayout>
      <PageHeader
        eyebrow={tEn("Security & Trust")}
        title={tEn("Privacy Policy")}
        subtitle={tEn("At X Capital, we value your trust and are committed to protecting the privacy, confidentiality, and security of your personal and financial information.")}
      />

      <section className="container-x py-10 md:py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-card border border-border p-6 md:p-10 space-y-8 leading-relaxed text-sm md:text-base text-foreground/80">
          
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            <div className="h-10 w-10 rounded-lg grid place-items-center bg-[var(--brand-yellow-soft)] text-[var(--brand-black)]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{tEn("Last Updated")}</p>
              <p className="text-sm font-semibold text-[var(--brand-black)]">June 2026</p>
            </div>
          </div>

          <p>
            This Privacy Policy explains how we collect, use, store, process, and protect information shared with us through our website, digital platforms, communications, and services.
          </p>

          <p>
            By accessing our website or using our services, you consent to the practices described in this Privacy Policy.
          </p>

          <hr className="border-border" />

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">1. About X Capital</h2>
            <p>
              X Capital is a strategic banking, lending, and treasury solutions company that assists businesses, professionals, entrepreneurs, investors, and individuals in identifying suitable financial solutions through its network of banks, NBFCs, and financial institutions.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">2. Information We Collect</h2>
            <p>We may collect information including, but not limited to:</p>
            
            <div className="grid gap-6 md:grid-cols-2 mt-4">
              <div className="bg-[var(--brand-yellow-soft)]/20 p-5 rounded-lg border border-[var(--brand-yellow-soft)]">
                <h3 className="font-bold text-[var(--brand-black)] mb-2">Personal Information</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Full Name</li>
                  <li>Mobile Number</li>
                  <li>Email Address</li>
                  <li>Residential Address</li>
                  <li>Business Address</li>
                </ul>
              </div>

              <div className="bg-[var(--brand-yellow-soft)]/20 p-5 rounded-lg border border-[var(--brand-yellow-soft)]">
                <h3 className="font-bold text-[var(--brand-black)] mb-2">Business Information</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Company Name</li>
                  <li>Business Constitution</li>
                  <li>Industry Details</li>
                  <li>GST Information</li>
                  <li>Turnover Details</li>
                </ul>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-4">
              <div className="bg-[var(--brand-yellow-soft)]/20 p-5 rounded-lg border border-[var(--brand-yellow-soft)]">
                <h3 className="font-bold text-[var(--brand-black)] mb-2">Financial Information</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Bank Statements</li>
                  <li>Income Tax Returns (ITR)</li>
                  <li>GST Returns</li>
                  <li>Financial Statements</li>
                  <li>Credit Information</li>
                  <li>Loan Details</li>
                </ul>
              </div>

              <div className="bg-[var(--brand-yellow-soft)]/20 p-5 rounded-lg border border-[var(--brand-yellow-soft)]">
                <h3 className="font-bold text-[var(--brand-black)] mb-2">Technical Information</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>IP Address</li>
                  <li>Browser Information</li>
                  <li>Device Information</li>
                  <li>Website Usage Data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">3. How We Use Your Information</h2>
            <p>Information collected may be used for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Assessing eligibility for financial solutions</li>
              <li>Identifying suitable banks and financial institutions</li>
              <li>Processing enquiries and applications</li>
              <li>Verifying information and documentation</li>
              <li>Communicating with clients</li>
              <li>Improving our services</li>
              <li>Meeting legal and regulatory obligations</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">4. Sharing of Information</h2>
            <p>To facilitate financial solutions, X Capital may share information with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Banks</li>
              <li>NBFCs</li>
              <li>Financial Institutions</li>
              <li>Credit Information Companies</li>
              <li>Verification Agencies</li>
              <li>Technology Service Providers</li>
              <li>Regulatory Authorities where required by law</li>
            </ul>
            <p className="font-medium text-[var(--brand-black)] mt-2">
              We do not sell, rent, or trade client information to third parties for commercial purposes.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">5. Data Security</h2>
            <p>X Capital takes reasonable measures to safeguard client information through:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Restricted access controls</li>
              <li>Secure storage systems</li>
              <li>Password-protected databases</li>
              <li>Confidentiality protocols</li>
              <li>Internal data protection practices</li>
            </ul>
            <p className="italic text-xs text-muted-foreground mt-2">
              While we strive to protect information, no electronic transmission or storage system can be guaranteed to be completely secure.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">6. Confidentiality Commitment</h2>
            <p>All client information and documents are treated as confidential.</p>
            <p>Information will only be used for purposes directly related to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Financial assessment</li>
              <li>Banking coordination</li>
              <li>Treasury advisory</li>
              <li>Application processing</li>
              <li>Regulatory compliance</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">7. Communication Consent</h2>
            <p>By submitting your information, you authorize X Capital to contact you through:</p>
            <ul className="list-disc pl-5 space-y-1 font-medium text-[var(--brand-black)]">
              <li>Phone Calls</li>
              <li>SMS</li>
              <li>WhatsApp</li>
              <li>Email</li>
              <li>Other electronic communication channels</li>
            </ul>
            <p>for service-related updates, application processing, and relevant financial opportunities.</p>
            <p>You may opt out of promotional communications at any time.</p>
          </div>

          {/* Section 8 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">8. Cookies & Website Analytics</h2>
            <p>Our website may use cookies and analytics tools to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Improve user experience</li>
              <li>Analyze website performance</li>
              <li>Understand visitor behavior</li>
              <li>Enhance website functionality</li>
            </ul>
            <p>Users may modify browser settings to manage cookie preferences.</p>
          </div>

          {/* Section 9 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">9. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites.</p>
            <p>
              X Capital is not responsible for the privacy practices or content of external websites. Users are encouraged to review the privacy policies of such websites independently.
            </p>
          </div>

          {/* Section 10 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">10. Data Retention</h2>
            <p>We may retain client information for as long as necessary to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide services</li>
              <li>Maintain records</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce agreements</li>
            </ul>
          </div>

          {/* Section 11 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">11. Your Rights</h2>
            <p>Subject to applicable laws, you may:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Request access to your information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request updates to your information</li>
              <li>Withdraw consent for certain communications</li>
            </ul>
            <p>Requests may be submitted to our support team.</p>
          </div>

          {/* Section 12 */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--brand-black)]">12. Changes to This Policy</h2>
            <p>
              X Capital reserves the right to modify this Privacy Policy at any time. Any updates will be published on this page and become effective immediately upon publication.
            </p>
          </div>

          {/* Section 13 */}
          <div className="bg-[var(--brand-yellow-soft)]/10 p-6 rounded-lg border border-border space-y-3">
            <h2 className="text-lg font-bold text-[var(--brand-black)]">13. Contact Us</h2>
            <p>For questions regarding this Privacy Policy or the handling of your information, please contact:</p>
            <div className="font-semibold text-[var(--brand-black)] space-y-1">
              <p>X CAPITAL</p>
              <p className="text-sm text-foreground/80 font-normal">Strategic Banking, Lending & Treasury Solutions</p>
              <p>📞 +91 88791 09148</p>
              <p>📧 info@xcapital.co.in</p>
              <p>🌐 www.xcapital.co.in</p>
            </div>
          </div>

          <div className="pt-6 border-t border-border text-center space-y-2">
            <p className="font-bold text-[var(--brand-black)]">Our Commitment</p>
            <p className="italic">
              "At X Capital, protecting your information is not just a legal responsibility—it is a commitment to the trust you place in us."
            </p>
            <p className="font-semibold text-[var(--brand-yellow)]">"Structured Capital. Trusted Relationships."</p>
          </div>

        </div>
      </section>
    </SiteLayout>
  );
}
