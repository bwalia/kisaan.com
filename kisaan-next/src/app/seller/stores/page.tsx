"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

interface Store {
  id?: string;
  uuid: string;
  name: string;
  description?: string;
  slug: string;
  status: string;
  created_at?: string;
}

export default function SellerStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdStore, setCreatedStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
  });
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      loadStores();
    }
  }, [user, authLoading, router]);

  const loadStores = async () => {
    try {
      const response = await api.getMyStores();
      const storesData = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      setStores(storesData);
    } catch (error) {
      console.error("Failed to load stores:", error);
      setStores([]);
    } finally {
      setStoresLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creating) return;

    setCreating(true);
    try {
      const newStore = await api.createStore(formData);
      setShowForm(false);
      setFormData({ name: "", description: "", slug: "" });
      await loadStores();

      // Show success modal
      setCreatedStore(newStore);
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error("Failed to create store:", error);
      alert(
        "❌ Failed to create store: " + (error.message || "Please try again")
      );
    } finally {
      setCreating(false);
    }
  };

  const handleSetupCategories = () => {
    setShowSuccessModal(false);
    if (createdStore) {
      router.push(
        `/seller/categories?store=${createdStore.uuid || createdStore.id}`
      );
    }
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    router.push("/seller/dashboard");
  };

  const handleDeleteStore = async (store: any) => {
    if (!store?.uuid) return;

    const confirmMessage = `Are you sure you want to delete "${store.name}"? This will permanently delete the store, all its products, categories, and variants. This action cannot be undone.`;
    if (!confirm(confirmMessage)) return;

    try {
      await api.deleteStore(store.uuid);
      alert("Store deleted successfully");
      await loadStores();
    } catch (error: any) {
      console.error("Failed to delete store:", error);
      alert("Failed to delete store: " + (error?.message || "Unknown error"));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
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

  if (storesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner text-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your stores...</p>
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
                <h1 className="page-title">My Stores</h1>
                <p className="page-subtitle text-balance">
                  Create and manage your online stores to reach customers
                  worldwide
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    {stores.length} {stores.length === 1 ? "store" : "stores"}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(true)}
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create New Store
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="icon icon-md text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Create New Store
                      </h2>
                      <p className="text-sm text-gray-500">
                        Set up your online store in minutes
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => !creating && setShowForm(false)}
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

              <form onSubmit={handleSubmit} className="modal-body space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Store Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      disabled={creating}
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., My Awesome Store"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will be displayed to your customers
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      disabled={creating}
                      value={formData.description}
                      onChange={handleChange}
                      className="input resize-none"
                      placeholder="Tell customers what makes your store special..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Store URL <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-mono">
                        /store/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        required
                        disabled={creating}
                        value={formData.slug}
                        onChange={handleChange}
                        className="input rounded-l-none font-mono"
                        placeholder="my-store"
                        pattern="[a-z0-9-]+"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Only lowercase letters, numbers, and dashes allowed
                    </p>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
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
                        Creating...
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
                        Create Store
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && createdStore && (
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
                    🎉 Store Created Successfully!
                  </h2>
                  <p className="text-gray-600 mb-4 text-balance">
                    <strong>"{createdStore.name}"</strong> has been created and
                    is ready to go.
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
                      /store/{createdStore.slug}
                    </span>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900">
                    What's next?
                  </h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center text-gray-600 bg-blue-50 rounded-lg p-3">
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
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Set up product categories to organize your inventory
                    </div>
                    <div className="flex items-center text-gray-600 bg-green-50 rounded-lg p-3">
                      <svg
                        className="icon icon-sm mr-3 text-green-600 flex-shrink-0"
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
                      Add your first products with images and descriptions
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleSetupCategories}
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
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    Set up Categories
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
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {stores.length === 0 ? (
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
              Ready to Start Your First Store?
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-balance">
              Create your online store in minutes and start selling to customers
              around the world. It's free to get started!
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
                Create Your First Store
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
                  Free to start
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
                  Quick setup
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {stores.map((store: Store) => (
              <div key={store.uuid} className="card hover-lift">
                <div className="card-body">
                  {/* Store Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="icon icon-md text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                            {store.name}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                            {store.description || "No description provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`badge flex-shrink-0 ${
                        store.status === "active"
                          ? "badge-success"
                          : "badge-gray"
                      }`}
                    >
                      {store.status}
                    </span>
                  </div>

                  {/* Store URL */}
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
                      /{store.slug}
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      onClick={() =>
                        router.push(`/seller/categories?store=${store.uuid}`)
                      }
                      className="btn-ghost btn-sm text-purple-600 hover:bg-purple-50 hover:text-purple-700 border border-purple-200 justify-center"
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
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Categories
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/seller/products?store=${store.uuid}`)
                      }
                      className="btn-ghost btn-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700 border border-blue-200 justify-center"
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
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      Products
                    </button>
                  </div>

                  {/* Store Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() =>
                        router.push(`/seller/stores/${store.uuid}`)
                      }
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
                      Manage
                    </button>
                    <button
                      onClick={() => handleDeleteStore(store)}
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

                  {/* Store Info Footer */}
                  {store.created_at && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400">
                        Created{" "}
                        {new Date(store.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
