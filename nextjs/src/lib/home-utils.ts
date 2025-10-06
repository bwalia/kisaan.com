import { SearchFilters, SortOption } from '@/types/home';
import { Product } from '@/types';

export const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  category: '',
  minPrice: 0,
  maxPrice: 1000,
  sortBy: 'relevance',
  page: 1,
  perPage: 20,
};

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low_high', label: 'Price: Low to High' },
  { value: 'price_high_low', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatProductCount = (count: number): string => {
  if (count === 0) return 'No products';
  if (count === 1) return '1 product';
  if (count < 1000) return `${count} products`;
  if (count < 1000000) return `${Math.floor(count / 1000)}K+ products`;
  return `${Math.floor(count / 1000000)}M+ products`;
};

export const buildSearchQuery = (filters: Partial<SearchFilters>): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  return params;
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const getProductImageUrl = (product: Product): string => {
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }
  return '/images/product-placeholder.png';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const calculateDiscountPercentage = (originalPrice: number, salePrice: number): number => {
  if (originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

export const isProductInStock = (product: Product): boolean => {
  if (!product.track_inventory) return true;
  return product.inventory_quantity > 0;
};

export const getStockStatus = (product: Product): 'in_stock' | 'low_stock' | 'out_of_stock' => {
  if (!product.track_inventory) return 'in_stock';

  if (product.inventory_quantity === 0) return 'out_of_stock';
  if (product.inventory_quantity <= 5) return 'low_stock';
  return 'in_stock';
};

export const getStockStatusText = (product: Product): string => {
  const status = getStockStatus(product);

  switch (status) {
    case 'in_stock':
      return 'In Stock';
    case 'low_stock':
      return `Only ${product.inventory_quantity} left`;
    case 'out_of_stock':
      return 'Out of Stock';
    default:
      return 'In Stock';
  }
};

export const sortProducts = (products: Product[], sortBy: SortOption): Product[] => {
  const sorted = [...products];

  switch (sortBy) {
    case 'price_low_high':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_high_low':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case 'popularity':
      // For now, sort by featured status, then by created date
      return sorted.sort((a, b) => {
        if (a.is_featured !== b.is_featured) {
          return b.is_featured ? 1 : -1;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    case 'rating':
      // TODO: Implement when rating system is added
      return sorted;
    case 'relevance':
    default:
      return sorted;
  }
};

export const filterProducts = (
  products: Product[],
  filters: Partial<SearchFilters>
): Product[] => {
  let filtered = [...products];

  // Filter by search query
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query)) ||
      (product.sku && product.sku.toLowerCase().includes(query))
    );
  }

  // Filter by category
  if (filters.category) {
    filtered = filtered.filter(product => product.category_id === filters.category);
  }

  // Filter by price range
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(product => product.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(product => product.price <= filters.maxPrice!);
  }

  // Only show active products
  filtered = filtered.filter(product => product.is_active);

  return filtered;
};