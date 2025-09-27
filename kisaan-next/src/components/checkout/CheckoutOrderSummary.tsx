'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/home-utils';
import type { CheckoutOrderSummaryProps } from '@/types/checkout';

export default function CheckoutOrderSummary({
  cartItems,
  subtotal,
  tax,
  shipping,
  discount = 0,
  total,
  onEditCart
}: CheckoutOrderSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getProductImage = (images?: string | string[]) => {
    try {
      if (!images) return null;

      if (Array.isArray(images)) {
        return images[0] || null;
      }

      if (typeof images === 'string') {
        if (images === '') return null;
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed[0] || null : null;
      }

      return null;
    } catch {
      return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 sticky top-8">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            {isExpanded ? 'Hide' : 'Show'} details
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </p>
          {onEditCart && (
            <Link
              href="/cart"
              className="text-sm text-[#16a34a] hover:text-[#16a34a] font-medium"
            >
              Edit cart
            </Link>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="max-h-80 overflow-y-auto">
          <div className="p-6 space-y-4">
            {cartItems.map((item) => {
              const productImage = getProductImage(item.images);

              return (
                <div key={`${item.product_uuid}_${item.variant_uuid || 'default'}`} className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    {/* Quantity Badge */}
                    <div className="relative -mt-2 -mr-2 flex justify-end">
                      <span className="bg-gray-900 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {item.name}
                    </h4>
                    {item.variant_title && (
                      <p className="text-xs text-gray-600 mt-1">
                        {item.variant_title}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        {formatPrice(item.price)} each
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Totals */}
      <div className="p-6 border-t border-gray-200 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping:</span>
          <span className={`${shipping === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}`}>
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax:</span>
          <span className="text-gray-900">{formatPrice(tax)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount:</span>
            <span className="text-green-600">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-lg font-bold text-[#16a34a]">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center gap-3 text-sm">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="font-medium text-gray-900">Secure Checkout</p>
            <p className="text-xs text-gray-600">256-bit SSL encryption</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Accepted payment methods:</p>
          <div className="flex items-center gap-2">
            <div className="text-2xl">💳</div>
            <span className="text-xs text-gray-500">Visa, Mastercard, American Express, Discover</span>
          </div>
        </div>
      </div>
    </div>
  );
}