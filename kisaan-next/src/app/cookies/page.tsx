export const metadata = {
  title: "Cookie Policy | Kisaan",
  description: "Learn about how Kisaan uses cookies and similar technologies in compliance with UK PECR regulations.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. What Are Cookies?</h2>
              <p className="text-gray-700 mb-6">
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. Cookies help us understand how you use our website and improve your experience.
              </p>
              <p className="text-gray-700 mb-6">
                This Cookie Policy explains what cookies are, how we use them on our website, and your choices regarding cookies, in compliance with the UK Privacy and Electronic Communications Regulations (PECR) and UK GDPR.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">2. Why We Use Cookies</h2>
              <p className="text-gray-700 mb-4">We use cookies to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Enable essential website functionality</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze how you use our website</li>
                <li>Improve website performance and user experience</li>
                <li>Provide personalized content and advertising</li>
                <li>Measure the effectiveness of our marketing campaigns</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">3. Types of Cookies We Use</h2>

              <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">3.1 Strictly Necessary Cookies</h3>
              <p className="text-gray-700 mb-6">
                <strong>Purpose:</strong> These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.<br />
                <strong>Examples:</strong> Session cookies, authentication cookies, security cookies<br />
                <strong>Legal Basis:</strong> These cookies are exempt from consent requirements under PECR as they are strictly necessary for the service you request.<br />
                <strong>Duration:</strong> Session (deleted when browser closes) or up to 1 year
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">3.2 Performance Cookies</h3>
              <p className="text-gray-700 mb-6">
                <strong>Purpose:</strong> These cookies collect information about how visitors use our website, such as which pages are visited most often. This helps us improve website performance.<br />
                <strong>Examples:</strong> Google Analytics cookies (_ga, _gid)<br />
                <strong>Legal Basis:</strong> These cookies require your consent.<br />
                <strong>Duration:</strong> Up to 2 years
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">3.3 Functionality Cookies</h3>
              <p className="text-gray-700 mb-6">
                <strong>Purpose:</strong> These cookies allow the website to remember choices you make (such as your language or region) and provide enhanced, personalized features.<br />
                <strong>Examples:</strong> Language preference cookies, user interface customization<br />
                <strong>Legal Basis:</strong> These cookies require your consent.<br />
                <strong>Duration:</strong> Up to 1 year
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">3.4 Targeting/Advertising Cookies</h3>
              <p className="text-gray-700 mb-6">
                <strong>Purpose:</strong> These cookies are used to deliver advertisements relevant to you and your interests. They also limit the number of times you see an advertisement and help measure advertising campaign effectiveness.<br />
                <strong>Examples:</strong> Facebook Pixel, Google Ads cookies<br />
                <strong>Legal Basis:</strong> These cookies require your consent.<br />
                <strong>Duration:</strong> Up to 2 years
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">4. Detailed Cookie List</h2>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Cookie Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Duration</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">session_id</td>
                      <td className="border border-gray-300 px-4 py-2">Strictly Necessary</td>
                      <td className="border border-gray-300 px-4 py-2">Session</td>
                      <td className="border border-gray-300 px-4 py-2">Maintains user session</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">csrf_token</td>
                      <td className="border border-gray-300 px-4 py-2">Strictly Necessary</td>
                      <td className="border border-gray-300 px-4 py-2">Session</td>
                      <td className="border border-gray-300 px-4 py-2">Security protection</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">cookie_consent</td>
                      <td className="border border-gray-300 px-4 py-2">Strictly Necessary</td>
                      <td className="border border-gray-300 px-4 py-2">1 year</td>
                      <td className="border border-gray-300 px-4 py-2">Stores cookie preferences</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">_ga</td>
                      <td className="border border-gray-300 px-4 py-2">Performance</td>
                      <td className="border border-gray-300 px-4 py-2">2 years</td>
                      <td className="border border-gray-300 px-4 py-2">Google Analytics tracking</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">_gid</td>
                      <td className="border border-gray-300 px-4 py-2">Performance</td>
                      <td className="border border-gray-300 px-4 py-2">24 hours</td>
                      <td className="border border-gray-300 px-4 py-2">Google Analytics tracking</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">_fbp</td>
                      <td className="border border-gray-300 px-4 py-2">Targeting</td>
                      <td className="border border-gray-300 px-4 py-2">3 months</td>
                      <td className="border border-gray-300 px-4 py-2">Facebook advertising</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">5. Third-Party Cookies</h2>
              <p className="text-gray-700 mb-6">
                We use services from third-party providers that may set their own cookies on your device. These include:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Google Analytics:</strong> Web analytics service to understand website usage</li>
                <li><strong>Facebook Pixel:</strong> Tracks conversions from Facebook ads</li>
                <li><strong>Stripe/PayPal:</strong> Payment processing services</li>
                <li><strong>YouTube:</strong> Embedded video content</li>
              </ul>
              <p className="text-gray-700 mb-6">
                These third parties have their own privacy and cookie policies. We recommend reviewing their policies to understand how they use cookies.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">6. Managing Your Cookie Preferences</h2>
              
              <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">6.1 Cookie Banner</h3>
              <p className="text-gray-700 mb-6">
                When you first visit our website, you'll see a cookie banner asking for your consent. You can choose to accept all cookies, reject non-essential cookies, or customize your preferences.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">6.2 Cookie Preference Center</h3>
              <p className="text-gray-700 mb-6">
                You can change your cookie preferences at any time by clicking the "Cookie Settings" link in our website footer. This will reopen the cookie preference center where you can adjust your choices.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">6.3 Browser Settings</h3>
              <p className="text-gray-700 mb-4">
                You can also control cookies through your browser settings:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options &gt; Privacy & Security &gt; Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies and website data</li>
                <li><strong>Edge:</strong> Settings &gt; Cookies and site permissions &gt; Cookies and site data</li>
              </ul>
              <p className="text-gray-700 mb-6">
                Please note that blocking or deleting cookies may impact your experience and some features may not function properly.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">6.4 Opt-Out Tools</h3>
              <p className="text-gray-700 mb-6">
                You can opt out of specific third-party cookies:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-[#16a34a] hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
                <li><strong>Advertising:</strong> <a href="https://www.youronlinechoices.com/uk" className="text-[#16a34a] hover:underline" target="_blank" rel="noopener noreferrer">Your Online Choices</a></li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">7. Mobile Devices and Apps</h2>
              <p className="text-gray-700 mb-6">
                Mobile devices and apps may use technologies similar to cookies, such as mobile advertising identifiers. You can manage these through your device settings:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>iOS:</strong> Settings &gt; Privacy &gt; Advertising &gt; Limit Ad Tracking</li>
                <li><strong>Android:</strong> Settings &gt; Google &gt; Ads &gt; Opt out of Ads Personalization</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">8. Do Not Track Signals</h2>
              <p className="text-gray-700 mb-6">
                Some browsers have a "Do Not Track" (DNT) feature that signals websites you visit that you do not want to have your online activity tracked. We currently do not respond to DNT signals, but we respect your cookie preferences as set through our cookie banner.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">9. Updates to This Policy</h2>
              <p className="text-gray-700 mb-6">
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of significant changes through a notice on our website or by email. The "Last updated" date at the top of this policy indicates when it was last revised.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">10. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@kisaan.com<br />
                  <strong>Post:</strong> Data Protection Officer, Kisaan Limited, [Address]<br />
                  <strong>Phone:</strong> +44 (0) 800 123 4567
                </p>
              </div>

              <div className="bg-[#16a34a]/10 border-l-4 border-[#16a34a] p-6 rounded mt-8">
                <h3 className="font-bold text-gray-900 mb-2">💡 Quick Tip</h3>
                <p className="text-gray-700">
                  You can manage your cookie preferences at any time by clicking "Cookie Settings" in the footer of our website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
