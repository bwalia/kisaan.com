'use client';

const features = [
  {
    icon: '🌍',
    title: 'Global Network',
    description: 'Connect with farmers from 150+ countries.',
  },
  {
    icon: '✅',
    title: 'Organic Certified',
    description: 'Every product verified for authenticity.',
  },
  {
    icon: '💰',
    title: 'Fair Prices',
    description: 'Farmers receive 80% of the sale price.',
  },
  {
    icon: '🚚',
    title: 'Fast Delivery',
    description: 'Fresh produce in 24-48 hours.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-green-600 font-semibold text-sm tracking-wide uppercase mb-2">Why Choose Us</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            The Kisaan Advantage
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We connect farmers directly with customers for fresh, organic produce at fair prices.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-50 rounded-xl p-6 hover:bg-green-50 transition-colors border border-gray-100 hover:border-green-200"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
