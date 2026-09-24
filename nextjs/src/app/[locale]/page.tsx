"use client";

import { useState } from "react";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import CategoryMosaic from "@/components/home/CategoryMosaic";
import FeaturesSection from "@/components/home/FeaturesSection";
import CategoryFilter from "@/components/home/CategoryFilter";
import ProductGrid from "@/components/home/ProductGrid";
import FiltersSidebar, { DesktopFilters } from "@/components/home/FiltersSidebar";
import useHomeData from "@/hooks/useHomeData";
import { SORT_OPTIONS } from "@/lib/home-utils";

export default function Home() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const {
    products, categories, loading, categoriesLoading, searchLoading,
    error, filters, hasMore, search, selectCategory, changeSort, loadMore, updateFilters,
  } = useHomeData();

  const priceRange = { min: 0, max: Math.max(1000, ...products.map((p) => p.price)) };
  const currentPriceRange = { min: filters.minPrice, max: filters.maxPrice };

  return (
    <div className="min-h-screen">
      {/* Marketplace: Hero (search) → Categories → Features/trust → Listings → Seller CTA */}
      <HeroSection onSearch={search} searchLoading={searchLoading} />
      <CategoryMosaic onSelect={(label) => search(label)} />
      <FeaturesSection />

      {!categoriesLoading && categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedCategory={filters.category}
          onCategorySelect={selectCategory}
          showAll={true}
        />
      )}

      <section className="py-10 lg:py-14 border-t border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="hidden lg:block lg:w-56 flex-shrink-0">
              <div className="sticky top-24">
                <h4 className="text-sm font-bold text-[var(--color-foreground)] mb-4">Filters</h4>
                <DesktopFilters
                  priceRange={priceRange}
                  currentPriceRange={currentPriceRange}
                  onPriceRangeChange={(r) => updateFilters({ minPrice: r.min, maxPrice: r.max })}
                  resultCount={products.length}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl mb-1" id="products">
                    {filters.query ? `Results for "${filters.query}"` : "Featured listings"}
                  </h2>
                  {filters.category && (
                    <p className="text-sm text-[var(--color-muted-foreground)] m-0" style={{ maxWidth: "none" }}>
                      in {categories.find((c) => c.uuid === filters.category)?.name}
                    </p>
                  )}
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-1 m-0" style={{ maxWidth: "none" }}>
                    {loading ? "Loading…" : `${products.length} products`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => changeSort(e.target.value as any)}
                    className="text-sm py-2 px-3 border border-[var(--color-border)] rounded-xl bg-white cursor-pointer"
                    aria-label="Sort products"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(true)}
                    className="lg:hidden text-sm font-medium text-[var(--color-foreground)] border border-[var(--color-border)] px-4 py-2 rounded-xl hover:bg-[var(--color-muted)] cursor-pointer inline-flex items-center gap-2 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                    </svg>
                    Filters
                  </button>
                </div>
              </div>

              {(filters.query || filters.category || filters.minPrice > 0 || filters.maxPrice < 1000) && (
                <div className="mb-5 flex items-center gap-2 flex-wrap">
                  {filters.query && (
                    <span className="inline-flex items-center gap-1 text-xs bg-[var(--color-muted)] text-[var(--color-foreground)] px-2.5 py-1 rounded-lg">
                      &ldquo;{filters.query}&rdquo;
                      <button type="button" onClick={() => search("")} className="hover:text-red-700 cursor-pointer" aria-label="Clear search">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="inline-flex items-center gap-1 text-xs bg-[var(--sage-light)] text-[var(--color-primary)] px-2.5 py-1 rounded-lg">
                      {categories.find((c) => c.uuid === filters.category)?.name}
                      <button type="button" onClick={() => selectCategory("")} className="hover:text-red-700 cursor-pointer" aria-label="Clear category">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  )}
                  {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                    <span className="inline-flex items-center gap-1 text-xs bg-[var(--color-muted)] text-[var(--color-foreground)] px-2.5 py-1 rounded-lg">
                      ${filters.minPrice}–${filters.maxPrice}
                      <button type="button" onClick={() => updateFilters({ minPrice: 0, maxPrice: 1000 })} className="hover:text-red-700 cursor-pointer" aria-label="Clear price filter">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  )}
                </div>
              )}

              <ProductGrid products={products} loading={loading} error={error ?? undefined} onLoadMore={loadMore} hasMore={hasMore} />
            </div>
          </div>
        </div>
      </section>

      <FiltersSidebar
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        priceRange={priceRange}
        currentPriceRange={currentPriceRange}
        onPriceRangeChange={(r) => updateFilters({ minPrice: r.min, maxPrice: r.max })}
        resultCount={products.length}
      />

      {/* Seller CTA — ink board */}
      <section className="py-16 lg:py-20" style={{ background: "var(--ink)" }}>
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl sm:text-4xl mb-4" style={{ color: "#F7F8F4" }}>
            Sell on Kisaan
          </h2>
          <p
            className="mb-8 leading-relaxed"
            style={{ maxWidth: "var(--measure)", color: "rgba(247,248,244,0.78)" }}
          >
            Reach customers directly, set your own prices, and keep 80% of every sale. No setup fees.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="text-sm font-semibold px-6 py-3 no-underline transition-colors inline-block cursor-pointer"
              style={{ background: "var(--tomato)", color: "#FFFFFF" }}
            >
              Start selling
            </Link>
            <Link
              href="/seller-guide"
              className="text-sm font-semibold px-6 py-3 no-underline transition-colors inline-block cursor-pointer border border-[rgba(247,248,244,0.35)] hover:bg-white/10"
              style={{ color: "#F7F8F4" }}
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
