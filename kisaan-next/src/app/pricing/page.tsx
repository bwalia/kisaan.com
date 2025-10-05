import Link from "next/link";

export const metadata = {
  title: "Best Prices Guaranteed | Kisaan",
  description: "Discover competitive pricing with regular deals and discounts on quality products.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#16a34a] via-[#15803d] to-[#14532d] text-white py-20 overflow-hidden">
        {/* Background Banner */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/banner-pricing.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#16a34a]/80 via-[#15803d]/80 to-[#14532d]/80" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 animate-pulse">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Best Prices Guaranteed</h1>
            <p className="text-xl md:text-2xl text-emerald-100">
              Competitive pricing with regular deals and discounts on quality products
            </p>
          </div>
        </div>
      </section>

      {/* Price Promise */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Our Price Promise
            </h2>

            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-8 md:p-12 mb-16">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#16a34a] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    £
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Lowest Prices</h3>
                  <p className="text-gray-600">
                    We constantly monitor competitor prices to ensure you get the best deal
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#16a34a] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    %
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Regular Discounts</h3>
                  <p className="text-gray-600">
                    Enjoy frequent sales, seasonal offers, and exclusive member discounts
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#16a34a] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Price Match</h3>
                  <p className="text-gray-600">
                    Find it cheaper elsewhere? We'll match the price or refund the difference
                  </p>
                </div>
              </div>
            </div>

            {/* Savings Features */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Daily Deals</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  New deals added every day with up to 70% off on selected items. Check back regularly to catch the best bargains.
                </p>
                <Link href="/" className="text-[#16a34a] font-semibold hover:underline">
                  View Today's Deals →
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Bulk Discounts</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Save more when you buy more. Automatic discounts applied at checkout for bulk purchases on eligible items.
                </p>
                <div className="text-sm text-gray-500">
                  Buy 3+ items: 5% off | Buy 5+ items: 10% off
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Coupon Codes</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Subscribe to our newsletter for exclusive coupon codes and early access to sales. First-time customers save 15%!
                </p>
                <div className="bg-emerald-50 border border-[#16a34a] rounded-lg p-3 text-center font-mono font-bold text-[#16a34a]">
                  WELCOME15
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Loyalty Rewards</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Earn points on every purchase that can be redeemed for discounts on future orders. The more you shop, the more you save!
                </p>
                <div className="text-sm text-gray-500">
                  £1 spent = 1 point | 100 points = £5 off
                </div>
              </div>
            </div>

            {/* Transparent Pricing */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Transparent Pricing Policy</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-[#16a34a]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">No Hidden Fees</h4>
                    <p className="text-gray-600 text-sm">What you see is what you pay. All prices include VAT.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-[#16a34a]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Free Delivery Over £50</h4>
                    <p className="text-gray-600 text-sm">Standard delivery is free on all orders over £50.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-[#16a34a]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Price Protection</h4>
                    <p className="text-gray-600 text-sm">If price drops within 7 days, we'll refund the difference.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-[#16a34a]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Quality Guarantee</h4>
                    <p className="text-gray-600 text-sm">Low prices never mean low quality. All products verified.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#16a34a] to-[#15803d]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Saving Today
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of smart shoppers who save money shopping with Kisaan.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-[#16a34a] px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Browse Deals Now
          </Link>
        </div>
      </section>
    </div>
  );
}
