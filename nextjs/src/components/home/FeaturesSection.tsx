import Link from 'next/link';

export default function FeaturesSection() {
  const features = [
    {
      icon: "🌍",
      title: "Global Network",
      description: "Connect with farmers from 150+ countries worldwide.",
    },
    {
      icon: "🌿",
      title: "100% Organic",
      description: "All products verified. No pesticides, no GMOs.",
    },
    {
      icon: "💰",
      title: "Fair Prices",
      description: "Farmers get 80% of sale price directly.",
    },
    {
      icon: "📦",
      title: "Fast Delivery",
      description: "From harvest to your home in 24-48 hours.",
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Kisaan?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Building a future where every farmer thrives.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Start Selling?
          </h3>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Join 10,000+ farmers already selling on Kisaan. It&apos;s free to get started.
          </p>
          <Link 
            href="/seller-guide"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Get Started Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
          {[
            { icon: "🏆", label: "AgriTech Award 2024" },
            { icon: "🔒", label: "Secure Payments" },
            { icon: "♻️", label: "Carbon Neutral" },
            { icon: "🤝", label: "Fair Trade Certified" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-600">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
