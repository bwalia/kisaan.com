'use client';

import Link from 'next/link';
import SearchBar from './SearchBar';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  searchLoading?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, searchLoading = false }) => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#40916c] text-white overflow-hidden">
      {/* Background image - Farmer in field */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-farmer-banner.jpg')",
          backgroundPosition: 'center 30%',
        }}
      >
        {/* Gradient overlay for better text readability - earthy tones */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b4332]/90 via-[#2d6a4f]/85 to-[#40916c]/80"></div>
      </div>
      
      {/* Decorative wheat/grain patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sun-like glow */}
        <div className="absolute -top-20 right-10 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-yellow-300/10 rounded-full blur-3xl"></div>
        {/* Earthy orbs */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2d6a4f] opacity-20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-amber-300/15 rounded-full blur-2xl"></div>
        {/* Subtle grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E\")"}}></div>
      </div>

      <div className="relative container mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8 animate-fade-in shadow-lg">
            <span className="text-2xl">🌾</span>
            <span className="text-sm font-semibold tracking-wide">Connecting Farmers to the World Since 2020</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            From Farm to 
            <span className="block bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent mt-2 animate-gradient drop-shadow-none">
              Your Table
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-10 text-green-50 leading-relaxed max-w-3xl mx-auto font-light">
            Empowering farmers worldwide. Buy fresh produce directly from local farms, 
            support sustainable agriculture, and taste the difference.
          </p>

          {/* Search bar */}
          <div className="mb-10 max-w-3xl mx-auto">
            <SearchBar
              onSearch={onSearch}
              placeholder="Search for fresh produce, seeds, farm equipment..."
              loading={searchLoading}
            />
          </div>

          {/* Popular searches */}
          <div className="mb-12">
            <p className="text-sm text-green-100 mb-4 font-medium flex items-center justify-center gap-2">
              <span className="text-amber-300">🌱</span> Popular Categories:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Fresh Vegetables', emoji: '🥬' },
                { name: 'Organic Fruits', emoji: '🍎' },
                { name: 'Farm Seeds', emoji: '🌰' },
                { name: 'Dairy Products', emoji: '🥛' },
                { name: 'Honey & Natural', emoji: '🍯' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => onSearch(item.name)}
                  className="px-5 py-2.5 text-sm bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-amber-500/30 hover:border-amber-300/50 transition-all duration-300 font-medium hover:scale-105 transform flex items-center gap-2"
                >
                  <span>{item.emoji}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
              href="/register"
              className="group bg-gradient-to-r from-amber-500 to-amber-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-2xl hover:shadow-amber-500/30 transform hover:-translate-y-1 hover:scale-105 flex items-center gap-2"
            >
              <span className="text-xl">🚜</span>
              Start Selling Your Harvest
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button
              onClick={scrollToProducts}
              className="group border-2 border-white/80 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#1b4332] transition-all duration-300 backdrop-blur-sm bg-white/5 hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <span className="text-xl">🛒</span>
              Shop Farm Fresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-white/20">
            <div className="text-center group">
              <div className="text-3xl mb-2">🌍</div>
              <div className="text-3xl md:text-4xl font-extrabold mb-1 bg-gradient-to-br from-white to-green-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform">150+</div>
              <div className="text-sm text-green-100 font-medium">Countries</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl mb-2">👨‍🌾</div>
              <div className="text-3xl md:text-4xl font-extrabold mb-1 bg-gradient-to-br from-white to-green-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform">10K+</div>
              <div className="text-sm text-green-100 font-medium">Local Farmers</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl mb-2">🌿</div>
              <div className="text-3xl md:text-4xl font-extrabold mb-1 bg-gradient-to-br from-white to-green-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform">50K+</div>
              <div className="text-sm text-green-100 font-medium">Fresh Products</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-3xl md:text-4xl font-extrabold mb-1 bg-gradient-to-br from-white to-green-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform">100K+</div>
              <div className="text-sm text-green-100 font-medium">Happy Families</div>
            </div>
          </div>
        </div>
      </div>

      {/* Natural wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 md:h-24 text-[#fefdfb]"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0V46.29C47.79,22.27 103.59,32.58 158,28C212.41,23.42 268.21,13.11 316,46.29C363.79,79.47 419.59,69.16 474,64.58C528.41,60 584.21,49.69 632,82.87C679.79,116.05 735.59,105.74 790,101.16C844.41,96.58 900.21,86.27 948,119.45C995.79,152.63 1051.59,142.32 1106,137.74C1160.41,133.16 1216.21,122.85 1264,156.03L1200,160V0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;