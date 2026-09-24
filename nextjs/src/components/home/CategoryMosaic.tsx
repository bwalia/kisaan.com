'use client';

const CATEGORIES = ['Vegetables', 'Fruits', 'Dairy', 'Honey', 'Grains', 'Herbs'] as const;

interface CategoryMosaicProps {
  onSelect: (label: string) => void;
}

/** Stamp-style text buttons — not a card grid */
export default function CategoryMosaic({ onSelect }: CategoryMosaicProps) {
  return (
    <section className="py-10 lg:py-12 border-b border-[var(--line)] bg-[var(--chalk)]" aria-labelledby="categories-heading">
      <div className="container mx-auto">
        <h2 id="categories-heading" className="text-xl sm:text-2xl mb-6">
          Shop by category
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {CATEGORIES.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => onSelect(label)}
              className="px-4 py-2 text-sm font-semibold border-[1.5px] border-[var(--ink)] text-[var(--ink)] bg-transparent hover:bg-[var(--ink)] hover:text-[var(--chalk)] transition-colors duration-180 cursor-pointer"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
