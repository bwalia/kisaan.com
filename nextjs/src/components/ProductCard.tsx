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
      // Error handling is done in CartContext with toast notifications
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

  return (
    <Link href={`/products/${product.uuid}`} className="group">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {productImage && !imageError ? (
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading={priority ? 'eager' : 'lazy'}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">🌱</span>
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-gray-900">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick add button */}
          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              disabled={isLoading}
              className="absolute bottom-3 right-3 bg-green-600 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-700 disabled:opacity-50"
              title="Add to Cart"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-auto">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Low stock indicator */}
          {!isOutOfStock && product.inventory_quantity <= 5 && (
            <p className="text-xs text-amber-600 mt-1">
              Only {product.inventory_quantity} left
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
