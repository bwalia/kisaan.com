import Link from 'next/link';

export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Fast & Secure",
      description: "Lightning-fast checkout with bank-level security for all transactions.",
      color: "from-blue-500 to-blue-600",
      link: "/security"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Best Prices",
      description: "Competitive pricing with regular deals and discounts on quality products.",
      color: "from-[#16a34a] to-[#15803d]",
      link: "/pricing"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Easy Returns",
      description: "Hassle-free 30-day returns and exchanges on most products.",
      color: "from-purple-500 to-purple-600",
      link: "/returns"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: "24/7 Support",
      description: "Round-the-clock customer support to help you with any questions.",
      color: "from-orange-500 to-orange-600",
      link: "/support"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-[#16a34a]">Kisaan</span>?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience the best online shopping with our commitment to quality, security, and customer satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl border border-gray-100 hover:border-[#16a34a]/30 transition-all duration-300 transform hover:-translate-y-2 block"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#16a34a] transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                {feature.description}
              </p>
              <span className="text-[#16a34a] font-semibold inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
