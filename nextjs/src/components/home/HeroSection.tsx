'use client';

import React from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  searchLoading?: boolean;
}

/** Marketplace pattern: Hero (search-focused) — brand + one headline + search CTA on full-bleed farm visual */
const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, searchLoading = false }) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <section className="relative min-h-[78vh] sm:min-h-[85vh] flex items-end sm:items-center overflow-hidden">
      {/* Full-bleed visual plane */}
      <Image
        src="/hero-farmers-world.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(20,83,45,0.92) 0%, rgba(21,128,61,0.72) 42%, rgba(20,83,45,0.35) 100%)',
        }}
      />

      <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-xl animate-fade-up">
          <p
            className="text-3xl sm:text-4xl mb-4 m-0"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600, maxWidth: 'none', color: '#FFFFFF' }}
          >
            Kisaan
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-4 leading-[1.15]" style={{ color: 'white' }}>
            Fresh from the farm to your table
          </h1>
          <p className="text-base sm:text-lg text-white/85 mb-8 leading-relaxed m-0" style={{ maxWidth: 'var(--measure)' }}>
            Organic produce from independent farms. Search, order direct, skip the middlemen.
          </p>

          <form onSubmit={handleSubmit} role="search" aria-label="Search products">
            <div className="flex rounded-2xl bg-white shadow-[var(--shadow-soft)] overflow-hidden focus-within:ring-2 focus-within:ring-[var(--color-accent)] focus-within:ring-offset-2 focus-within:ring-offset-transparent transition-shadow duration-200">
              <div className="flex-1 flex items-center pl-4 gap-2.5 min-w-0">
                <svg className="w-5 h-5 text-[var(--color-muted-foreground)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tomatoes, eggs, honey…"
                  className="flex-1 py-4 outline-none bg-transparent border-0 text-[var(--color-foreground)] min-w-0"
                  style={{ boxShadow: 'none' }}
                  aria-label="Search for produce"
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="bg-[var(--color-accent)] hover:bg-[#854D0E] text-white px-6 sm:px-8 text-sm font-semibold transition-colors duration-200 cursor-pointer flex-shrink-0"
              >
                {searchLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" aria-hidden="true" />
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
