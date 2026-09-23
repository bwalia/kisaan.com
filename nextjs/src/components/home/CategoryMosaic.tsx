'use client';

import type { ReactNode } from 'react';

/** Category strip with SVG icons (no emoji — ui-ux-pro-max checklist) */

type CategoryTile = {
  label: string;
  bg: string;
  icon: ReactNode;
};

const ICON_CLASS = 'w-7 h-7 text-[var(--color-primary)]';

const TILES: CategoryTile[] = [
  {
    label: 'Vegetables',
    bg: '#DCFCE7',
    icon: (
      <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 3-4 5-4 9a4 4 0 008 0c0-4-2.5-6-4-9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v9" />
      </svg>
    ),
  },
  {
    label: 'Fruits',
    bg: '#FEF3C7',
    icon: (
      <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true">
        <circle cx="12" cy="13" r="6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7c0-2 1.5-3.5 3-4M10 8c-1-1-1.5-2-1-3.5" />
      </svg>
    ),
  },
  {
    label: 'Dairy',
    bg: '#E0F2FE',
    icon: (
      <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h8l1 3v7a2 2 0 01-2 2H9a2 2 0 01-2-2v-7l1-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V6a3 3 0 016 0v2" />
      </svg>
    ),
  },
  {
    label: 'Honey',
    bg: '#FEF9C3',
    icon: (
      <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" />
      </svg>
    ),
  },
  {
    label: 'Grains',
    bg: '#F5F5DC',
    icon: (
      <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V10M12 10c2-2 4-3 6-3-1 3-3 5-6 6M12 10c-2-2-4-3-6-3 1 3 3 5 6 6" />
      </svg>
    ),
  },
  {
    label: 'Herbs',
    bg: '#CCFBF1',
    icon: (
      <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c0-6 4-10 8-12-1 5-3 8-8 10M12 21c0-6-4-10-8-12 1 5 3 8 8 10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V9" />
      </svg>
    ),
  },
];

interface CategoryMosaicProps {
  onSelect: (label: string) => void;
}

export default function CategoryMosaic({ onSelect }: CategoryMosaicProps) {
  return (
    <section className="py-12 lg:py-16 bg-[var(--color-card)] border-b border-[var(--color-border)]" aria-labelledby="categories-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="categories-heading" className="text-2xl sm:text-3xl mb-8">
          Shop by category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {TILES.map((t, i) => (
            <button
              key={t.label}
              type="button"
              onClick={() => onSelect(t.label)}
              className="flex flex-col items-center justify-center gap-2.5 rounded-2xl py-6 sm:py-8 cursor-pointer border-0 transition-all duration-200 hover:scale-[1.03] hover:shadow-[var(--shadow-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-ring)] animate-fade-up"
              style={{ background: t.bg, animationDelay: `${i * 40}ms` }}
            >
              {t.icon}
              <span className="text-sm font-semibold text-[var(--color-foreground)]">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
