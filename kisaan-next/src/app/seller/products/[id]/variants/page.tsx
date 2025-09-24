"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { ProductVariant } from "@/types";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function ProductVariants() {
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(
    null
  );
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const [formData, setFormData] = useState({
    title: "",
    option1: "",
    option2: "",
    option3: "",
    sku: "",
    price: "",
    inventory_quantity: "0",
    is_active: true,
  });

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "seller")) {
      router.push("/login");
      return;
    }

    if (user && productId) loadData();
  }, [user, authLoading, router, productId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productResponse, variantsResponse] = await Promise.all([
        api.getProduct(productId),
        api.getVariants(productId),
      ]);
      setProduct(productResponse);
      setVariants(Array.isArray(variantsResponse) ? variantsResponse : []);
    } catch (error) {
      console.error("Failed to load data:", error);
      router.push("/seller/products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVariant)
        await api.updateVariant(editingVariant.uuid, formData);
      else await api.createVariant(productId, formData);
      setShowForm(false);
      setEditingVariant(null);
      resetForm();
      await loadData();
    } catch (error: any) {
      alert(
        `Failed to ${editingVariant ? "update" : "create"} variant: ${
          error.message
        }`
      );
    }
  };

  const handleEdit = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setFormData({
      title: variant.title,
      option1: variant.option1 || "",
      option2: variant.option2 || "",
      option3: variant.option3 || "",
      sku: variant.sku || "",
      price: variant.price?.toString() || "",
      inventory_quantity: variant.inventory_quantity.toString(),
      is_active: variant.is_active,
    });
    setShowForm(true);
  };

  const requestDelete = (variantId: string) =>
    setDeleteDialog({ open: true, id: variantId });

  const confirmDelete = async () => {
    if (!deleteDialog.id) return setDeleteDialog({ open: false, id: null });
    try {
      await api.deleteVariant(deleteDialog.id);
      await loadData();
    } catch (error: any) {
      alert(`Failed to delete variant: ${error.message}`);
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      option1: "",
      option2: "",
      option3: "",
      sku: "",
      price: "",
      inventory_quantity: "0",
      is_active: true,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newData = { ...formData };

    if (type === "checkbox") {
      (newData as any)[name] = (e.target as HTMLInputElement).checked;
    } else {
      (newData as any)[name] = value;

      // Auto-format SKU to uppercase and remove invalid characters
      if (name === "sku" && value) {
        const formattedSKU = value
          .toUpperCase()
          .replace(/[^A-Z0-9-_]/g, "")
          .substring(0, 50);
        newData.sku = formattedSKU;
      }
    }

    setFormData(newData);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">
            Loading variants...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Page Header */}
      <div className="page-header">
        <div className="container mx-auto px-6">
          <div className="page-header-content">
            {/* Back Navigation */}
            <button
              onClick={() => router.back()}
              className="btn-ghost btn-sm inline-flex items-center gap-2 mb-6 hover-lift"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Products
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex-1">
                <h1 className="page-title">Product Variants</h1>
                <p className="page-subtitle">
                  Managing variants for:{" "}
                  <span className="font-medium text-gray-800">
                    {product?.name}
                  </span>
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center text-sm text-gray-500">
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
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    {variants.length} variants
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
                  Add Variant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Confirm Delete */}
        <ConfirmDialog
          open={deleteDialog.open}
          title="Delete Variant"
          message="Are you sure you want to delete this variant?"
          onCancel={() => setDeleteDialog({ open: false, id: null })}
          onConfirm={confirmDelete}
          confirmText="Delete"
        />

        {/* Enhanced Variant Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal w-full max-w-2xl">
              <div className="modal-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingVariant ? "Edit Variant" : "Add New Variant"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingVariant(null);
                      resetForm();
                    }}
                    className="btn-icon btn-ghost"
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
                <form
                  id="variant-form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Variant Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Red / Large"
                      className="input"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Option 1 (e.g., Color)
                      </label>
                      <input
                        type="text"
                        name="option1"
                        value={formData.option1}
                        onChange={handleChange}
                        placeholder="Red"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Option 2 (e.g., Size)
                      </label>
                      <input
                        type="text"
                        name="option2"
                        value={formData.option2}
                        onChange={handleChange}
                        placeholder="Large"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Option 3 (e.g., Material)
                      </label>
                      <input
                        type="text"
                        name="option3"
                        value={formData.option3}
                        onChange={handleChange}
                        placeholder="Cotton"
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        name="price"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Leave empty to use product price"
                        className="input"
                      />
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
                        required
                        value={formData.inventory_quantity}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                    <div className="flex items-center pt-6">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">
                        Active variant
                      </label>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingVariant(null);
                    resetForm();
                  }}
                  className="btn-outline btn-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="variant-form"
                  className="btn-primary btn-md"
                >
                  {editingVariant ? "Update" : "Add"} Variant
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Empty State */}
        {variants.length === 0 ? (
          <div className="card hover-lift">
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg
                  className="icon icon-xl"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No Variants Yet
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                Add variants to offer different options for this product like
                size, color, or material combinations.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary btn-lg inline-flex items-center gap-2"
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
                Add Your First Variant
              </button>
            </div>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Variants
                </h2>
                <div className="text-sm text-gray-500">
                  {variants.length} variant{variants.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Variant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Options
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {variants.map((variant, index) => (
                    <tr
                      key={variant.uuid}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-600">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {variant.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {[variant.option1, variant.option2, variant.option3]
                            .filter(Boolean)
                            .join(" • ") || "No options"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded text-center">
                          {variant.sku || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {variant.price ? (
                            `$${parseFloat(variant.price.toString()).toFixed(
                              2
                            )}`
                          ) : (
                            <span className="text-gray-500 font-normal">
                              Default
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`text-sm font-medium ${
                              variant.inventory_quantity > 0
                                ? "text-green-700"
                                : variant.inventory_quantity === 0
                                ? "text-amber-700"
                                : "text-red-700"
                            }`}
                          >
                            {variant.inventory_quantity}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            units
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`badge ${
                            variant.is_active ? "badge-success" : "badge-gray"
                          }`}
                        >
                          {variant.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(variant)}
                            className="btn-ghost btn-sm inline-flex items-center gap-1 hover-lift"
                            title="Edit variant"
                          >
                            <svg
                              className="icon icon-xs"
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
                            onClick={() => requestDelete(variant.uuid)}
                            className="btn-ghost btn-sm inline-flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete variant"
                          >
                            <svg
                              className="icon icon-xs"
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
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
