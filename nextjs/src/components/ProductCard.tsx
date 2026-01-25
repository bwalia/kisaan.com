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
      // No need to do anything here as user will see the toast
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
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-2xl hover:border-[#2d6a4f]/30 transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-stone-50 to-stone-100 overflow-hidden">
          {productImage && !imageError ? (
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading={priority ? 'eager' : 'lazy'}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 bg-gradient-to-br from-green-50 to-amber-50">
              <span className="text-5xl mb-2">🌱</span>
              <span className="text-xs text-stone-400">Farm Fresh</span>
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white px-4 py-2 rounded-full text-sm font-bold text-stone-900 shadow-lg flex items-center gap-2">
                <span>🚫</span> Out of Stock
              </span>
            </div>
          )}

          {/* Organic/Fresh badge */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
            <span>🌿</span> Farm Fresh
          </div>

          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
              -0%
            </div>
          )}

          {/* Quick add button */}
          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              disabled={isLoading}
              className="absolute bottom-3 right-3 bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-xl transform translate-y-2 group-hover:translate-y-0 disabled:opacity-50 hover:scale-110"
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
          <h3 className="font-semibold text-stone-900 line-clamp-2 mb-3 group-hover:text-[#2d6a4f] transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-2xl font-bold text-[#2d6a4f]">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-stone-400 line-through">
                {formatPrice(0)}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {!isOutOfStock && product.inventory_quantity <= 5 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-sm">🔥</span>
              <p className="text-xs text-amber-600 font-medium">
                Only {product.inventory_quantity} left - Selling fast!
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
