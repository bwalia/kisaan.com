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
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-20">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Trusted by 50,000+ farmers worldwide</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Fresh from
              <span className="text-green-600"> Farm</span>
              <br />
              to Your Table
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Connect directly with local farmers. Buy fresh, organic produce and support sustainable agriculture.
            </p>

            {/* Search bar */}
            <div className="mb-8 max-w-lg">
              <SearchBar
                onSearch={onSearch}
                placeholder="Search fresh produce, seeds, dairy..."
                loading={searchLoading}
              />
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
              >
                Start Selling
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button
                onClick={scrollToProducts}
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Browse Products
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-500">Farmers</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-500">Products</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">150+</div>
                <div className="text-sm text-gray-500">Countries</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src="/hero-farmers-world.jpg"
                alt="Farmers in field"
                className="w-full h-auto rounded-2xl shadow-lg object-cover aspect-[4/3]"
              />
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 sm:bottom-6 sm:left-6 bg-white rounded-xl shadow-lg p-4 max-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🌱</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">100% Organic</div>
                    <div className="text-xs text-gray-500">Certified Fresh</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;