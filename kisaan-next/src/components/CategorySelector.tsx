"use client";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";

interface Category {
  uuid: string;
  name: string;
  description?: string;
  slug?: string;
}

interface CategorySelectorProps {
  storeId: string;
  onCategorySelect: (category: Category | null) => void;
  onCategoryCreate: (categoryData: {
    name: string;
    description: string;
  }) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
}

export default function CategorySelector({
  storeId,
  onCategorySelect,
  onCategoryCreate,
  placeholder = "Search or create category...",
  disabled = false,
}: CategorySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search categories with debounce
  useEffect(() => {
    if (!storeId || !searchTerm.trim()) {
      setCategories([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.searchCategories({
          store_id: storeId,
          search: searchTerm.trim(),
          limit: 10,
        });
        setCategories(response?.data || []);
      } catch (error) {
        console.error("Failed to search categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, storeId]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setShowCreateForm(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
    setShowCreateForm(false);

    // Clear selection if user types something different
    if (selectedCategory && value !== selectedCategory.name) {
      setSelectedCategory(null);
      onCategorySelect(null);
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSearchTerm(category.name);
    setShowDropdown(false);
    setShowCreateForm(false);
    onCategorySelect(category);
  };

  const handleCreateNew = () => {
    setCreateForm({ name: searchTerm.trim(), description: "" });
    setShowCreateForm(true);
    setShowDropdown(false);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim() || createLoading) return;

    setCreateLoading(true);
    try {
      await onCategoryCreate({
        name: createForm.name.trim(),
        description: createForm.description.trim(),
      });

      // Reset state
      setSearchTerm(createForm.name.trim());
      setCreateForm({ name: "", description: "" });
      setShowCreateForm(false);
      setShowDropdown(false);
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreateCancel = () => {
    setCreateForm({ name: "", description: "" });
    setShowCreateForm(false);
    inputRef.current?.focus();
  };

  const exactMatch = categories.find(
    (cat) => cat.name.toLowerCase() === searchTerm.toLowerCase()
  );
  const showCreateOption = searchTerm.trim() && !exactMatch && !loading;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`input pr-10 ${
            selectedCategory ? "border-green-300 bg-green-50" : ""
          }`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          ) : selectedCategory ? (
            <svg
              className="w-4 h-4 text-green-500"
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
          ) : (
            <svg
              className="w-4 h-4 text-gray-400"
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
          )}
        </div>
      </div>

      {/* Selected Category Info */}
      {selectedCategory && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-green-700">
              <svg
                className="w-4 h-4 mr-2"
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
              <span className="font-medium">Selected: {selectedCategory.name}</span>
            </div>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchTerm("");
                onCategorySelect(null);
              }}
              className="text-green-600 hover:text-green-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Dropdown */}
      {showDropdown && !showCreateForm && searchTerm && !selectedCategory && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-3 text-center text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mx-auto mb-2"></div>
              Searching categories...
            </div>
          ) : (
            <>
              {/* Existing Categories */}
              {categories.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Existing Categories
                  </div>
                  {categories.map((category) => (
                    <button
                      key={category.uuid}
                      onClick={() => handleCategorySelect(category)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{category.name}</div>
                        {category.description && (
                          <div className="text-sm text-gray-500 truncate">
                            {category.description}
                          </div>
                        )}
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400 group-hover:text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              )}

              {/* Create New Option */}
              {showCreateOption && (
                <div>
                  {categories.length > 0 && (
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-t border-gray-100">
                      Create New
                    </div>
                  )}
                  <button
                    onClick={handleCreateNew}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center justify-between group"
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-blue-500"
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
                      <div>
                        <div className="font-medium text-blue-700">
                          Create "{searchTerm.trim()}"
                        </div>
                        <div className="text-sm text-blue-600">
                          Add this as a new category
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* No Results */}
              {!loading && categories.length === 0 && !showCreateOption && (
                <div className="p-3 text-center text-gray-500">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  No categories found
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4">
          <div className="mb-3">
            <div className="flex items-center mb-2">
              <svg
                className="w-4 h-4 mr-2 text-blue-500"
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
              <h3 className="font-medium text-gray-900">Create New Category</h3>
            </div>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="input w-full"
                placeholder="Enter category name"
                required
                disabled={createLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="input w-full resize-none"
                rows={2}
                placeholder="Describe this category..."
                disabled={createLoading}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={!createForm.name.trim() || createLoading}
                className="flex-1 btn-primary btn-sm"
              >
                {createLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </button>
              <button
                type="button"
                onClick={handleCreateCancel}
                disabled={createLoading}
                className="btn-outline btn-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}