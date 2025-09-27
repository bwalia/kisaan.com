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
    <div className="relative bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-1/4 right-1/3 w-24 h-24 bg-white opacity-10 rounded-full"></div>
      </div>

      <div className="relative container mx-auto px-6 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Your Own Store By
            <span className="block text-pink-200 mt-2">Kisaan</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-pink-100 leading-relaxed">
            Discover amazing products from sellers worldwide
          </p>

          {/* Search bar */}
          <div className="mb-8">
            <SearchBar
              onSearch={onSearch}
              placeholder="Search for products, categories, or brands..."
              loading={searchLoading}
            />
          </div>

          {/* Popular searches */}
          <div className="mb-10">
            <p className="text-sm text-pink-200 mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports'].map((term) => (
                <button
                  key={term}
                  onClick={() => onSearch(term)}
                  className="px-3 py-1 text-xs bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-all duration-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="bg-white text-[#22c55e] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Selling Today
            </Link>
            <button
              onClick={scrollToProducts}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#22c55e] transition-all duration-200"
            >
              Browse Products
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white border-opacity-20">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">10K+</div>
              <div className="text-sm text-primary-200">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">1K+</div>
              <div className="text-sm text-primary-200">Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">50K+</div>
              <div className="text-sm text-primary-200">Happy Customers</div>
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