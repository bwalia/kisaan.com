"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Product } from "@/types";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import CategorySelector from "@/components/CategorySelector";
import ImageUpload from "@/components/products/ImageUpload";
import ProductBasicInfo from "@/components/products/ProductBasicInfo";
import ProductPricing from "@/components/products/ProductPricing";
import ProductInventory from "@/components/products/ProductInventory";
import {
  ProductFormData,
  validateProductForm,
  prepareProductForSubmission,
  getInitialProductFormData,
  productToFormData,
  formatPrice,
} from "@/utils/product-utils";

function ProductsContent() {
  // State management
  const [products, setProducts] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedStoreName, setSelectedStoreName] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<any | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    product: any | null;
  }>({ open: false, product: null });

  // Form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(getInitialProductFormData());
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Effects
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      loadData();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const storeParam = searchParams.get("store");
    if (storeParam && storeParam !== selectedStore) {
      setSelectedStore(storeParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedStore && stores.length > 0) {
      loadProductsForStore(selectedStore);
    }
  }, [selectedStore, stores]);

  // Data loading functions
  const loadData = async () => {
    try {
      const storesResponse = await api.getMyStores();
      const storesData = Array.isArray(storesResponse?.data)
        ? storesResponse.data
        : Array.isArray(storesResponse)
        ? storesResponse
        : [];
      setStores(storesData);

      const storeParam = searchParams.get("store");
      if (storeParam && storesData.find((s: any) => s.uuid === storeParam)) {
        setSelectedStore(storeParam);
      } else if (storesData.length > 0 && !selectedStore) {
        setSelectedStore(storesData[0].uuid);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      setStores([]);
      setProducts([]);
    } finally {
      setDataLoading(false);
    }
  };

  const loadProductsForStore = async (storeId: string) => {
    if (!storeId) return;
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        api.getStoreProducts(storeId),
        api.getCategories(storeId),
      ]);

      const productsData = Array.isArray(productsResponse?.data)
        ? productsResponse.data
        : Array.isArray(productsResponse)
        ? productsResponse
        : [];

      const categoriesData = Array.isArray(categoriesResponse?.data)
        ? categoriesResponse.data
        : Array.isArray(categoriesResponse)
        ? categoriesResponse
        : [];

      setProducts(productsData);
      setCategories(categoriesData);

      // Update selected store name
      const store = stores.find((s) => s.uuid === storeId);
      setSelectedStoreName(store?.name || "");
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
      setCategories([]);
    }
  };

  // Form handlers
  const handleFormDataChange = (newData: Partial<ProductFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
    // Clear validation errors for changed fields
    const clearedErrors = { ...validationErrors };
    Object.keys(newData).forEach(key => {
      delete clearedErrors[key];
    });
    setValidationErrors(clearedErrors);
  };

  const handleStoreChange = (storeId: string) => {
    setSelectedStore(storeId);
    const store = stores.find((s: any) => s.uuid === storeId);
    setSelectedStoreName(store?.name || "");
    if (storeId) {
      loadProductsForStore(storeId);
    } else {
      setProducts([]);
      setCategories([]);
    }
  };

  const handleCategoryCreate = async (categoryData: {
    name: string;
    description: string;
  }) => {
    if (!selectedStore) {
      throw new Error("Please select a store first");
    }

    try {
      const result = await api.createCategory({
        ...categoryData,
        store_id: selectedStore
      });

      // Reload categories
      const categoriesResponse = await api.getCategories(selectedStore);
      const categoriesData = Array.isArray(categoriesResponse?.data)
        ? categoriesResponse.data
        : Array.isArray(categoriesResponse)
        ? categoriesResponse
        : [];
      setCategories(categoriesData);

      // Auto-select the new category
      setSelectedCategory(result);
      handleFormDataChange({ category_id: result.uuid });
      setShowCategorySelector(false);
    } catch (error: any) {
      throw new Error(error.message || "Failed to create category");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStore) {
      alert("Please select a store first");
      return;
    }

    if (creating) return;

    // Validate form
    const errors = validateProductForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Scroll to first error
      const firstErrorElement = document.querySelector(`[name="${Object.keys(errors)[0]}"]`);
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setCreating(true);
    try {
      const productData = prepareProductForSubmission(formData);
      let result;

      if (editingProduct) {
        result = await api.updateProduct(editingProduct.uuid, productData);
      } else {
        result = await api.createProduct(selectedStore, productData);
      }

      // Reset form and reload products
      resetForm();
      loadProductsForStore(selectedStore);

      // Show success modal for new products
      if (!editingProduct) {
        setCreatedProduct(result);
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      alert(
        `Failed to ${editingProduct ? "update" : "create"} product: ` +
          (error.message || "Please try again")
      );
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData(productToFormData(product));
    setValidationErrors({});

    // Set selected category
    const category = categories.find(cat => cat.uuid === product.category_id);
    setSelectedCategory(category);

    setShowForm(true);
  };

  const handleDelete = (product: any) => {
    setDeleteDialog({ open: true, product });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.product) return;

    try {
      await api.deleteProduct(deleteDialog.product.uuid);
      loadProductsForStore(selectedStore);
    } catch (error: any) {
      alert("Failed to delete product: " + (error.message || "Please try again"));
    } finally {
      setDeleteDialog({ open: false, product: null });
    }
  };

  const resetForm = () => {
    setFormData(getInitialProductFormData());
    setValidationErrors({});
    setSelectedCategory(null);
    setEditingProduct(null);
    setShowForm(false);
    setShowCategorySelector(false);
  };

  const handleContinueToVariants = () => {
    setShowSuccessModal(false);
    if (createdProduct && selectedStore) {
      router.push(`/seller/products/${createdProduct.uuid}/variants?store=${selectedStore}`);
    }
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    router.push("/seller/dashboard");
  };

  // Loading state
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16a34a] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="page-header">
        <div className="container mx-auto px-6">
          <div className="page-header-content">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex-1">
                <h1 className="page-title">Products</h1>
                <p className="page-subtitle text-balance">
                  {selectedStoreName
                    ? `Manage products for "${selectedStoreName}"`
                    : "Create and manage your product catalog"}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="icon icon-sm mr-2"
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
                    {products.length} {products.length === 1 ? "product" : "products"}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(true)}
                  disabled={!selectedStore}
                  className={`btn-primary btn-md inline-flex items-center gap-2 ${
                    !selectedStore ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <svg
                    className="icon icon-sm"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Store Selector */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Store Selection</h2>
              <p className="text-sm text-gray-500">Choose which store to manage products for</p>
            </div>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Select Store <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedStore}
                  onChange={(e) => handleStoreChange(e.target.value)}
                  className="input pr-10 appearance-none"
                >
                  <option value="">Choose a store...</option>
                  {stores.map((store: any) => (
                    <option key={store.uuid} value={store.uuid}>
                      {store.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="icon icon-sm text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </div>
              </div>
              {!selectedStore && (
                <p className="text-xs text-gray-500 mt-1">
                  You need to select a store before creating products
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal max-w-6xl">
              <div className="modal-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="icon icon-md text-blue-600"
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
                      <h2 className="text-lg font-semibold text-gray-900">
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {editingProduct ? "Update product details" : "Create a new product for your store"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetForm}
                    disabled={creating}
                    className="btn-ghost btn-icon text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="icon icon-md"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="modal-body">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-8">
                    {/* Basic Info */}
                    <ProductBasicInfo
                      formData={formData}
                      onChange={handleFormDataChange}
                      errors={validationErrors}
                      disabled={creating}
                    />

                    {/* Pricing */}
                    <ProductPricing
                      formData={formData}
                      onChange={handleFormDataChange}
                      errors={validationErrors}
                      disabled={creating}
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    {/* Images */}
                    <div className="card">
                      <div className="card-header">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                            <svg
                              className="w-4 h-4 text-indigo-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                            <p className="text-sm text-gray-500">Upload images or add image URLs</p>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <ImageUpload
                          images={formData.images}
                          onImagesChange={(images) => handleFormDataChange({ images })}
                          maxImages={5}
                          disabled={creating}
                        />
                        {validationErrors.images && (
                          <p className="mt-3 text-sm text-red-600">{validationErrors.images}</p>
                        )}
                      </div>
                    </div>

                    {/* Category */}
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
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Category</h3>
                            <p className="text-sm text-gray-500">Choose or create a product category</p>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Category <span className="text-red-500">*</span>
                          </label>
                          {selectedCategory ? (
                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                              <div className="flex items-center text-sm text-green-700">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span className="font-medium">{selectedCategory.name}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCategory(null);
                                  handleFormDataChange({ category_id: "" });
                                }}
                                className="text-green-600 hover:text-green-800"
                                disabled={creating}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowCategorySelector(true)}
                              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={creating}
                            >
                              <div className="text-center">
                                <svg className="mx-auto h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <div className="mt-2 text-sm text-gray-600">
                                  <span className="font-medium text-blue-600 hover:text-blue-500">
                                    Click to select category
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">Search existing or create new</p>
                              </div>
                            </button>
                          )}
                          {validationErrors.category_id && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.category_id}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Width Section */}
                <div className="mt-8">
                  <ProductInventory
                    formData={formData}
                    onChange={handleFormDataChange}
                    errors={validationErrors}
                    categories={categories}
                    disabled={creating}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={creating}
                    className="btn-outline btn-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="btn-primary btn-md inline-flex items-center gap-2"
                  >
                    {creating ? (
                      <>
                        <div className="loading-spinner"></div>
                        {editingProduct ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <svg
                          className="icon icon-sm"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        {editingProduct ? "Update Product" : "Create Product"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Category Selector Modal */}
        {showCategorySelector && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="icon icon-md text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Select Product Category
                      </h2>
                      <p className="text-sm text-gray-500">
                        Choose existing category or create a new one
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCategorySelector(false)}
                    className="btn-ghost btn-icon text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="icon icon-md"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="modal-body">
                <CategorySelector
                  storeId={selectedStore}
                  onCategorySelect={(category) => {
                    if (category) {
                      setSelectedCategory(category);
                      handleFormDataChange({ category_id: category.uuid });
                      setShowCategorySelector(false);
                    }
                  }}
                  onCategoryCreate={handleCategoryCreate}
                  placeholder="Search categories for your product..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && createdProduct && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-body text-center py-8">
                {/* Success Icon */}
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="icon icon-xl text-green-600"
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

                {/* Success Message */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    🎉 Product Created Successfully!
                  </h2>
                  <p className="text-gray-600 mb-4 text-balance">
                    <strong>"{createdProduct.name}"</strong> has been added to your store.
                  </p>
                  <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3 mx-auto max-w-sm">
                    <span className="font-mono">
                      SKU: {createdProduct.sku}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleContinueToVariants}
                    className="btn-primary btn-md inline-flex items-center gap-2"
                  >
                    <svg
                      className="icon icon-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                      />
                    </svg>
                    Add Variants
                  </button>
                  <button
                    onClick={handleGoToDashboard}
                    className="btn-outline btn-md inline-flex items-center gap-2"
                  >
                    <svg
                      className="icon icon-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h6l2 2h6a2 2 0 012 2v1"
                      />
                    </svg>
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={deleteDialog.open}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteDialog.product?.name || ""}"?`}
          confirmText="Delete"
          onCancel={() => setDeleteDialog({ open: false, product: null })}
          onConfirm={confirmDelete}
        />

        {/* Products List */}
        {!selectedStore ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-balance">
              Select a Store to Manage Products
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-balance">
              Choose one of your stores above to create and manage products.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <svg
                className="icon icon-sm mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Products help customers discover what you're selling
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-balance">
              Ready to Add Your First Product?
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-balance">
              Start selling by adding products to your store. Include great photos, detailed descriptions, and competitive pricing.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary btn-lg inline-flex items-center gap-2"
              >
                <svg
                  className="icon icon-md"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Your First Product
              </button>

              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg
                    className="icon icon-sm mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Professional images
                </div>
                <div className="flex items-center">
                  <svg
                    className="icon icon-sm mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Smart inventory tracking
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <div key={product.uuid} className="card hover-lift">
                <div className="card-body">
                  {/* Product Image */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                    {product.images && JSON.parse(product.images).length > 0 ? (
                      <img
                        src={JSON.parse(product.images)[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                        {product.name}
                      </h3>
                      <span
                        className={`badge flex-shrink-0 ml-2 ${
                          product.is_active ? "badge-success" : "badge-gray"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>SKU: {product.sku}</span>
                      <span>Stock: {product.inventory_quantity || 0}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.compare_price)}
                          </span>
                        )}
                      </div>
                      {product.is_featured && (
                        <div className="badge badge-warning text-xs">Featured</div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 btn-outline btn-sm justify-center"
                    >
                      <svg
                        className="icon icon-sm mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => router.push(`/seller/products/${product.uuid}/variants?store=${selectedStore}`)}
                      className="btn-ghost btn-sm text-blue-600 hover:bg-blue-50 border border-blue-200 px-3"
                    >
                      <svg
                        className="icon icon-sm mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                        />
                      </svg>
                      Variants
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="btn-ghost btn-sm text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200 px-3"
                    >
                      <svg
                        className="icon icon-sm"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SellerProducts() {
  return (
    <Suspense
      fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}
    >
      <ProductsContent />
    </Suspense>
  );
}