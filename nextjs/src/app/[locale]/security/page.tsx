import Link from "next/link";

export const metadata = {
  title: "Fast & Secure Shopping | Kisaan",
  description: "Learn about our security measures and fast delivery options that keep your shopping safe and efficient.",
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 overflow-hidden">
        {/* Background Banner */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/banner-security.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-blue-700/80 to-blue-800/80" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 animate-pulse">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Fast & Secure</h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Lightning-fast checkout with bank-level security for all your transactions
            </p>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Your Security is Our Priority
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">SSL Encryption</h3>
                <p className="text-gray-600 leading-relaxed">
                  All data transmitted between your device and our servers is encrypted using 256-bit SSL technology, the same encryption used by banks worldwide.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">PCI DSS Compliant</h3>
                <p className="text-gray-600 leading-relaxed">
                  We maintain the highest level of payment card industry data security standards, ensuring your payment information is always protected.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fraud Protection</h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced fraud detection systems monitor all transactions in real-time to protect you from unauthorized purchases and identity theft.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Data Privacy</h3>
                <p className="text-gray-600 leading-relaxed">
                  We never store your complete payment details. All sensitive data is tokenized and stored securely with our payment partners.
                </p>
              </div>
            </div>

            {/* Fast Delivery */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Lightning Fast Delivery
            </h2>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 md:p-12 mb-8">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">1-2 Days</div>
                  <div className="text-gray-700 font-medium">Express Delivery</div>
                  <p className="text-sm text-gray-600 mt-2">For urgent orders</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">3-5 Days</div>
                  <div className="text-gray-700 font-medium">Standard Delivery</div>
                  <p className="text-sm text-gray-600 mt-2">Free on orders over £50</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-700 font-medium">Order Tracking</div>
                  <p className="text-sm text-gray-600 mt-2">Real-time updates</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure Payment Methods</h3>
              <p className="text-gray-600 mb-6">
                We accept all major payment methods with complete security:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 text-center font-medium text-gray-700">Visa</div>
                <div className="border border-gray-200 rounded-lg p-4 text-center font-medium text-gray-700">Mastercard</div>
                <div className="border border-gray-200 rounded-lg p-4 text-center font-medium text-gray-700">PayPal</div>
                <div className="border border-gray-200 rounded-lg p-4 text-center font-medium text-gray-700">Apple Pay</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Shop with Confidence
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Kisaan for secure online shopping.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Start Shopping Now
          </Link>
        </div>
      </section>
    </div>
  );
}
