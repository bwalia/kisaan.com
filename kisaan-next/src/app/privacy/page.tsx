export const metadata = {
  title: "Privacy Policy | Kisaan",
  description: "Learn how Kisaan collects, uses, and protects your personal information in compliance with UK GDPR.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-300">
              Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Introduction</h2>
              <p className="text-gray-700 mb-6">
                Kisaan ("we," "our," or "us") is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
              <p className="text-gray-700 mb-6">
                <strong>Data Controller:</strong> Kisaan Limited<br />
                <strong>Registered Address:</strong> [Your registered office address]<br />
                <strong>ICO Registration Number:</strong> [Your ICO registration number]<br />
                <strong>Contact Email:</strong> privacy@kisaan.com
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">2. Information We Collect</h2>
              
              <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">2.1 Personal Data You Provide</h3>
              <p className="text-gray-700 mb-4">We collect personal data that you voluntarily provide when you:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Register for an account</li>
                <li>Make a purchase</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact customer support</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p className="text-gray-700 mb-6">
                This may include: name, email address, postal address, phone number, payment information, and delivery preferences.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">2.2 Automatically Collected Data</h3>
              <p className="text-gray-700 mb-4">When you use our website, we automatically collect:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, links clicked)</li>
                <li>Location data (approximate location based on IP address)</li>
                <li>Cookies and similar tracking technologies (see our Cookie Policy)</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">3. Legal Basis for Processing</h2>
              <p className="text-gray-700 mb-4">We process your personal data based on the following legal grounds under UK GDPR:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Contract Performance:</strong> To fulfill our contract with you (processing orders, delivery)</li>
                <li><strong>Legitimate Interests:</strong> To improve our services, prevent fraud, and ensure security</li>
                <li><strong>Legal Obligation:</strong> To comply with legal requirements (tax, accounting)</li>
                <li><strong>Consent:</strong> For marketing communications (you can withdraw consent at any time)</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">4. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use your personal data to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send transactional emails (order confirmations, shipping updates)</li>
                <li>Improve our website and services</li>
                <li>Personalize your shopping experience</li>
                <li>Prevent fraud and ensure security</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">5. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">We may share your personal data with:</p>
              
              <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">5.1 Service Providers</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Payment processors (Stripe, PayPal)</li>
                <li>Delivery companies (Royal Mail, DPD, Hermes)</li>
                <li>Email service providers</li>
                <li>Cloud hosting providers</li>
                <li>Analytics providers (Google Analytics)</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">5.2 Legal Requirements</h3>
              <p className="text-gray-700 mb-6">
                We may disclose your information if required by law, court order, or to protect our rights and safety or that of others.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">5.3 Business Transfers</h3>
              <p className="text-gray-700 mb-6">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">6. International Data Transfers</h2>
              <p className="text-gray-700 mb-6">
                Your personal data may be transferred to and processed in countries outside the UK. When we do so, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the UK authorities or adequacy decisions recognizing equivalent data protection standards.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">7. Data Retention</h2>
              <p className="text-gray-700 mb-6">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Typically:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Account information: Until account deletion + 6 years (for legal obligations)</li>
                <li>Order information: 6 years (for tax and accounting purposes)</li>
                <li>Marketing consent: Until you withdraw consent or 2 years of inactivity</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">8. Your Rights Under UK GDPR</h2>
              <p className="text-gray-700 mb-4">You have the following rights:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Right to Restriction:</strong> Limit how we process your data</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or direct marketing</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
                <li><strong>Right to Lodge a Complaint:</strong> File a complaint with the ICO (Information Commissioner's Office)</li>
              </ul>
              <p className="text-gray-700 mb-6">
                To exercise these rights, contact us at privacy@kisaan.com. We will respond within one month.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">9. Data Security</h2>
              <p className="text-gray-700 mb-6">
                We implement appropriate technical and organizational measures to protect your personal data, including:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure servers with firewall protection</li>
                <li>Access controls and authentication</li>
                <li>Regular security assessments and updates</li>
                <li>Staff training on data protection</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">10. Children's Privacy</h2>
              <p className="text-gray-700 mb-6">
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal data from children. If you believe we have collected data from a child, please contact us immediately.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">11. Third-Party Links</h2>
              <p className="text-gray-700 mb-6">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these sites. We encourage you to review their privacy policies.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">12. Changes to This Policy</h2>
              <p className="text-gray-700 mb-6">
                We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a prominent notice on our website. The "Last updated" date at the top indicates when changes were last made.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">13. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@kisaan.com<br />
                  <strong>Post:</strong> Data Protection Officer, Kisaan Limited, [Address]<br />
                  <strong>Phone:</strong> +44 (0) 800 123 4567
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">14. Supervisory Authority</h2>
              <p className="text-gray-700 mb-4">
                You have the right to lodge a complaint with the UK supervisory authority:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700">
                  <strong>Information Commissioner's Office (ICO)</strong><br />
                  Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF<br />
                  Tel: 0303 123 1113<br />
                  Website: <a href="https://ico.org.uk" className="text-[#16a34a] hover:underline">www.ico.org.uk</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
