'use client';

import { ProductGridProps } from '@/types/home';
import ProductCard from '@/components/ProductCard';

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  error,
  onLoadMore,
  hasMore = false,
}) => {
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-gray-600 font-medium mb-4">No products found</p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          View All Products
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.uuid}
            id={product.uuid}
            name={product.name}
            price={product.price}
            image={product.images?.[0]}
            isFeatured={product.is_featured}
          />
        ))}

        {/* Loading skeletons */}
        {loading && Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse shadow-sm">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200" />
            <div className="p-5 space-y-3">
              <div className="h-3 bg-gray-200 rounded-full w-1/3" />
              <div className="h-4 bg-gray-200 rounded-full w-3/4" />
              <div className="h-3 bg-gray-200 rounded-full w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-gray-200 rounded-full w-1/3" />
                <div className="h-10 bg-gray-200 rounded-xl w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {!loading && hasMore && onLoadMore && (
        <div className="text-center mt-12">
          <button
            onClick={onLoadMore}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            <span>Load More Products</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
