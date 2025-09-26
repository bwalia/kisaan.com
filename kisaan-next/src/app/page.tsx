"use client";

import { useState } from "react";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import CategoryFilter from "@/components/home/CategoryFilter";
import ProductGrid from "@/components/home/ProductGrid";
import FiltersSidebar, {
  DesktopFilters,
} from "@/components/home/FiltersSidebar";
import useHomeData from "@/hooks/useHomeData";
import { SORT_OPTIONS } from "@/lib/home-utils";

export default function Home() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    products,
    categories,
    loading,
    categoriesLoading,
    searchLoading,
    error,
    filters,
    hasMore,
    search,
    selectCategory,
    changeSort,
    loadMore,
    updateFilters,
  } = useHomeData();

  // Calculate price range for filters
  const priceRange = {
    min: 0,
    max: Math.max(1000, ...products.map((p) => p.price)),
  };

  const currentPriceRange = {
    min: filters.minPrice,
    max: filters.maxPrice,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection onSearch={search} searchLoading={searchLoading} />

      {/* Category Filter */}
      {!categoriesLoading && categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedCategory={filters.category}
          onCategorySelect={selectCategory}
          showAll={true}
        />
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Filters
                </h3>
                <DesktopFilters
                  priceRange={priceRange}
                  currentPriceRange={currentPriceRange}
                  onPriceRangeChange={(range) =>
                    updateFilters({ minPrice: range.min, maxPrice: range.max })
                  }
                  resultCount={products.length}
                />
              </div>
            </div>
          </div>

          {/* Main Product Area */}
          <div className="flex-1 min-w-0">
            {/* Header with results and controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h1
                    className="text-2xl font-bold text-gray-900"
                    id="products"
                  >
                    {filters.query
                      ? `Search results for "${filters.query}"`
                      : "All Products"}
                  </h1>
                  {filters.category && (
                    <p className="text-gray-600 mt-1">
                      in{" "}
                      {
                        categories.find((c) => c.uuid === filters.category)
                          ?.name
                      }
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {loading
                      ? "Loading..."
                      : `${products.length} products found`}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Sort by:
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => changeSort(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#fe004d] focus:border-[#fe004d]"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setFiltersOpen(true)}
                    className="lg:hidden bg-[#fe004d] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#e6003d] transition-colors inline-flex items-center gap-2"
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
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                      />
                    </svg>
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.query ||
              filters.category ||
              filters.minPrice > 0 ||
              filters.maxPrice < 1000) && (
              <div className="mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Active filters:</span>

                  {filters.query && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-[#fe004d] text-sm rounded-full">
                      Search: "{filters.query}"
                      <button
                        onClick={() => search("")}
                        className="hover:text-[#e6003d]"
                      >
                        <svg
                          className="w-3 h-3"
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
                    </span>
                  )}

                  {filters.category && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {
                        categories.find((c) => c.uuid === filters.category)
                          ?.name
                      }
                      <button
                        onClick={() => selectCategory("")}
                        className="hover:text-blue-900"
                      >
                        <svg
                          className="w-3 h-3"
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
                    </span>
                  )}

                  {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      ${filters.minPrice} - ${filters.maxPrice}
                      <button
                        onClick={() =>
                          updateFilters({ minPrice: 0, maxPrice: 1000 })
                        }
                        className="hover:text-green-900"
                      >
                        <svg
                          className="w-3 h-3"
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
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid
              products={products}
              loading={loading}
              error={error ?? undefined}
              onLoadMore={loadMore}
              hasMore={hasMore}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Sidebar */}
      <FiltersSidebar
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        priceRange={priceRange}
        currentPriceRange={currentPriceRange}
        onPriceRangeChange={(range) =>
          updateFilters({ minPrice: range.min, maxPrice: range.max })
        }
        resultCount={products.length}
      />

      {/* CTA Section */}
      <div className="bg-white py-16 mt-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of sellers who trust our platform to grow their
            business
          </p>
          <Link
            href="/register"
            className="bg-[#fe004d] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#e6003d] transition-colors shadow-lg hover:shadow-xl inline-block"
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </div>
  );
}
