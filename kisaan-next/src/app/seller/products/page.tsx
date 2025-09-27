"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Product } from "@/types";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

function ProductsContent() {
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

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    price: "",
    compare_price: "",
    sku: "",
    category_id: "",
    inventory_quantity: "0",
    track_inventory: true,
    images: [] as string[],
  });
  const [imageUrl, setImageUrl] = useState("");

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

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
    if (storeParam && storeParam !== selectedStore)
      setSelectedStore(storeParam);
  }, [searchParams]);

  useEffect(() => {
    if (selectedStore && stores.length > 0) loadProductsForStore(selectedStore);
  }, [selectedStore, stores]);

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
      if (storeParam && storesData.find((s: any) => s.uuid === storeParam))
        setSelectedStore(storeParam);
      else if (storesData.length > 0 && !selectedStore)
        setSelectedStore(storesData[0].uuid);
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
      setProducts(productsData);
      let categoriesData: any[] = [];
      if (Array.isArray(categoriesResponse?.data))
        categoriesData = categoriesResponse.data;
      else if (Array.isArray(categoriesResponse))
        categoriesData = categoriesResponse;
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
      setCategories([]);
    }
  };

  const handleStoreChange = (storeId: string) => {
    setSelectedStore(storeId);
    const store = stores.find((s: any) => s.uuid === storeId);
    setSelectedStoreName(store?.name || "");
    if (storeId) loadProductsForStore(storeId);
    else {
      setProducts([]);
      setCategories([]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const { name } = target as any;
    const type = (target as HTMLInputElement).type;
    const value =
      type === "checkbox"
        ? (target as HTMLInputElement).checked
        : (target as any).value;

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

      // Auto-format SKU to uppercase and valid characters only
      if (name === "sku" && value) {
        const formattedSKU = value
          .toUpperCase()
          .replace(/[^A-Z0-9-_]/g, "")
          .substring(0, 50); // Limit length
        newData.sku = formattedSKU;
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore) {
      alert("Please select a store first");
      return;
    }
    if (!formData.name.trim()) {
      alert("Product name is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert("Please enter a valid price");
      return;
    }
    if (formData.compare_price && parseFloat(formData.compare_price) < parseFloat(formData.price)) {
      alert("Compare price must be greater than or equal to the selling price");
      return;
    }
    if (creating) return;

    setCreating(true);
    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        slug: formData.slug.trim(),
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
        sku: formData.sku.trim(),
        category_id: formData.category_id || null,
        inventory_quantity: parseInt(formData.inventory_quantity) || 0,
        track_inventory: formData.track_inventory,
        images: JSON.stringify(formData.images.filter((img) => img.trim())),
      };

      let result;
      if (editingProduct) {
        result = await api.updateProduct(editingProduct.uuid, submitData);
      } else {
        result = await api.createProduct(selectedStore, submitData);
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        slug: "",
        price: "",
        compare_price: "",
        sku: "",
        category_id: "",
        inventory_quantity: "0",
        track_inventory: true,
        images: [],
      });
      setImageUrl("");
      await loadProductsForStore(selectedStore);

      // Show success modal for new product creation
      if (!editingProduct) {
        setCreatedProduct({ ...result, ...submitData });
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      console.error("Failed to save product:", error);
      alert(
        `Failed to ${editingProduct ? "update" : "create"} product: ` +
          (error?.message || "Unknown error")
      );
    } finally {
      setCreating(false);
    }
  };

  const requestDeleteProduct = (product: any) =>
    setDeleteDialog({ open: true, product });

  const confirmDeleteProduct = async () => {
    const product = deleteDialog.product;
    if (!product?.uuid) return setDeleteDialog({ open: false, product: null });
    try {
      await api.deleteProduct(product.uuid);
      if (selectedStore) await loadProductsForStore(selectedStore);
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product: " + (error?.message || "Unknown error"));
    } finally {
      setDeleteDialog({ open: false, product: null });
    }
  };

  const handleEdit = (product: any) => {
    if (!product) return;
    let productImages: string[] = [];
    try {
      if (product.images && typeof product.images === "string") {
        const parsed = JSON.parse(product.images);
        productImages = Array.isArray(parsed)
          ? parsed.filter((img) => typeof img === "string" && img.trim())
          : [];
      } else if (Array.isArray(product.images)) {
        productImages = product.images.filter(
          (img: string) => typeof img === "string" && img.trim()
        );
      }
    } catch (error) {
      console.error("Failed to parse product images:", error);
      productImages = [];
    }

    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      slug: product.slug || "",
      price: (typeof product.price === "number" ? product.price : 0).toString(),
      compare_price: (typeof product.compare_price === "number" ? product.compare_price : 0).toString() || "",
      sku: product.sku || "",
      category_id: product.category?.uuid || "",
      inventory_quantity: (typeof product.inventory_quantity === "number"
        ? product.inventory_quantity
        : 0
      ).toString(),
      track_inventory: product.track_inventory !== false,
      images: productImages,
    });
    setShowForm(true);
  };

  const handleViewVariants = () => {
    setShowSuccessModal(false);
    if (createdProduct) {
      router.push(`/seller/products/${createdProduct.uuid}/variants`);
    }
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    router.push('/seller/dashboard');
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner text-primary mx-auto mb-4"></div>
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
                <h1 className="page-title">Store Products</h1>
                <p className="page-subtitle text-balance">
                  {selectedStoreName
                    ? `Manage inventory and products for "${selectedStoreName}"`
                    : "Add and manage products across your stores"}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="icon icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    {products.length} {products.length === 1 ? 'product' : 'products'}
                  </div>
                  {selectedStore && categories.length > 0 && (
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="icon icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(true)}
                  disabled={!selectedStore}
                  className={`btn-primary btn-md inline-flex items-center gap-2 ${
                    !selectedStore ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <svg className="icon icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
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
                  <svg className="icon icon-sm text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </div>
              {!selectedStore && (
                <p className="text-xs text-gray-500 mt-1">
                  Select a store to manage products and inventory
                </p>
              )}
              {selectedStore && categories.length === 0 && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-xs text-yellow-700">
                    No categories found. <button onClick={() => router.push(`/seller/categories?store=${selectedStore}`)} className="text-yellow-800 underline hover:text-yellow-900">Create categories</button> first to better organize your products.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={deleteDialog.open}
          title="Delete Product"
          message={`Are you sure you want to delete "${
            deleteDialog.product?.name || ""
          }"? This will also delete all variants.`}
          onCancel={() => setDeleteDialog({ open: false, product: null })}
          onConfirm={confirmDeleteProduct}
          confirmText="Delete"
        />

        {/* Add Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-screen overflow-y-auto shadow-xl">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                      setFormData({
                        name: "",
                        description: "",
                        slug: "",
                        price: "",
                        compare_price: "",
                        sku: "",
                        category_id: "",
                        inventory_quantity: "0",
                        track_inventory: true,
                        images: [],
                      });
                      setImageUrl("");
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
                  >
                    <svg
                      className="w-5 h-5"
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

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      disabled={creating}
                      value={formData.sku}
                      onChange={handleChange}
                      className="input font-mono"
                      placeholder="TOMATO-FRESH-001"
                      maxLength={50}
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-formatted to uppercase (A-Z, 0-9, -, _ only)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    disabled={creating}
                    value={formData.description}
                    onChange={handleChange}
                    className="input resize-none"
                    placeholder="Describe your product features, benefits, and specifications..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product URL Slug <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-mono">
                      /product/
                    </span>
                    <input
                      type="text"
                      name="slug"
                      required
                      disabled={creating}
                      value={formData.slug}
                      onChange={handleChange}
                      className="input rounded-l-none font-mono"
                      placeholder="tomato-fresh"
                      pattern="[a-z0-9-]+"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">SEO-friendly URL (auto-generated from name)</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      required
                      disabled={creating}
                      value={formData.price}
                      onChange={handleChange}
                      className="input"
                      placeholder="29.99"
                    />
                    <p className="text-xs text-gray-500 mt-1">Selling price for customers</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compare Price ($)
                    </label>
                    <input
                      type="number"
                      name="compare_price"
                      step="0.01"
                      disabled={creating}
                      value={formData.compare_price}
                      onChange={handleChange}
                      className="input"
                      placeholder="39.99"
                    />
                    <p className="text-xs text-gray-500 mt-1">Original price (optional, for showing savings)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <div className="flex space-x-2">
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="input flex-1"
                      >
                        <option value="">No Category</option>
                        {categories.map((category: any) => (
                          <option key={category.uuid} value={category.uuid}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {categories.length === 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/seller/categories?store=${selectedStore}`
                            )
                          }
                          className="btn-secondary btn-sm whitespace-nowrap"
                        >
                          Create Categories
                        </button>
                      )}
                    </div>
                    {categories.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Create categories first to organize your products better
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inventory Quantity
                    </label>
                    <input
                      type="number"
                      name="inventory_quantity"
                      min="0"
                      value={formData.inventory_quantity}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      name="track_inventory"
                      checked={formData.track_inventory}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">
                      Track inventory
                    </label>
                  </div>
                </div>

                {/* Product Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Enter image URL"
                        className="input flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const url = imageUrl.trim();
                          if (
                            url &&
                            (url.startsWith("http://") ||
                              url.startsWith("https://"))
                          ) {
                            setFormData((prev) => ({
                              ...prev,
                              images: [...prev.images, url],
                            }));
                            setImageUrl("");
                          } else if (url) {
                            alert(
                              "Please enter a valid image URL starting with http:// or https://"
                            );
                          }
                        }}
                        className="btn-secondary btn-sm"
                      >
                        Add
                      </button>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((img, index) => (
                          <div key={index} className="relative">
                            <img
                              src={img}
                              alt={`Product ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM5Ljc5IDEzLjc5IDkuNzkgMTAuMjEgMTIgOEMxNC4yMSAxMC4yMSAxNC4yMSAxMy43OSAxMiAxNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  images: prev.images.filter(
                                    (_, i) => i !== index
                                  ),
                                }));
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                      setFormData({
                        name: "",
                        description: "",
                        slug: "",
                        price: "",
                        compare_price: "",
                        sku: "",
                        category_id: "",
                        inventory_quantity: "0",
                        track_inventory: true,
                        images: [],
                      });
                      setImageUrl("");
                    }}
                    className="btn-outline btn-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary btn-sm">
                    {editingProduct ? "Update" : "Add"} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products List */}
        {!selectedStore ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-balance">
              Select a Store to Manage Products
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-balance">
              Choose one of your stores above to add and manage products for your inventory.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <svg className="icon icon-sm mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Products help you showcase what you're selling
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-balance">
              Ready to Add Your First Product?
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-balance">
              Start building your inventory by adding products that customers can discover and purchase from your store.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary btn-lg inline-flex items-center gap-2"
              >
                <svg className="icon icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Product
              </button>

              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="icon icon-sm mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Easy inventory management
                </div>
                <div className="flex items-center">
                  <svg className="icon icon-sm mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start selling immediately
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <div key={product.uuid} className="card hover-lift">
                <div className="card-body">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-bold text-[#22c55e]">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {product.inventory_quantity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500">
                      SKU: {product.sku || "N/A"}
                    </span>
                    <span
                      className={`badge ${
                        product.is_active ? "badge-success" : "badge-gray"
                      }`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn-primary btn-sm text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/seller/products/${product.uuid}/variants`)
                      }
                      className="btn-outline btn-sm text-xs"
                    >
                      Variants
                    </button>
                    <button
                      onClick={() => requestDeleteProduct(product)}
                      className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                    >
                      Delete
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
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#22c55e] mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
