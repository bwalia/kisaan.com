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
    <div className="relative bg-gradient-to-br from-[#16a34a] via-[#15803d] to-[#14532d] text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-300 opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-emerald-200 opacity-15 rounded-full blur-xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
      </div>

      <div className="relative container mx-auto px-6 py-20 lg:py-28">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8 animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-100"></span>
            </span>
            <span className="text-sm font-medium">🚀 Trusted by 50,000+ Happy Customers</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Build Your Own
            <span className="block bg-gradient-to-r from-emerald-200 via-green-100 to-emerald-300 bg-clip-text text-transparent mt-2 animate-gradient">
              Marketplace Store
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-10 text-emerald-50 leading-relaxed max-w-3xl mx-auto font-light">
            Connect with sellers worldwide and discover unique products. Start your journey with Kisaan today.
          </p>

          {/* Search bar */}
          <div className="mb-10 max-w-3xl mx-auto">
            <SearchBar
              onSearch={onSearch}
              placeholder="Search for products, categories, or brands..."
              loading={searchLoading}
            />
          </div>

          {/* Popular searches */}
          <div className="mb-12">
            <p className="text-sm text-emerald-100 mb-4 font-medium">🔥 Trending Now:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Electronics', 'Fashion', 'Home & Garden', 'Books', 'Sports & Fitness'].map((term) => (
                <button
                  key={term}
                  onClick={() => onSearch(term)}
                  className="px-5 py-2 text-sm bg-white/15 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/25 hover:border-white/40 transition-all duration-300 font-medium hover:scale-105 transform"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
              href="/register"
              className="group bg-white text-[#16a34a] px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 flex items-center gap-2"
            >
              Start Selling Today
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button
              onClick={scrollToProducts}
              className="group border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#16a34a] transition-all duration-300 backdrop-blur-sm bg-white/10 hover:shadow-xl transform hover:-translate-y-1"
            >
              Browse Products
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-white/20">
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-br from-white to-emerald-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform">10K+</div>
              <div className="text-sm md:text-base text-emerald-100 font-medium">Active Products</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-br from-white to-emerald-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform">1K+</div>
              <div className="text-sm md:text-base text-emerald-100 font-medium">Verified Sellers</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-br from-white to-emerald-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform">50K+</div>
              <div className="text-sm md:text-base text-emerald-100 font-medium">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 md:h-16 text-gray-50"
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