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
  const hasDiscount = product.compare_price && product.compare_price > product.price;

  return (
    <Link href={`/products/${product.uuid}`} className="group">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {productImage && !imageError ? (
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading={priority ? 'eager' : 'lazy'}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                Out of Stock
              </span>
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
            </div>
          )}

          {/* Quick add button */}
          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              disabled={isLoading}
              className="absolute bottom-2 right-2 bg-[#fe004d] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#e6003d] transform translate-y-2 group-hover:translate-y-0 disabled:opacity-50"
              title="Quick Add to Cart"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-gray-900 line-clamp-2 text-sm mb-2 group-hover:text-[#fe004d] transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-lg font-bold text-[#fe004d]">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {!isOutOfStock && product.inventory_quantity <= 5 && (
            <p className="text-xs text-orange-600 mt-1">
              Only {product.inventory_quantity} left in stock
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
