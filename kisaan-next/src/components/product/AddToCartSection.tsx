'use client';

import { useState } from 'react';
import { ProductVariant } from '@/types';
import QuantitySelector from './QuantitySelector';

interface AddToCartSectionProps {
  variants: ProductVariant[];
  selectedVariant: string;
  quantity: number;
  currentStock: number;
  isLoading: boolean;
  onVariantChange: (variantId: string) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  productPrice: number;
}

export default function AddToCartSection({
  variants,
  selectedVariant,
  quantity,
  currentStock,
  isLoading,
  onVariantChange,
  onQuantityChange,
  onAddToCart,
  productPrice,
}: AddToCartSectionProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isOutOfStock = currentStock <= 0;

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
  };

  return (
    <div className="space-y-6">
      {/* Variant Selection */}
      {variants.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">
            Select Option
          </label>
          <select
            value={selectedVariant}
            onChange={(e) => onVariantChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e] text-sm"
          >
            <option value="">Choose an option</option>
            {variants
              .filter((v) => v.is_active)
              .map((variant) => (
                <option key={variant.uuid} value={variant.uuid}>
                  {variant.title}
                  {variant.price && variant.price !== productPrice && (
                    ` (+$${(variant.price - productPrice).toFixed(2)})`
                  )}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Quantity Selector */}
      <QuantitySelector
        quantity={quantity}
        maxQuantity={currentStock}
        onQuantityChange={onQuantityChange}
        disabled={isOutOfStock}
      />

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          disabled={isLoading || isOutOfStock}
          className="w-full bg-[#22c55e] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#16a34a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding to Cart...
            </>
          ) : isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13l-1.1 5m0 0h9.1M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                />
              </svg>
              Add to Cart
            </>
          )}
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleWishlistToggle}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <svg
              className={`w-5 h-5 ${
                isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'
              }`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-sm font-medium">
              {isWishlisted ? 'Wishlisted' : 'Wishlist'}
            </span>
          </button>

          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Stock Warning */}
      {!isOutOfStock && currentStock <= 5 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-sm font-medium text-orange-800">
              Hurry! Only {currentStock} items left in stock
            </span>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}