export const metadata = {
  title: "Terms and Conditions | Kisaan",
  description: "Read Kisaan's terms and conditions for using our organic food marketplace and services.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
            <p className="text-xl text-green-300">
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
                Welcome to Kisaan, the organic food marketplace. These Terms and Conditions ("Terms") govern your use of our website, mobile application, and services (collectively, the "Service") operated by Kisaan Limited ("we," "our," or "us").
              </p>
              <p className="text-gray-700 mb-6">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-6">
                By creating an account, making a purchase, or using any part of our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">3. User Accounts</h2>
              <div className="text-gray-700 mb-6">
                <h3 className="text-xl font-semibold mb-3">3.1 Account Creation</h3>
                <p className="mb-3">
                  To use certain features of our Service, you must register for an account. You must provide accurate, current, and complete information during the registration process.
                </p>
                <h3 className="text-xl font-semibold mb-3">3.2 Account Security</h3>
                <p className="mb-3">
                  You are responsible for safeguarding your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
                </p>
                <h3 className="text-xl font-semibold mb-3">3.3 Account Types</h3>
                <ul className="list-disc pl-6 mb-3">
                  <li><strong>Buyers:</strong> Individuals purchasing organic products</li>
                  <li><strong>Sellers:</strong> Verified organic farmers and producers</li>
                  <li><strong>Admin:</strong> Platform administrators</li>
                </ul>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Marketplace Services</h2>
              <div className="text-gray-700 mb-6">
                <h3 className="text-xl font-semibold mb-3">4.1 Platform Purpose</h3>
                <p className="mb-3">
                  Kisaan is a marketplace that connects organic food producers with consumers. We facilitate transactions but are not directly involved in the actual sale between buyers and sellers.
                </p>
                <h3 className="text-xl font-semibold mb-3">4.2 Product Listings</h3>
                <p className="mb-3">
                  Sellers are responsible for the accuracy of their product listings, including descriptions, prices, availability, and organic certifications.
                </p>
                <h3 className="text-xl font-semibold mb-3">4.3 Organic Certification</h3>
                <p className="mb-3">
                  All sellers must provide valid organic certification documentation. We reserve the right to verify and remove listings that do not meet organic standards.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Orders and Payments</h2>
              <div className="text-gray-700 mb-6">
                <h3 className="text-xl font-semibold mb-3">5.1 Order Placement</h3>
                <p className="mb-3">
                  By placing an order, you make an offer to purchase products. Orders are subject to seller acceptance and product availability.
                </p>
                <h3 className="text-xl font-semibold mb-3">5.2 Payment Processing</h3>
                <p className="mb-3">
                  Payments are processed securely through our payment partners. We accept major credit cards, debit cards, and other payment methods as displayed at checkout.
                </p>
                <h3 className="text-xl font-semibold mb-3">5.3 Pricing and Fees</h3>
                <p className="mb-3">
                  All prices are displayed in British Pounds (GBP) and include applicable taxes. Delivery fees and service charges will be clearly displayed before checkout.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Delivery and Returns</h2>
              <div className="text-gray-700 mb-6">
                <h3 className="text-xl font-semibold mb-3">6.1 Delivery</h3>
                <p className="mb-3">
                  Delivery times and costs vary by seller and location. Estimated delivery times are provided at checkout and may be subject to change due to weather or other circumstances.
                </p>
                <h3 className="text-xl font-semibold mb-3">6.2 Returns and Refunds</h3>
                <p className="mb-3">
                  Due to the perishable nature of organic food products, returns are generally not accepted unless products are damaged, defective, or not as described. Please contact us within 24 hours of delivery for any issues.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Seller Obligations</h2>
              <div className="text-gray-700 mb-6">
                <h3 className="text-xl font-semibold mb-3">7.1 Seller Requirements</h3>
                <ul className="list-disc pl-6 mb-3">
                  <li>Valid organic certification from recognized bodies</li>
                  <li>Compliance with UK food safety regulations</li>
                  <li>Accurate product descriptions and pricing</li>
                  <li>Timely order fulfillment and communication</li>
                </ul>
                <h3 className="text-xl font-semibold mb-3">7.2 Commission and Fees</h3>
                <p className="mb-3">
                  Sellers agree to pay platform commission fees as outlined in the Seller Agreement. Commission rates are transparently displayed in the seller dashboard.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Prohibited Uses</h2>
              <div className="text-gray-700 mb-6">
                <p className="mb-3">You may not use our Service:</p>
                <ul className="list-disc pl-6 mb-3">
                  <li>To violate any laws or regulations</li>
                  <li>To sell non-organic products as organic</li>
                  <li>To upload harmful, offensive, or inappropriate content</li>
                  <li>To interfere with the proper functioning of the Service</li>
                  <li>To collect user data without permission</li>
                  <li>To engage in fraudulent activities</li>
                </ul>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Intellectual Property</h2>
              <div className="text-gray-700 mb-6">
                <p className="mb-3">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of Kisaan Limited and its licensors. The Service is protected by copyright, trademark, and other laws.
                </p>
                <p className="mb-3">
                  Users retain ownership of content they upload but grant us a license to use, display, and distribute such content on our platform.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-6">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your personal data.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">11. Limitation of Liability</h2>
              <div className="text-gray-700 mb-6">
                <p className="mb-3">
                  To the maximum extent permitted by law, Kisaan Limited shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
                </p>
                <p className="mb-3">
                  Our liability for direct damages shall not exceed the amount paid by you for the specific service or product that gave rise to the claim.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">12. Dispute Resolution</h2>
              <div className="text-gray-700 mb-6">
                <h3 className="text-xl font-semibold mb-3">12.1 Customer Support</h3>
                <p className="mb-3">
                  We encourage users to contact our customer support team to resolve any issues before pursuing formal dispute resolution.
                </p>
                <h3 className="text-xl font-semibold mb-3">12.2 Governing Law</h3>
                <p className="mb-3">
                  These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">13. Termination</h2>
              <div className="text-gray-700 mb-6">
                <p className="mb-3">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or the Service.
                </p>
                <p className="mb-3">
                  You may terminate your account at any time by contacting our customer support or using the account deletion feature in your settings.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">14. Changes to Terms</h2>
              <p className="text-gray-700 mb-6">
                We reserve the right to modify or replace these Terms at any time. We will provide notice of significant changes by email or through a prominent notice on our Service. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">15. Contact Information</h2>
              <div className="text-gray-700 mb-6">
                <p className="mb-3">If you have any questions about these Terms and Conditions, please contact us:</p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="mb-2"><strong>Kisaan Limited</strong></p>
                  <p className="mb-2">Email: legal@kisaan.com</p>
                  <p className="mb-2">Customer Support: support@kisaan.com</p>
                  <p className="mb-2">Phone: +44 (0) 20 1234 5678</p>
                  <p>Address: 123 Organic Street, London, E1 6AN, United Kingdom</p>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg mt-8">
                <p className="text-sm text-gray-600 text-center">
                  By using Kisaan, you acknowledge that you have read and understood these Terms and Conditions and agree to be bound by them.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}