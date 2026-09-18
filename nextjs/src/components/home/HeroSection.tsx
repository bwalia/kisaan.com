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
    <section className="relative min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 animate-gradient" />

      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-teal-400/15 rounded-full blur-[120px]" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-amber-400/10 rounded-full blur-[80px]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-[10%] text-5xl animate-float opacity-20 hidden lg:block" style={{ animationDelay: '0s' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      <div className="absolute top-40 right-[15%] animate-float opacity-20 hidden lg:block" style={{ animationDelay: '1s' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(52,211,153,0.5)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
      </div>
      <div className="absolute bottom-32 left-[20%] animate-float opacity-15 hidden lg:block" style={{ animationDelay: '2s' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(251,191,36,0.5)" strokeWidth="1.5"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust badge */}
          <div className="animate-fadeIn inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-white/20 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="text-emerald-100 text-sm font-medium tracking-wide">Trusted by 50,000+ farmers worldwide</span>
          </div>

          {/* Main heading */}
          <h1 className="animate-slideUp text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight">
            Fresh From Farm
            <span className="block mt-2 bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
              To Your Table
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-slideUp delay-100 text-lg sm:text-xl text-emerald-100/80 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Discover organic produce from local farmers. Fresh harvests, fair prices, and sustainable farming — all delivered to your doorstep.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="animate-slideUp delay-200 max-w-2xl mx-auto mb-10">
            <div className="flex bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden ring-1 ring-white/20">
              <div className="flex-1 flex items-center px-5">
                <svg className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for vegetables, fruits, dairy..."
                  className="flex-1 py-4 text-gray-800 outline-none text-base placeholder:text-gray-400 bg-transparent border-0 focus:ring-0 focus:shadow-none"
                  style={{ boxShadow: 'none' }}
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                {searchLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Search</span>
                    <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="animate-slideUp delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
            >
              Start Selling Today
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link
              href="#products"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 border-2 border-white/20 hover:border-white/40 hover:bg-white/5 backdrop-blur-sm"
            >
              Browse Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </Link>
          </div>

          {/* Stats row */}
          <div className="animate-slideUp delay-400 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {[
              { value: '150+', label: 'Countries', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
              { value: '10K+', label: 'Farmers', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
              { value: '50K+', label: 'Products', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
              { value: '100K+', label: 'Customers', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
            ].map((stat) => (
              <div key={stat.label} className="group bg-white/[0.07] backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-emerald-400/30 hover:bg-white/[0.12] transition-all duration-300">
                <div className="text-emerald-400/70 mb-2 group-hover:text-emerald-300 transition-colors">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stat.value}</div>
                <div className="text-sm text-emerald-200/60 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80h1440V30c-240 30-480 50-720 30S240 0 0 30v50z" fill="#fafbfc"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
