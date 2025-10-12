import Link from "next/link";

export const metadata = {
  title: "24/7 Customer Support | Kisaan",
  description: "Round-the-clock customer support to help you with any questions. We're here for you anytime.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white py-20 overflow-hidden">
        {/* Background Banner */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/banner-support.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/80 via-orange-700/80 to-orange-800/80" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 animate-pulse">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">24/7 Support</h1>
            <p className="text-xl md:text-2xl text-orange-100">
              Round-the-clock customer support to help you with any questions
            </p>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              We're Here to Help, Anytime
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Live Chat</h3>
                <p className="text-gray-600 text-center mb-6">
                  Chat with our support team instantly. Average response time: 2 minutes.
                </p>
                <div className="text-center">
                  <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                    Start Chat
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Email Support</h3>
                <p className="text-gray-600 text-center mb-6">
                  Send us an email anytime. We respond within 24 hours.
                </p>
                <div className="text-center">
                  <a 
                    href="mailto:support@kisaan.com" 
                    className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    Email Us
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Phone Support</h3>
                <p className="text-gray-600 text-center mb-6">
                  Call us toll-free, available 24/7 for urgent matters.
                </p>
                <div className="text-center">
                  <a 
                    href="tel:+448001234567" 
                    className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            </div>

            {/* Support Features */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 md:p-12 mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">What We Can Help You With</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Order Tracking & Status</h4>
                    <p className="text-gray-600 text-sm">Get real-time updates on your order location and delivery time.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Returns & Refunds</h4>
                    <p className="text-gray-600 text-sm">Assistance with return requests and refund processing.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Product Information</h4>
                    <p className="text-gray-600 text-sm">Questions about product specifications, availability, and more.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Payment Issues</h4>
                    <p className="text-gray-600 text-sm">Help with payment methods, billing, and transaction problems.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Account Management</h4>
                    <p className="text-gray-600 text-sm">Support for login issues, password resets, and account settings.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Technical Support</h4>
                    <p className="text-gray-600 text-sm">Assistance with website navigation and technical difficulties.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Knowledge Base */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Knowledge Base</h3>
                <p className="text-gray-600 mb-6">
                  Browse our comprehensive help articles and guides for quick answers to common questions.
                </p>
                <ul className="space-y-3 mb-6">
                  <li>
                    <a href="#" className="text-orange-600 hover:underline flex items-center gap-2">
                      <span>→</span>
                      <span>How to place an order</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-orange-600 hover:underline flex items-center gap-2">
                      <span>→</span>
                      <span>Shipping and delivery information</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-orange-600 hover:underline flex items-center gap-2">
                      <span>→</span>
                      <span>Payment methods accepted</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-orange-600 hover:underline flex items-center gap-2">
                      <span>→</span>
                      <span>Creating and managing your account</span>
                    </a>
                  </li>
                </ul>
                <Link 
                  href="#" 
                  className="inline-block text-orange-600 font-semibold hover:underline"
                >
                  View All Articles →
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Video Tutorials</h3>
                <p className="text-gray-600 mb-6">
                  Watch step-by-step video guides to make the most of your shopping experience.
                </p>
                <div className="bg-gray-100 rounded-lg aspect-video mb-6 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                </div>
                <Link 
                  href="#" 
                  className="inline-block text-orange-600 font-semibold hover:underline"
                >
                  Watch Tutorials →
                </Link>
              </div>
            </div>

            {/* Response Times */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Response Times</h3>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">2 min</div>
                  <div className="text-sm text-gray-600">Live Chat</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">1 min</div>
                  <div className="text-sm text-gray-600">Phone Call</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">24 hrs</div>
                  <div className="text-sm text-gray-600">Email</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">99%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Our friendly support team is ready to help you 24/7. Don't hesitate to reach out!
          </p>
          <button className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            Contact Us Now
          </button>
        </div>
      </section>
    </div>
  );
}
