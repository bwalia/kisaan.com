import { Product, Category } from './index';

export interface SearchFilters {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption;
  page: number;
  perPage: number;
}

export type SortOption = 'relevance' | 'price_low_high' | 'price_high_low' | 'newest' | 'popularity' | 'rating';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
  filters: {
    categories: FilterOption[];
    priceRange: PriceRange;
  };
}

export interface CategoryWithProducts extends Category {
  productCount: number;
  image?: string;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  ctaButtons: {
    primary: {
      text: string;
      href: string;
    };
    secondary: {
      text: string;
      href: string;
    };
  };
}

export interface FeaturedSection {
  title: string;
  description: string;
  products: Product[];
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  loading?: boolean;
}

export interface CategoryFilterProps {
  categories: CategoryWithProducts[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  showAll?: boolean;
}

export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface SortDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  options: Array<{
    value: SortOption;
    label: string;
  }>;
}

export interface PriceFilterProps {
  range: PriceRange;
  currentRange: PriceRange;
  onChange: (range: PriceRange) => void;
}