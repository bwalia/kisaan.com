'use client';

import { Product } from '@/types';
import { formatPrice } from '@/lib/home-utils';

interface ProductInfoProps {
  product: Product;
  currentPrice: number;
  currentStock: number;
}

export default function ProductInfo({ product, currentPrice, currentStock }: ProductInfoProps) {
  const isOutOfStock = currentStock <= 0;
  const hasDiscount = false; // Remove compare_price reference as it doesn't exist in Product type
  const discountPercentage = 0;

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {product.name}
        </h1>

        {/* Price Section */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#22c55e]">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(0)}
                </span>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                  -{discountPercentage}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isOutOfStock
                ? 'bg-red-100 text-red-800'
                : currentStock <= 5
                ? 'bg-orange-100 text-orange-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {isOutOfStock
              ? 'Out of Stock'
              : currentStock <= 5
              ? `Only ${currentStock} left`
              : 'In Stock'
            }
          </span>
          {!isOutOfStock && currentStock > 5 && (
            <span className="text-sm text-gray-500">
              {currentStock} available
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Description
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Product Details */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Product Details
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.sku && (
              <div>
                <dt className="text-sm font-medium text-gray-500">SKU</dt>
                <dd className="text-sm text-gray-900 font-mono">{product.sku}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Availability</dt>
              <dd className={`text-sm font-medium ${
                isOutOfStock ? 'text-red-600' : 'text-green-600'
              }`}>
                {isOutOfStock ? 'Out of stock' : `${currentStock} in stock`}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  product.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Free Shipping</p>
              <p className="text-xs text-gray-500">On orders over $50</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">30-Day Returns</p>
              <p className="text-xs text-gray-500">Easy return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Secure Payment</p>
              <p className="text-xs text-gray-500">SSL encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}