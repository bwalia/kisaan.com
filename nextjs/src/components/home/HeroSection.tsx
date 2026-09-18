'use client';

import React from 'react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  searchLoading?: boolean;
}

const TILES = [
  { label: 'Vegetables', emoji: '🥕', bg: '#EEF5E8' },
  { label: 'Fruits',     emoji: '🍊', bg: '#FDEAE0' },
  { label: 'Dairy',      emoji: '🥛', bg: '#E3EDF6' },
  { label: 'Honey',      emoji: '🍯', bg: '#FDF4DC' },
  { label: 'Grains',     emoji: '🌾', bg: '#F0EAD9' },
  { label: 'Herbs',      emoji: '🌿', bg: '#DFF0EC' },
];

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, searchLoading = false }) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
          {/* Left: text + search */}
          <div className="flex-1 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] mb-5 leading-[1.12]">
              Fresh produce,{' '}
              <span className="text-[var(--pine)]">straight from the farmer.</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--clay)] mb-8 leading-relaxed">
              Discover organic fruits, vegetables, dairy and more from independent farms worldwide. Fair prices, no middlemen.
            </p>

            {/* Search bar — the bold focal element */}
            <form onSubmit={handleSubmit}>
              <div className="flex rounded-xl border-2 border-[var(--border)] bg-white focus-within:border-[var(--pine)] focus-within:shadow-[0_0_0_3px_rgba(27,94,55,0.06)] transition-all overflow-hidden">
                <div className="flex-1 flex items-center pl-4 gap-2.5">
                  <svg className="w-5 h-5 text-[#bbb] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for tomatoes, eggs, honey..."
                    className="flex-1 py-3.5 outline-none bg-transparent border-0 text-[var(--soil)]"
                    style={{ boxShadow: 'none' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="bg-[var(--pine)] hover:bg-[var(--pine-dark)] text-white px-6 text-sm font-semibold transition-colors cursor-pointer"
                >
                  {searchLoading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                    : 'Search'}
                </button>
              </div>
            </form>
          </div>

          {/* Right: category mosaic */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:w-[380px] flex-shrink-0">
            {TILES.map((t) => (
              <button
                key={t.label}
                onClick={() => { setQuery(t.label); onSearch(t.label); }}
                className="flex flex-col items-center justify-center rounded-2xl py-5 sm:py-7 transition-all hover:scale-[1.04] hover:shadow-md cursor-pointer border-0"
                style={{ background: t.bg }}
              >
                <span className="text-3xl sm:text-4xl mb-2 block">{t.emoji}</span>
                <span className="text-xs sm:text-sm font-semibold text-[var(--soil)]">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
