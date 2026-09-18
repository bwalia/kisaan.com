'use client';

import { ProductGridProps } from '@/types/home';
import ProductCard from '@/components/ProductCard';

const SKEL_BG = ['#EEF5E8','#FDF4DC','#E3EDF6','#F0EAD9','#FDEAE0','#DFF0EC','#EEF5E8','#FDF4DC'];

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading = false, error, onLoadMore, hasMore = false }) => {
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="font-semibold text-red-700 mb-1">Something went wrong</p>
        <p className="text-sm text-[var(--clay)] mb-4" style={{ maxWidth: 'none' }}>{error}</p>
        <button onClick={() => window.location.reload()} className="text-sm font-semibold bg-[var(--pine)] text-white px-5 py-2.5 rounded-lg cursor-pointer">Try again</button>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-semibold text-[var(--soil)] mb-1">No products found</p>
        <p className="text-sm text-[var(--clay)] mb-4" style={{ maxWidth: 'none' }}>Try adjusting your search or filters.</p>
        <button onClick={() => (window.location.href = '/')} className="text-sm font-semibold bg-[var(--surface)] text-[var(--soil)] px-5 py-2.5 rounded-lg hover:bg-[var(--border)] cursor-pointer transition-colors">View all products</button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {products.map((p) => (
          <ProductCard key={p.uuid} id={p.uuid} name={p.name} price={p.price} image={p.images?.[0]} isFeatured={p.is_featured} />
        ))}

        {loading && SKEL_BG.map((bg, i) => (
          <div key={`sk-${i}`} className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="aspect-square" style={{ background: bg }} />
            <div className="p-3.5 space-y-2">
              <div className="h-3 bg-[var(--surface)] rounded w-1/3" />
              <div className="h-4 bg-[var(--surface)] rounded w-3/4" />
              <div className="h-3 bg-[var(--surface)] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {!loading && hasMore && onLoadMore && (
        <div className="text-center mt-10">
          <button onClick={onLoadMore} className="text-sm font-semibold text-[var(--pine)] border border-[var(--pine)] px-6 py-2.5 rounded-lg hover:bg-[var(--sage-light)] cursor-pointer transition-colors">
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
