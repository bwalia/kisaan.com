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
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-red-600 font-semibold text-lg mb-2">Something went wrong</p>
        <p className="text-gray-500 mb-6 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <p className="text-gray-800 font-semibold text-lg mb-2">No products found</p>
        <p className="text-gray-500 mb-6 text-sm">Try adjusting your search or filters</p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors cursor-pointer"
        >
          View All Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product, index) => (
          <div key={product.uuid} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
            <ProductCard
              id={product.uuid}
              name={product.name}
              price={product.price}
              image={product.images?.[0]}
              isFeatured={product.is_featured}
            />
          </div>
        ))}

        {/* Loading skeletons */}
        {loading && Array.from({ length: 8 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer" />
            </div>
            <div className="p-4 space-y-3">
              <div className="h-3 bg-gray-100 rounded-full w-1/4" />
              <div className="h-4 bg-gray-100 rounded-full w-3/4" />
              <div className="h-3 bg-gray-100 rounded-full w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-gray-100 rounded-full w-1/3" />
                <div className="h-10 bg-gray-100 rounded-xl w-10" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      {!loading && hasMore && onLoadMore && (
        <div className="text-center mt-14">
          <button
            onClick={onLoadMore}
            className="group inline-flex items-center gap-2.5 bg-white hover:bg-gray-50 text-gray-700 px-8 py-3.5 rounded-2xl font-semibold transition-all duration-200 border-2 border-gray-200 hover:border-emerald-300 hover:text-emerald-700 shadow-sm cursor-pointer"
          >
            <span>Load More Products</span>
            <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
