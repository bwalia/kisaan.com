'use client';

import { ProductGridProps } from '@/types/home';
import ProductCard from '@/components/ProductCard';

const SKEL_BG = ['#E8EDE4', '#F0E6D8', '#E4EAF0', '#ECE8DF', '#F0E4DE', '#E2EBE6', '#E8EDE4', '#F0E6D8'];

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading = false, error, onLoadMore, hasMore = false }) => {
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="font-semibold text-[var(--tomato)] mb-1">Something went wrong</p>
        <p className="text-sm text-[var(--muted)] mb-4" style={{ maxWidth: 'none' }}>{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-sm font-semibold px-5 py-2.5 cursor-pointer"
          style={{ background: 'var(--field)', color: '#FFFFFF' }}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-semibold text-[var(--ink)] mb-1">No products found</p>
        <p className="text-sm text-[var(--muted)] mb-4" style={{ maxWidth: 'none' }}>
          Try adjusting your search or filters.
        </p>
        <button
          type="button"
          onClick={() => (window.location.href = '/')}
          className="text-sm font-semibold bg-[var(--color-muted)] text-[var(--ink)] px-5 py-2.5 hover:bg-[var(--line)] cursor-pointer transition-colors"
        >
          View all products
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {products.map((p) => (
          <ProductCard
            key={p.uuid}
            id={p.uuid}
            name={p.name}
            price={p.price}
            image={p.images?.[0]}
            isFeatured={p.is_featured}
          />
        ))}

        {loading &&
          SKEL_BG.map((bg, i) => (
            <div key={`sk-${i}`} className="bg-[var(--card)] border border-[var(--line)] overflow-hidden">
              <div className="aspect-square" style={{ background: bg }} />
              <div className="p-3.5 space-y-2">
                <div className="h-3 bg-[var(--color-muted)] rounded w-1/3" />
                <div className="h-4 bg-[var(--color-muted)] rounded w-3/4" />
                <div className="h-3 bg-[var(--color-muted)] rounded w-1/2" />
              </div>
            </div>
          ))}
      </div>

      {!loading && hasMore && onLoadMore && (
        <div className="text-center mt-10">
          <button
            type="button"
            onClick={onLoadMore}
            className="text-sm font-semibold text-[var(--field)] border border-[var(--field)] px-6 py-2.5 hover:bg-[var(--sage-light)] cursor-pointer transition-colors"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
