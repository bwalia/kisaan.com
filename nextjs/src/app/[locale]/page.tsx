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
    <div className="min-h-screen bg-white">
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-gray-50 rounded-xl p-6">
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
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h1
                    className="text-2xl sm:text-3xl font-bold text-gray-900"
                    id="products"
                  >
                    {filters.query
                      ? `Results for "${filters.query}"`
                      : "Fresh Products"}
                  </h1>
                  {filters.category && (
                    <p className="text-gray-600 mt-2 font-medium">
                      in{" "}
                      {
                        categories.find((c) => c.uuid === filters.category)
                          ?.name
                      }
                    </p>
                  )}
                  <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-gray-700">{products.length} products found</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Sort by:
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => changeSort(e.target.value as any)}
                      className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium hover:border-gray-300 transition-colors"
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
                    className="lg:hidden bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 inline-flex items-center gap-2 transform hover:scale-105"
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
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      ${filters.minPrice} - ${filters.maxPrice}
                      <button
                        onClick={() =>
                          updateFilters({ minPrice: 0, maxPrice: 1000 })
                        }
                        className="hover:text-gray-900"
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
      <section className="relative py-24 mt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-400/5 rounded-full blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-white/20">
              <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span className="text-emerald-100 text-sm font-medium">Join our growing community</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight leading-[1.1]">
              Ready to Share<br/>
              <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">Your Harvest?</span>
            </h2>
            <p className="text-lg text-emerald-100/70 mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of farmers connecting directly with customers. Fair prices, sustainable practices, and a thriving global community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-base shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Start Selling Today
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link
                href="/seller-guide"
                className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/5 backdrop-blur-sm transition-all duration-300"
              >
                Read Seller Guide
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
