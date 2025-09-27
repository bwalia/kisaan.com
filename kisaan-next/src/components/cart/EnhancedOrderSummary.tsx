'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/home-utils';

interface EnhancedOrderSummaryProps {
  className?: string;
}

export default function EnhancedOrderSummary({ className }: EnhancedOrderSummaryProps) {
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const { total, cart } = useCart();
  const router = useRouter();

  const subtotal = typeof total === 'number' ? total : 0;
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal >= 50 ? 0 : 9.99; // Free shipping over $50
  const discount = promoDiscount;
  const totalAmount = Math.max(0, subtotal + tax + shipping - discount);

  // Get cart item count
  const itemCount = cart && typeof cart === 'object'
    ? Object.values(cart).reduce((count, item: any) => count + (item?.quantity || 0), 0)
    : 0;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);

    // Simulate promo code validation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock promo codes
    const promoCodes: { [key: string]: number } = {
      'SAVE10': subtotal * 0.1,
      'WELCOME20': Math.min(subtotal * 0.2, 50),
      'FREESHIP': shipping,
    };

    const discount = promoCodes[promoCode.toUpperCase()];

    if (discount) {
      setPromoDiscount(discount);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }

    setIsApplyingPromo(false);
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoApplied(false);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 sticky top-8 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
        <p className="text-sm text-gray-600 mt-1">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {/* Promo Code Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Promo Code
        </label>
        {!promoApplied ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] text-sm"
              disabled={isApplyingPromo}
            />
            <button
              onClick={handleApplyPromo}
              disabled={!promoCode.trim() || isApplyingPromo}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isApplyingPromo ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Apply'
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-green-800">{promoCode}</span>
            </div>
            <button
              onClick={handleRemovePromo}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Remove
            </button>
          </div>
        )}

        {/* Promo Code Hints */}
        <div className="mt-2 text-xs text-gray-500">
          Try: SAVE10, WELCOME20, or FREESHIP
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping:</span>
          <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>

        {shipping > 0 && subtotal > 0 && subtotal < 50 && (
          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
            Add {formatPrice(50 - subtotal)} more for free shipping!
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Tax (10%):</span>
          <span>{formatPrice(tax)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Total:</span>
            <span className="text-[#16a34a]">{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          disabled={itemCount === 0}
          className="w-full bg-[#16a34a] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#16a34a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure Checkout
        </button>

        <button
          onClick={handleContinueShopping}
          className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Easy Returns</span>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          🔒 SSL Encrypted • Powered by Stripe
        </p>
      </div>
    </div>
  );
}