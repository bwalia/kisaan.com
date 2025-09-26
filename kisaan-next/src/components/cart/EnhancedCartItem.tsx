'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/home-utils';

interface CartItemData {
  product_uuid: string;
  name: string;
  price: number;
  quantity: number;
  variant_title?: string;
  variant_uuid?: string;
  images?: string | string[];
  inventory_quantity?: number;
}

interface EnhancedCartItemProps {
  item: CartItemData;
}

export default function EnhancedCartItem({ item }: EnhancedCartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const { updateQuantity, removeFromCart } = useCart();

  const itemTotal = item.price * localQuantity;
  const maxQuantity = item.inventory_quantity || 99;

  const getProductImage = () => {
    try {
      if (!item.images) return null;

      if (Array.isArray(item.images)) {
        return item.images[0] || null;
      }

      if (typeof item.images === 'string') {
        if (item.images === '') return null;
        const parsed = JSON.parse(item.images);
        return Array.isArray(parsed) ? parsed[0] || null : null;
      }

      return null;
    } catch {
      return null;
    }
  };

  const productImage = getProductImage();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > maxQuantity || newQuantity === localQuantity) {
      return;
    }

    try {
      setIsUpdating(true);
      await updateQuantity(item.product_uuid, newQuantity, item.variant_uuid);
      setLocalQuantity(newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // Revert to original quantity on error
      setLocalQuantity(item.quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await removeFromCart(item.product_uuid, item.variant_uuid);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setIsRemoving(false);
    }
  };

  if (isRemoving) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 opacity-50">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#fe004d]"></div>
          <span className="ml-2 text-gray-600">Removing...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Link href={`/products/${item.product_uuid}`}>
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {productImage ? (
                <img
                  src={productImage}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.product_uuid}`}>
                <h3 className="font-semibold text-lg text-gray-900 hover:text-[#fe004d] transition-colors line-clamp-2">
                  {item.name}
                </h3>
              </Link>

              {item.variant_title && (
                <p className="text-sm text-gray-600 mt-1">
                  Variant: <span className="font-medium">{item.variant_title}</span>
                </p>
              )}

              <div className="flex items-center gap-4 mt-3">
                <div className="text-lg font-bold text-[#fe004d]">
                  {formatPrice(item.price)}
                </div>

                {/* Stock Status */}
                {maxQuantity <= 5 && (
                  <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    Only {maxQuantity} left
                  </span>
                )}
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          {/* Quantity and Total */}
          <div className="flex items-center justify-between mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Qty:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(localQuantity - 1)}
                  disabled={isUpdating || localQuantity <= 1}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>

                <input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={localQuantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    const clampedValue = Math.min(Math.max(1, value), maxQuantity);
                    setLocalQuantity(clampedValue);
                  }}
                  onBlur={() => handleQuantityChange(localQuantity)}
                  disabled={isUpdating}
                  className="w-16 text-center border-0 focus:outline-none focus:ring-0 text-sm font-medium py-2 disabled:bg-gray-50"
                />

                <button
                  onClick={() => handleQuantityChange(localQuantity + 1)}
                  disabled={isUpdating || localQuantity >= maxQuantity}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              {isUpdating && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#fe004d] mr-2"></div>
                  Updating...
                </div>
              )}
            </div>

            {/* Item Total */}
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">
                {formatPrice(itemTotal)}
              </div>
              {localQuantity > 1 && (
                <div className="text-sm text-gray-500">
                  {formatPrice(item.price)} each
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}