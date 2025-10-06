"use client";
import { ProductFormData, formatPrice, calculateDiscountPercentage } from "@/utils/product-utils";

interface ProductPricingProps {
  formData: ProductFormData;
  onChange: (data: Partial<ProductFormData>) => void;
  errors: Record<string, string>;
  disabled?: boolean;
}

export default function ProductPricing({
  formData,
  onChange,
  errors,
  disabled = false,
}: ProductPricingProps) {
  const price = parseFloat(formData.price) || 0;
  const comparePrice = parseFloat(formData.compare_price || '0') || 0;
  const discountPercent = calculateDiscountPercentage(price, comparePrice);

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
            <p className="text-sm text-gray-500">Set product pricing and discounts</p>
          </div>
        </div>
      </div>

      <div className="card-body space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Regular Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => onChange({ price: e.target.value })}
                className={`input pl-8 ${errors.price ? 'border-red-300' : ''}`}
                placeholder="0.00"
                disabled={disabled}
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              The selling price customers will pay
            </p>
          </div>

          {/* Compare Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compare at Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.compare_price}
                onChange={(e) => onChange({ compare_price: e.target.value })}
                className={`input pl-8 ${errors.compare_price ? 'border-red-300' : ''}`}
                placeholder="0.00"
                disabled={disabled}
              />
            </div>
            {errors.compare_price && (
              <p className="mt-1 text-sm text-red-600">{errors.compare_price}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Original price to show discount (optional)
            </p>
          </div>
        </div>

        {/* Price Preview */}
        {price > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Price Preview</h4>
            <div className="flex items-center space-x-4">
              <div className="text-lg font-semibold text-gray-900">
                {formatPrice(price)}
              </div>
              {comparePrice > price && (
                <>
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(comparePrice)}
                  </div>
                  <div className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                    {discountPercent}% OFF
                  </div>
                </>
              )}
            </div>
            {comparePrice > price && (
              <p className="text-xs text-green-600 mt-1">
                Customers save {formatPrice(comparePrice - price)}!
              </p>
            )}
          </div>
        )}

        {/* Pricing Tips */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Pricing Tips</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Research competitor pricing for similar products</li>
                  <li>Consider your costs, including materials and time</li>
                  <li>Use compare pricing to highlight value and savings</li>
                  <li>Test different price points to find the sweet spot</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}