// Professional Product Utility Functions

export interface ProductFormData {
  name: string;
  description: string;
  slug: string;
  price: string;
  compare_price: string;
  sku: string;
  category_id: string;
  inventory_quantity: string;
  track_inventory: boolean;
  images: string[];
  short_description?: string;
  tags?: string;
  is_active?: boolean;
  is_featured?: boolean;
  weight?: string;
  dimensions?: string;
  requires_shipping?: boolean;
}

export interface ProductValidationErrors {
  [key: string]: string;
}

/**
 * Generate SEO-friendly slug from product name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate SKU suggestion based on product name and category
 */
export function generateSKU(name: string, categoryName?: string): string {
  const namePart = name
    .substring(0, 3)
    .toUpperCase()
    .replace(/[^\w]/g, '');

  const categoryPart = categoryName
    ? categoryName.substring(0, 2).toUpperCase().replace(/[^\w]/g, '')
    : 'GEN';

  const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();

  return `${categoryPart}-${namePart}-${randomPart}`;
}

/**
 * Validate product form data
 */
export function validateProductForm(formData: ProductFormData): ProductValidationErrors {
  const errors: ProductValidationErrors = {};

  // Required fields validation
  if (!formData.name.trim()) {
    errors.name = 'Product name is required';
  } else if (formData.name.length < 3) {
    errors.name = 'Product name must be at least 3 characters';
  }

  if (!formData.description.trim()) {
    errors.description = 'Product description is required';
  } else if (formData.description.length < 10) {
    errors.description = 'Product description must be at least 10 characters';
  }

  if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
    errors.price = 'Valid price is required';
  }

  if (!formData.sku.trim()) {
    errors.sku = 'SKU is required';
  } else if (formData.sku.length < 3) {
    errors.sku = 'SKU must be at least 3 characters';
  }

  if (!formData.category_id) {
    errors.category_id = 'Category is required';
  }

  // Optional fields validation
  if (formData.compare_price &&
      (isNaN(Number(formData.compare_price)) || Number(formData.compare_price) <= Number(formData.price))) {
    errors.compare_price = 'Compare price must be higher than regular price';
  }

  if (formData.inventory_quantity &&
      (isNaN(Number(formData.inventory_quantity)) || Number(formData.inventory_quantity) < 0)) {
    errors.inventory_quantity = 'Inventory quantity must be a non-negative number';
  }

  if (formData.weight &&
      (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0)) {
    errors.weight = 'Weight must be a positive number';
  }

  // Images validation
  if (formData.images.length === 0) {
    errors.images = 'At least one product image is required';
  }

  // Slug validation
  if (!formData.slug.trim()) {
    errors.slug = 'Product slug is required';
  } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
    errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
  }

  return errors;
}

/**
 * Format price for display
 */
export function formatPrice(price: number | string, currency = '$'): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return `${currency}0.00`;
  return `${currency}${numPrice.toFixed(2)}`;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(price: number | string, comparePrice: number | string): number {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  const numComparePrice = typeof comparePrice === 'string' ? parseFloat(comparePrice) : comparePrice;

  if (isNaN(numPrice) || isNaN(numComparePrice) || numComparePrice <= numPrice) {
    return 0;
  }

  return Math.round(((numComparePrice - numPrice) / numComparePrice) * 100);
}

/**
 * Clean and format form data for API submission
 */
export function prepareProductForSubmission(formData: ProductFormData): Record<string, any> {
  return {
    name: formData.name.trim(),
    description: formData.description.trim(),
    short_description: formData.short_description?.trim() || '',
    slug: formData.slug.trim(),
    price: parseFloat(formData.price),
    compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
    sku: formData.sku.trim().toUpperCase(),
    category_id: formData.category_id,
    inventory_quantity: parseInt(formData.inventory_quantity) || 0,
    track_inventory: formData.track_inventory,
    images: JSON.stringify(formData.images),
    tags: formData.tags?.trim() || '',
    is_active: formData.is_active ?? true,
    is_featured: formData.is_featured ?? false,
    weight: formData.weight ? parseFloat(formData.weight) : null,
    dimensions: formData.dimensions?.trim() || '',
    requires_shipping: formData.requires_shipping ?? true,
  };
}

/**
 * Initialize empty product form data
 */
export function getInitialProductFormData(): ProductFormData {
  return {
    name: '',
    description: '',
    slug: '',
    price: '',
    compare_price: '',
    sku: '',
    category_id: '',
    inventory_quantity: '0',
    track_inventory: true,
    images: [],
    short_description: '',
    tags: '',
    is_active: true,
    is_featured: false,
    weight: '',
    dimensions: '',
    requires_shipping: true,
  };
}

/**
 * Check if two product form data objects are equal
 */
export function isProductDataEqual(data1: ProductFormData, data2: ProductFormData): boolean {
  return JSON.stringify(data1) === JSON.stringify(data2);
}

/**
 * Extract product data from API response for editing
 */
export function productToFormData(product: any): ProductFormData {
  return {
    name: product.name || '',
    description: product.description || '',
    short_description: product.short_description || '',
    slug: product.slug || '',
    price: product.price?.toString() || '',
    compare_price: product.compare_price?.toString() || '',
    sku: product.sku || '',
    category_id: product.category_id || '',
    inventory_quantity: product.inventory_quantity?.toString() || '0',
    track_inventory: product.track_inventory ?? true,
    images: product.images ? JSON.parse(product.images) : [],
    tags: product.tags || '',
    is_active: product.is_active ?? true,
    is_featured: product.is_featured ?? false,
    weight: product.weight?.toString() || '',
    dimensions: product.dimensions || '',
    requires_shipping: product.requires_shipping ?? true,
  };
}