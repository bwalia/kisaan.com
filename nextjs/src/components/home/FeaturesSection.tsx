import Link from 'next/link';

export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      emoji: "🌍",
      title: "Global Farmer Network",
      description: "Connect with farmers from 150+ countries. From Indian spices to French lavender.",
      color: "from-[#2d6a4f] to-[#1b4332]",
      bgGlow: "bg-green-100",
      link: "/support"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      emoji: "🌿",
      title: "100% Organic Certified",
      description: "All products verified for authenticity. No pesticides, no GMOs, just pure goodness.",
      color: "from-[#059669] to-[#047857]",
      bgGlow: "bg-emerald-100",
      link: "/security"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      emoji: "💰",
      title: "Fair Trade Prices",
      description: "Farmers get 80% of sale price. Support sustainable livelihoods directly.",
      color: "from-amber-500 to-amber-600",
      bgGlow: "bg-amber-100",
      link: "/pricing"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      emoji: "📦",
      title: "Farm Fresh Delivery",
      description: "From harvest to your home in 24-48 hours. Eco-friendly packaging included.",
      color: "from-[#78350f] to-[#92400e]",
      bgGlow: "bg-orange-100",
      link: "/returns"
    }
  ];

  // Farmer testimonials
  const farmers = [
    { name: "Rajesh Kumar", location: "Punjab, India", crop: "Wheat & Rice", image: "👨‍🌾" },
    { name: "Maria Santos", location: "Alentejo, Portugal", crop: "Olive Oil", image: "👩‍🌾" },
    { name: "John Okonkwo", location: "Lagos, Nigeria", crop: "Cocoa & Coffee", image: "👨‍🌾" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#fefdfb] to-[#f5f5f4] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-40 translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#2d6a4f]/10 text-[#2d6a4f] rounded-full px-4 py-2 mb-4">
            <span>🌾</span>
            <span className="text-sm font-semibold">Why Farmers Love Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-[#2d6a4f]">Kisaan</span>?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We&apos;re building a future where every farmer thrives. Join the agricultural revolution.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-stone-100 hover:border-[#2d6a4f]/30 transition-all duration-500 transform hover:-translate-y-2 block relative overflow-hidden"
            >
              {/* Background glow on hover */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 ${feature.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                {/* Icon with emoji */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <span className="text-3xl">{feature.emoji}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#2d6a4f] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm mb-4">
                  {feature.description}
                </p>
                <span className="text-[#2d6a4f] font-semibold inline-flex items-center gap-1 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Learn more
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Farmer Spotlight Section */}
        <div className="bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-300 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-300 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <span className="text-4xl mb-4 block">👨‍🌾</span>
              <h3 className="text-3xl md:text-4xl font-bold mb-3">Meet Our Farmers</h3>
              <p className="text-green-100 max-w-2xl mx-auto">
                Real farmers, real stories, real impact. Every purchase supports a farming family.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {farmers.map((farmer, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{farmer.image}</div>
                  <h4 className="font-bold text-lg mb-1">{farmer.name}</h4>
                  <p className="text-green-200 text-sm mb-2">{farmer.location}</p>
                  <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-200 px-3 py-1 rounded-full text-xs">
                    <span>🌱</span> {farmer.crop}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link 
                href="/seller-guide"
                className="inline-flex items-center gap-2 bg-white text-[#2d6a4f] px-8 py-3 rounded-full font-bold hover:bg-amber-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <span>🚜</span>
                Join 10,000+ Farmers
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "🏆", label: "Award Winning Platform", sublabel: "AgriTech 2024" },
            { icon: "🔒", label: "Secure Payments", sublabel: "256-bit SSL" },
            { icon: "♻️", label: "Eco-Friendly", sublabel: "Carbon Neutral" },
            { icon: "🤝", label: "Fair Trade", sublabel: "Certified Partner" },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
              <div className="text-xs text-gray-500">{item.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
