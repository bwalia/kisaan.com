"use client";
import { useState, useEffect } from "react";
import { ProductFormData, generateSKU } from "@/utils/product-utils";

interface ProductInventoryProps {
  formData: ProductFormData;
  onChange: (data: Partial<ProductFormData>) => void;
  errors: Record<string, string>;
  categories: any[];
  disabled?: boolean;
}

export default function ProductInventory({
  formData,
  onChange,
  errors,
  categories = [],
  disabled = false,
}: ProductInventoryProps) {
  const [suggestedSKU, setSuggestedSKU] = useState("");

  // Generate SKU suggestion when name or category changes
  useEffect(() => {
    if (formData.name && !formData.sku) {
      const selectedCategory = categories.find(cat => cat.uuid === formData.category_id);
      const suggestion = generateSKU(formData.name, selectedCategory?.name);
      setSuggestedSKU(suggestion);
    }
  }, [formData.name, formData.category_id, categories, formData.sku]);

  const handleUseSuggestedSKU = () => {
    onChange({ sku: suggestedSKU });
  };

  const inventoryQuantity = parseInt(formData.inventory_quantity) || 0;
  const lowStockThreshold = 10; // Could be configurable

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <svg
              className="w-4 h-4 text-purple-600"
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
            <h3 className="text-lg font-semibold text-gray-900">Inventory & SKU</h3>
            <p className="text-sm text-gray-500">Manage product inventory and identification</p>
          </div>
        </div>
      </div>

      <div className="card-body space-y-6">
        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SKU (Stock Keeping Unit) <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => onChange({ sku: e.target.value.toUpperCase() })}
              className={`input flex-1 font-mono ${errors.sku ? 'border-red-300' : ''}`}
              placeholder="PROD-ABC-123"
              disabled={disabled}
            />
            {suggestedSKU && !formData.sku && (
              <button
                type="button"
                onClick={handleUseSuggestedSKU}
                className="btn-outline px-3 py-2 text-sm"
                disabled={disabled}
              >
                Use: {suggestedSKU}
              </button>
            )}
          </div>
          {errors.sku && (
            <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Unique identifier for inventory tracking. Auto-generated suggestion available.
          </p>
        </div>

        {/* Track Inventory */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <input
              id="track_inventory"
              type="checkbox"
              checked={formData.track_inventory}
              onChange={(e) => onChange({ track_inventory: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={disabled}
            />
            <label htmlFor="track_inventory" className="ml-3">
              <div className="text-sm font-medium text-gray-900">
                Track inventory quantity
              </div>
              <div className="text-xs text-gray-500">
                Monitor stock levels and prevent overselling
              </div>
            </label>
          </div>
        </div>

        {/* Inventory Quantity */}
        {formData.track_inventory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inventory Quantity
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="0"
                value={formData.inventory_quantity}
                onChange={(e) => onChange({ inventory_quantity: e.target.value })}
                className={`input w-32 ${errors.inventory_quantity ? 'border-red-300' : ''}`}
                placeholder="0"
                disabled={disabled}
              />
              <div className="flex items-center space-x-2">
                {inventoryQuantity <= lowStockThreshold && inventoryQuantity > 0 && (
                  <div className="flex items-center text-yellow-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Low stock</span>
                  </div>
                )}
                {inventoryQuantity === 0 && (
                  <div className="flex items-center text-red-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Out of stock</span>
                  </div>
                )}
                {inventoryQuantity > lowStockThreshold && (
                  <div className="flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">In stock</span>
                  </div>
                )}
              </div>
            </div>
            {errors.inventory_quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.inventory_quantity}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Current number of items available for sale
            </p>
          </div>
        )}

        {/* Physical Product Details */}
        <div className="border-t pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Physical Product Details</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (lbs)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.weight || ''}
                onChange={(e) => onChange({ weight: e.target.value })}
                className={`input ${errors.weight ? 'border-red-300' : ''}`}
                placeholder="0.0"
                disabled={disabled}
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
              )}
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions (L × W × H)
              </label>
              <input
                type="text"
                value={formData.dimensions || ''}
                onChange={(e) => onChange({ dimensions: e.target.value })}
                className="input"
                placeholder="12 × 8 × 4 inches"
                disabled={disabled}
              />
            </div>
          </div>

          {/* Requires Shipping */}
          <div className="mt-4 flex items-center">
            <input
              id="requires_shipping"
              type="checkbox"
              checked={formData.requires_shipping ?? true}
              onChange={(e) => onChange({ requires_shipping: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={disabled}
            />
            <label htmlFor="requires_shipping" className="ml-2 block text-sm text-gray-900">
              This product requires shipping
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}