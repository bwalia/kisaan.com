'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Product, Category } from '@/types';
import {
  SearchFilters,
  SortOption,
  CategoryWithProducts,
} from '@/types/home';
import {
  filterProducts,
  sortProducts,
  buildSearchQuery,
  DEFAULT_FILTERS
} from '@/lib/home-utils';
import api from '@/lib/api';

interface UseHomeDataResult {
  // Data
  products: Product[];
  allProducts: Product[];
  categories: CategoryWithProducts[];

  // Loading states
  loading: boolean;
  categoriesLoading: boolean;
  searchLoading: boolean;

  // Error states
  error: string | null;

  // Filters
  filters: SearchFilters;

  // Pagination
  currentPage: number;
  totalPages: number;
  hasMore: boolean;

  // Actions
  updateFilters: (newFilters: Partial<SearchFilters>) => void;
  search: (query: string) => void;
  selectCategory: (categoryId: string) => void;
  changeSort: (sortBy: SortOption) => void;
  loadMore: () => void;
  resetFilters: () => void;
  refreshData: () => void;
}

const useHomeData = (): UseHomeDataResult => {
  // State
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Prevent concurrent API calls
  const loadingRef = useRef(false);
  // Track if this is the initial load
  const initialLoadRef = useRef(true);

  // Load products with server-side filtering and sorting
  const loadProducts = useCallback(async (newFilters?: Partial<SearchFilters>, showLoading = true) => {
    // Prevent concurrent API calls
    if (loadingRef.current) {
      return;
    }

    try {
      loadingRef.current = true;

      if (showLoading) {
        setLoading(true);
      } else {
        setSearchLoading(true);
      }
      setError(null);

      const currentFilters = newFilters ? { ...DEFAULT_FILTERS, ...newFilters } : filters;

      // Build server-side query parameters
      const queryParams: any = {
        page: currentFilters.page,
        perPage: currentFilters.perPage,
      };

      // Add search query
      if (currentFilters.query) {
        queryParams.search = currentFilters.query;
      }

      // Add category filter
      if (currentFilters.category) {
        queryParams.category_id = currentFilters.category;
      }

      // Add price filters
      if (currentFilters.minPrice > 0) {
        queryParams.min_price = currentFilters.minPrice;
      }
      if (currentFilters.maxPrice < 1000) {
        queryParams.max_price = currentFilters.maxPrice;
      }

      // Add sorting
      if (currentFilters.sortBy && currentFilters.sortBy !== 'relevance') {
        const sortMap: { [key: string]: string } = {
          'price_low_high': 'price_asc',
          'price_high_low': 'price_desc',
          'newest': 'created_desc',
          'popularity': 'featured_desc',
        };
        queryParams.sort = sortMap[currentFilters.sortBy] || currentFilters.sortBy;
      }

      const response = await api.getProducts(queryParams);

      let productsData: Product[] = [];
      let totalCount = 0;

      if (response && Array.isArray(response.data)) {
        productsData = response.data;
        totalCount = response.total || response.data.length;
      } else if (response && Array.isArray(response)) {
        productsData = response;
        totalCount = response.length;
      }

      setAllProducts(productsData);
      setProducts(productsData);

      // Calculate pagination based on server response
      const itemsPerPage = currentFilters.perPage;
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
      setCurrentPage(currentFilters.page);

    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Failed to load products');
      setProducts([]);
      setAllProducts([]);
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setSearchLoading(false);
    }
  }, []); // Remove filters dependency to prevent infinite loops

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = await api.getCategories();

      let categoriesData: Category[] = [];
      if (response && Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response && Array.isArray(response)) {
        categoriesData = response;
      }

      // Count products per category
      const categoriesWithCount: CategoryWithProducts[] = categoriesData.map(category => ({
        ...category,
        productCount: allProducts.filter(product =>
          product.category_id === category.uuid && product.is_active
        ).length,
      }));

      setCategories(categoriesWithCount);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, [allProducts]);

  // Update filters and apply them server-side
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, ...newFilters, page: 1 };
      return updatedFilters;
    });
  }, []);

  // Effect to handle side effects when filters change
  useEffect(() => {
    // Skip the effect on initial load
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    // Load products with current filters
    loadProducts(filters, false);

    // Update URL without reloading the page
    const searchParams = buildSearchQuery(filters);
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters, loadProducts]);

  // Search function
  const search = useCallback((query: string) => {
    // Check for duplicate searches before setting state
    setFilters(prevFilters => {
      if (query === prevFilters.query) {
        return prevFilters;
      }
      return { ...prevFilters, query, page: 1 };
    });

    // Set loading state outside of the state setter
    setSearchLoading(true);
  }, []);

  // Category selection
  const selectCategory = useCallback((categoryId: string) => {
    updateFilters({ category: categoryId });
  }, [updateFilters]);

  // Sort change
  const changeSort = useCallback((sortBy: SortOption) => {
    updateFilters({ sortBy });
  }, [updateFilters]);

  // Load more (pagination)
  const loadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      const updatedFilters = { ...filters, page: nextPage };
      setFilters(updatedFilters);
      setCurrentPage(nextPage);

      // Load additional products and append them
      loadProducts(updatedFilters, false).then(() => {
        // This will load the next page and replace products
        // For infinite scroll, we'd need to modify to append products
      });

      // Update URL
      const searchParams = buildSearchQuery(updatedFilters);
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [currentPage, totalPages, filters, loadProducts]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    loadProducts(DEFAULT_FILTERS, true);

    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname);
  }, [loadProducts]);

  // Refresh all data
  const refreshData = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  // Load data on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Load categories when products are loaded
  useEffect(() => {
    if (allProducts.length > 0) {
      loadCategories();
    }
  }, [allProducts, loadCategories]);

  // Parse URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilters: Partial<SearchFilters> = {};

    if (urlParams.get('query')) urlFilters.query = urlParams.get('query')!;
    if (urlParams.get('category')) urlFilters.category = urlParams.get('category')!;
    if (urlParams.get('sortBy')) urlFilters.sortBy = urlParams.get('sortBy') as SortOption;
    if (urlParams.get('minPrice')) urlFilters.minPrice = Number(urlParams.get('minPrice'));
    if (urlParams.get('maxPrice')) urlFilters.maxPrice = Number(urlParams.get('maxPrice'));

    if (Object.keys(urlFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...urlFilters }));
    }
  }, []);

  return {
    // Data
    products,
    allProducts,
    categories,

    // Loading states
    loading,
    categoriesLoading,
    searchLoading,

    // Error state
    error,

    // Filters
    filters,

    // Pagination
    currentPage,
    totalPages,
    hasMore: currentPage < totalPages,

    // Actions
    updateFilters,
    search,
    selectCategory,
    changeSort,
    loadMore,
    resetFilters,
    refreshData,
  };
};

export default useHomeData;