"use client";
import { useState, useEffect } from "react";
import { ProductFormData, generateSlug } from "@/utils/product-utils";

interface ProductBasicInfoProps {
  formData: ProductFormData;
  onChange: (data: Partial<ProductFormData>) => void;
  errors: Record<string, string>;
  disabled?: boolean;
}

export default function ProductBasicInfo({
  formData,
  onChange,
  errors,
  disabled = false,
}: ProductBasicInfoProps) {
  // Track if user has manually edited the slug
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Reset manual editing flag when form data is reset (for new products)
  useEffect(() => {
    if (!formData.name && !formData.slug) {
      setSlugManuallyEdited(false);
    }
  }, [formData.name, formData.slug]);

  // Auto-generate slug when name changes (only if not manually edited)
  useEffect(() => {
    if (formData.name && !slugManuallyEdited) {
      const newSlug = generateSlug(formData.name);
      if (newSlug !== formData.slug) {
        onChange({ slug: newSlug });
      }
    }
  }, [formData.name, slugManuallyEdited, onChange]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    const cleanedSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    onChange({ slug: cleanedSlug });
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            <p className="text-sm text-gray-500">Essential product details</p>
          </div>
        </div>
      </div>

      <div className="card-body space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className={`input ${errors.name ? 'border-red-300' : ''}`}
            placeholder="Enter product name"
            disabled={disabled}
            maxLength={255}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.name.length}/255 characters
          </p>
        </div>

        {/* Product Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={4}
            className={`input resize-none ${errors.description ? 'border-red-300' : ''}`}
            placeholder="Describe your product in detail..."
            disabled={disabled}
            maxLength={2000}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/2000 characters. Be detailed and descriptive.
          </p>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <textarea
            value={formData.short_description || ''}
            onChange={(e) => onChange({ short_description: e.target.value })}
            rows={2}
            className="input resize-none"
            placeholder="Brief product summary for listings..."
            disabled={disabled}
            maxLength={300}
          />
          <p className="mt-1 text-xs text-gray-500">
            {(formData.short_description || '').length}/300 characters. Used in product listings.
          </p>
        </div>

        {/* URL Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              /products/
            </span>
            <input
              type="text"
              value={formData.slug}
              onChange={handleSlugChange}
              className={`input rounded-l-none ${errors.slug ? 'border-red-300' : ''}`}
              placeholder="product-slug"
              disabled={disabled}
              pattern="[a-z0-9-]+"
            />
            {slugManuallyEdited && formData.name && (
              <button
                type="button"
                onClick={() => {
                  setSlugManuallyEdited(false);
                  onChange({ slug: generateSlug(formData.name) });
                }}
                className="ml-2 btn-outline px-3 py-2 text-sm"
                disabled={disabled}
                title="Reset to auto-generated slug"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {slugManuallyEdited
              ? "Manually edited. Click reset button to auto-generate from name again."
              : "Auto-generated from product name. Edit to customize."
            }
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            value={formData.tags || ''}
            onChange={(e) => onChange({ tags: e.target.value })}
            className="input"
            placeholder="electronics, gadgets, wireless (comma-separated)"
            disabled={disabled}
          />
          <p className="mt-1 text-xs text-gray-500">
            Comma-separated tags to help customers find your product.
          </p>
        </div>

        {/* Product Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              id="is_active"
              type="checkbox"
              checked={formData.is_active ?? true}
              onChange={(e) => onChange({ is_active: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={disabled}
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Active (visible to customers)
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="is_featured"
              type="checkbox"
              checked={formData.is_featured ?? false}
              onChange={(e) => onChange({ is_featured: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={disabled}
            />
            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
              Featured product
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}