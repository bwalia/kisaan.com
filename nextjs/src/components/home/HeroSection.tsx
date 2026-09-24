'use client';

import React from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  searchLoading?: boolean;
}

/** Mandi Ink — brand wordmark is the memorable moment; search is the job */
const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, searchLoading = false }) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <section className="relative min-h-[82vh] sm:min-h-[88vh] flex items-end overflow-hidden">
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
            'linear-gradient(180deg, rgba(28,36,24,0.35) 0%, rgba(28,36,24,0.55) 45%, rgba(28,36,24,0.92) 100%)',
        }}
      />

      <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20 pt-28">
        <div className="max-w-2xl">
          <p
            className="m-0 mb-3 leading-none"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(3.5rem, 12vw, 7rem)',
              letterSpacing: '-0.04em',
              color: '#FFFFFF',
              maxWidth: 'none',
            }}
          >
            Kisaan
          </p>
          <h1
            className="text-2xl sm:text-3xl mb-3 leading-snug m-0"
            style={{ fontFamily: 'var(--font-body)', fontWeight: 500, color: '#FFFFFF' }}
          >
            Fresh from the field. Sold by the farmer.
          </h1>
          <p
            className="text-base sm:text-lg mb-8 m-0 leading-relaxed"
            style={{ maxWidth: 'var(--measure)', color: 'rgba(247,248,244,0.88)' }}
          >
            Search independent farms for produce harvested to order — no middlemen.
          </p>

          <form onSubmit={handleSubmit} role="search" aria-label="Search products">
            <div className="flex overflow-hidden bg-[var(--chalk)] focus-within:ring-2 focus-within:ring-[var(--mustard)]">
              <label className="sr-only" htmlFor="hero-search">Search for produce</label>
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tomatoes, eggs, honey…"
                className="flex-1 py-4 px-4 outline-none bg-transparent border-0 text-[var(--ink)] min-w-0 rounded-none"
                style={{ boxShadow: 'none', borderRadius: 0 }}
              />
              <button
                type="submit"
                disabled={searchLoading}
                className="bg-[var(--tomato)] hover:bg-[var(--tomato-dark)] px-6 sm:px-8 text-sm font-semibold transition-colors duration-180 cursor-pointer flex-shrink-0"
                style={{ color: '#FFFFFF', borderRadius: 0 }}
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
