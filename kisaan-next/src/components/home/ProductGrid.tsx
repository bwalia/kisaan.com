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
  const handleAddToCart = () => {
    // This will be handled by individual ProductCard components
    console.log('Product added to cart');
  };

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="empty-state-icon">
            <svg className="icon icon-xl text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="empty-state-icon">
            <svg className="icon icon-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No products found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-outline"
          >
            View All Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.uuid}
            product={product}
            onAddToCart={handleAddToCart}
            showVariants={true}
          />
        ))}

        {/* Loading skeleton cards */}
        {loading && (
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="card animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Load More Button */}
      {!loading && hasMore && onLoadMore && (
        <div className="text-center pt-8">
          <button
            onClick={onLoadMore}
            className="btn-outline btn-lg inline-flex items-center gap-2"
          >
            <svg className="icon icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Load More Products
          </button>
        </div>
      )}

      {/* Loading more indicator */}
      {loading && products.length > 0 && (
        <div className="text-center pt-8">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <div className="loading-spinner"></div>
            <span>Loading more products...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;