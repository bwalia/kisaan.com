"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import CategorySelector from "@/components/CategorySelector";

function CategoriesContent() {
  const [categories, setCategories] = useState<any[]>([]);
  const [stores, setStores] = useState<{ uuid: string; name: string }[]>([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedStoreName, setSelectedStoreName] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdCategory, setCreatedCategory] = useState<Category | null>(null);
  const [showDelete, setShowDelete] = useState<{
    open: boolean;
    category: any | null;
  }>({ open: false, category: null });

  type Category = {
    uuid: string;
    name: string;
    description?: string;
    slug?: string;
    sort_order?: number | string;
    is_active?: boolean;
    [key: string]: any;
  };

  // New state for category selector
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    slug: "",
    sort_order: "0",
  });

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      const storeParam = searchParams.get("store");
      if (storeParam) setSelectedStore(storeParam);
      loadData();
    }
  }, [user, authLoading, router, searchParams]);

  const loadData = async () => {
    try {
      const storesResponse = await api.getMyStores();
      const storesData = Array.isArray(storesResponse?.data)
        ? storesResponse.data
        : Array.isArray(storesResponse)
        ? storesResponse
        : [];
      setStores(storesData);

      if (selectedStore) loadCategories(selectedStore);
    } catch (error) {
      console.error("Failed to load data:", error);
      setStores([]);
    } finally {
      setDataLoading(false);
    }
  };

  const loadCategories = async (storeId: string) => {
    try {
      const response = await api.getCategories(storeId);
      const categoriesData = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    }
  };

  const handleStoreChange = (storeId: string) => {
    setSelectedStore(storeId);
    const store = stores.find((s: any) => s.uuid === storeId);
    setSelectedStoreName(store?.name || "");
    if (storeId) loadCategories(storeId);
    else setCategories([]);
  };

  // Handle category creation from CategorySelector
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

      loadCategories(selectedStore);
      setCreatedCategory(result);
      setShowSuccessModal(true);
      setShowCategorySelector(false);
    } catch (error: any) {
      throw new Error(error.message || "Failed to create category");
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !selectedStore) return;

    try {
      await api.updateCategory(editingCategory.uuid, {
        ...editFormData,
        store_id: selectedStore
      });

      setEditingCategory(null);
      setEditFormData({ name: "", description: "", slug: "", sort_order: "0" });
      loadCategories(selectedStore);
    } catch (error: any) {
      alert("Failed to update category: " + (error.message || "Please try again"));
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setEditFormData({
      name: category.name,
      description: category.description || "",
      slug: category.slug || "",
      sort_order: category.sort_order?.toString() || "0",
    });
  };

  const requestDelete = (category: any) => {
    setShowDelete({ open: true, category });
  };

  const confirmDelete = async () => {
    if (!showDelete.category) return;
    try {
      await api.deleteCategory(showDelete.category.uuid);
      loadCategories(selectedStore);
    } catch (error: any) {
      alert("Failed to delete category: " + error.message);
    } finally {
      setShowDelete({ open: false, category: null });
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Auto-generate slug from name if name is being changed
      if (name === "name") {
        const autoSlug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        newData.slug = autoSlug;
      }

      return newData;
    });
  };

  const handleContinueToProducts = () => {
    setShowSuccessModal(false);
    if (selectedStore) {
      router.push(`/seller/products?store=${selectedStore}`);
    }
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    router.push("/seller/dashboard");
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner text-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
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
                <h1 className="page-title">Product Categories</h1>
                <p className="page-subtitle text-balance">
                  {selectedStoreName
                    ? `Organize products in "${selectedStoreName}" with categories`
                    : "Create and manage product categories for better organization"}
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
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    {categories.length}{" "}
                    {categories.length === 1 ? "category" : "categories"}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCategorySelector(true)}
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search or Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Store Selector */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Store Selection
              </h2>
              <p className="text-sm text-gray-500">
                Choose which store to manage categories for
              </p>
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
                  You need to select a store before creating categories
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Category Selector Modal */}
        {showCategorySelector && (
          <div className="modal-overlay">
            <div className="modal">
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Smart Category Management
                      </h2>
                      <p className="text-sm text-gray-500">
                        Search existing categories or create a new one
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
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Category Selection
                  </label>
                  <CategorySelector
                    storeId={selectedStore}
                    onCategorySelect={(category) => {
                      // If user selects existing category, we don't need to do anything special
                      console.log("Selected category:", category);
                    }}
                    onCategoryCreate={handleCategoryCreate}
                    placeholder="Type to search existing categories or create new..."
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
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
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Professional Category Management</p>
                      <ul className="space-y-1 text-blue-600">
                        <li>• Search existing categories to avoid duplicates</li>
                        <li>• Create new categories if they don't exist</li>
                        <li>• Categories are automatically validated</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {editingCategory && (
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
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Edit Category
                      </h2>
                      <p className="text-sm text-gray-500">
                        Update category details
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingCategory(null)}
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

              <form onSubmit={handleEditSubmit} className="modal-body space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="input"
                      placeholder="e.g., Healthy foods, Organic foods, Books"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will be visible to customers
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      value={editFormData.description}
                      onChange={handleEditChange}
                      className="input resize-none"
                      placeholder="Describe what products belong in this category..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        URL Slug <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-mono">
                          /category/
                        </span>
                        <input
                          type="text"
                          name="slug"
                          required
                          value={editFormData.slug}
                          onChange={handleEditChange}
                          className="input rounded-l-none font-mono"
                          placeholder="healthy-foods"
                          pattern="[a-z0-9-]+"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Only lowercase letters, numbers, and dashes
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        name="sort_order"
                        min="0"
                        value={editFormData.sort_order}
                        onChange={handleEditChange}
                        className="input"
                        placeholder="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Lower numbers appear first
                      </p>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="btn-outline btn-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Update Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && createdCategory && (
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
                    🎉 Category Created Successfully!
                  </h2>
                  <p className="text-gray-600 mb-4 text-balance">
                    <strong>"{createdCategory.name}"</strong> category has been
                    created for your store.
                  </p>
                  <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3 mx-auto max-w-sm">
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
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <span className="font-mono">
                      /category/{createdCategory.slug}
                    </span>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ready to add products?
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="icon icon-sm mr-3 text-blue-600 flex-shrink-0"
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
                      <span className="text-sm">
                        Now you can add products to this category and start
                        selling!
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleContinueToProducts}
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
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    Add Products
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

        {/* Confirm Delete */}
        <ConfirmDialog
          open={showDelete.open}
          title="Delete Category"
          message={`Are you sure you want to delete "${
            showDelete.category?.name || ""
          }"?`}
          confirmText="Delete"
          onCancel={() => setShowDelete({ open: false, category: null })}
          onConfirm={confirmDelete}
        />

        {/* Categories List */}
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
              Select a Store to Manage Categories
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-balance">
              Choose one of your stores above to create and organize product
              categories.
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
              Categories help customers find products easily
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-balance">
              Ready to Create Your First Category?
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-balance">
              Categories help organize your products and make it easier for
              customers to find what they're looking for.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setShowCategorySelector(true)}
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
                Create Your First Category
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
                  Easy to organize
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
                  Better customer experience
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((category: any) => (
              <div key={category.uuid} className="card hover-lift">
                <div className="card-body">
                  {/* Category Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
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
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                            {category.description || "No description provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`badge flex-shrink-0 ${
                        category.is_active ? "badge-success" : "badge-gray"
                      }`}
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Category URL */}
                  <div className="flex items-center text-sm text-gray-500 mb-4 p-2 bg-gray-50 rounded-md">
                    <svg
                      className="icon icon-sm mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <span className="font-mono text-xs truncate">
                      /category/{category.slug}
                    </span>
                  </div>

                  {/* Category Stats */}
                  <div className="flex items-center justify-between mb-4 p-2 bg-blue-50 rounded-md">
                    <span className="text-xs text-blue-600 font-medium">
                      Sort Order: {category.sort_order || 0}
                    </span>
                    <span className="text-xs text-blue-600">
                      #{category.sort_order || 0}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(category)}
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
                      onClick={() => requestDelete(category)}
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

export default function SellerCategories() {
  return (
    <Suspense
      fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}
    >
      <CategoriesContent />
    </Suspense>
  );
}
