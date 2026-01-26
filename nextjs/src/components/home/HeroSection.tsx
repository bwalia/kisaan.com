'use client';

import React from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  searchLoading?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, searchLoading = false }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <section className="relative bg-white pt-12 pb-16 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 rounded-full px-5 py-2.5 mb-8 border border-green-100">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-700 text-sm font-medium tracking-wide">Trusted by 50,000+ farmers worldwide</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            Fresh From the Farm
            <span className="block text-green-600 mt-2">to Your Table</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
            Connect with local farmers. Buy fresh, organic produce at fair prices.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-10">
            <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="flex-1 flex items-center px-5">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vegetables, fruits, dairy..."
                  className="flex-1 py-4 text-gray-700 outline-none text-base placeholder:text-gray-400 bg-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 font-semibold transition-colors"
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Start Selling
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="#products"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-8 py-3.5 rounded-xl font-semibold transition-all border-2 border-gray-200 hover:border-gray-300"
            >
              Browse Products
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '150+', label: 'Countries', icon: '🌍' },
              { value: '10K+', label: 'Farmers', icon: '👨‍🌾' },
              { value: '50K+', label: 'Products', icon: '🥬' },
              { value: '100K+', label: 'Customers', icon: '😊' },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-colors">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
