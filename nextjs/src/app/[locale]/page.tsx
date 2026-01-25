"use client";

import { useState } from "react";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
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
    <div className="min-h-screen bg-[#fefdfb]">
      {/* Hero Section */}
      <HeroSection onSearch={search} searchLoading={searchLoading} />

      {/* Features Section */}
      <FeaturesSection />

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
              <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <span>🔍</span> Filters
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
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h1
                    className="text-3xl font-bold text-stone-900 flex items-center gap-2"
                    id="products"
                  >
                    <span className="text-2xl">🌾</span>
                    {filters.query
                      ? `Search results for "${filters.query}"`
                      : "Fresh From the Farm"}
                  </h1>
                  {filters.category && (
                    <p className="text-stone-600 mt-2 font-medium">
                      in{" "}
                      {
                        categories.find((c) => c.uuid === filters.category)
                          ?.name
                      }
                    </p>
                  )}
                  <div className="text-sm text-stone-500 mt-2 flex items-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#2d6a4f] border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-[#2d6a4f]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-stone-700">{products.length} products found</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-stone-700">
                      Sort by:
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => changeSort(e.target.value as any)}
                      className="px-4 py-2.5 border-2 border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:border-[#2d6a4f] font-medium hover:border-stone-300 transition-colors"
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
                    className="lg:hidden bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2 transform hover:scale-105"
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
                  <span className="text-sm text-stone-600">Active filters:</span>

                  {filters.query && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full">
                      Search: &quot;{filters.query}&quot;
                      <button
                        onClick={() => search("")}
                        className="hover:text-amber-900"
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
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      {
                        categories.find((c) => c.uuid === filters.category)
                          ?.name
                      }
                      <button
                        onClick={() => selectCategory("")}
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

                  {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-700 text-sm rounded-full">
                      ${filters.minPrice} - ${filters.maxPrice}
                      <button
                        onClick={() =>
                          updateFilters({ minPrice: 0, maxPrice: 1000 })
                        }
                        className="hover:text-stone-900"
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
      <div className="bg-gradient-to-br from-[#fef3c7] via-[#fef9c3] to-[#fefce8] py-20 mt-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-300/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <span className="text-5xl mb-4 inline-block">👨‍🌾</span>
          <h2 className="text-4xl font-bold text-stone-900 mb-4">
            Ready to Share Your Harvest?
          </h2>
          <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are connecting directly with customers. 
            Fair prices, sustainable practices, and a global community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-2"
            >
              <span>🌱</span>
              Start Selling Today
            </Link>
            <Link
              href="/seller-guide"
              className="border-2 border-[#2d6a4f] text-[#2d6a4f] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#2d6a4f] hover:text-white transition-all duration-300 inline-flex items-center gap-2"
            >
              <span>📖</span>
              Read Seller Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
