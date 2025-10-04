export interface OrderItem {
  id: number;
  uuid: string;
  order_id: number;
  product_id: number;
  variant_id?: string;
  quantity: number;
  price: number;
  total: number;
  product_title: string;
  variant_title?: string;
  sku?: string;
  current_product_name?: string;
  product_uuid?: string;
  created_at: string;
  updated_at: string;
}

export interface BillingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: number;
  uuid: string;
  store_id: number;
  customer_id?: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  financial_status: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'voided';
  fulfillment_status: 'unfulfilled' | 'partial' | 'fulfilled' | 'cancelled';
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  billing_address?: BillingAddress;
  shipping_address?: BillingAddress;
  customer_notes?: string;
  internal_notes?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;

  // Joined fields
  customer_email?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  customer_phone?: string;
  store_name?: string;
  store_uuid?: string;

  // Related data
  items?: OrderItem[];
}

export interface OrderStatusUpdate {
  status?: Order['status'];
  financial_status?: Order['financial_status'];
  fulfillment_status?: Order['fulfillment_status'];
  internal_notes?: string;
}

export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' }
} as const;

export const FINANCIAL_STATUSES = {
  pending: { label: 'Payment Pending', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  partially_paid: { label: 'Partially Paid', color: 'bg-orange-100 text-orange-800' },
  refunded: { label: 'Refunded', color: 'bg-purple-100 text-purple-800' },
  voided: { label: 'Voided', color: 'bg-red-100 text-red-800' }
} as const;

export const FULFILLMENT_STATUSES = {
  unfulfilled: { label: 'Unfulfilled', color: 'bg-gray-100 text-gray-800' },
  partial: { label: 'Partially Fulfilled', color: 'bg-orange-100 text-orange-800' },
  fulfilled: { label: 'Fulfilled', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' }
} as const;