import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';
import { formatPrice } from '@/lib/home-utils';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.is_active || product.inventory_quantity <= 0) return;

    setIsLoading(true);
    try {
      await addToCart(product.uuid, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductImage = () => {
    try {
      if (!product.images) return null;

      if (Array.isArray(product.images)) {
        return product.images[0] || null;
      }

      if (typeof product.images === 'string') {
        if (product.images === '') return null;
        const parsed = JSON.parse(product.images);
        return Array.isArray(parsed) ? parsed[0] || null : null;
      }

      return null;
    } catch {
      return null;
    }
  };

  const productImage = getProductImage();
  const isOutOfStock = !product.is_active || product.inventory_quantity <= 0;
  const hasDiscount = false; // Remove compare_price reference as it doesn't exist in Product type

  return (
    <Link href={`/products/${product.uuid}`} className="group">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-[#16a34a]/30 transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {productImage && !imageError ? (
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading={priority ? 'eager' : 'lazy'}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white px-4 py-2 rounded-full text-sm font-bold text-gray-900 shadow-lg">
                Out of Stock
              </span>
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
              -0%
            </div>
          )}

          {/* Quick add button */}
          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              disabled={isLoading}
              className="absolute bottom-3 right-3 bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-xl transform translate-y-2 group-hover:translate-y-0 disabled:opacity-50 hover:scale-110"
              title="Quick Add to Cart"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-3 group-hover:text-[#16a34a] transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-2xl font-bold text-[#16a34a]">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(0)}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {!isOutOfStock && product.inventory_quantity <= 5 && (
            <div className="flex items-center gap-1 mt-2">
              <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-orange-600 font-medium">
                Only {product.inventory_quantity} left!
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
