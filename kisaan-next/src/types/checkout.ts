// Checkout-related types and interfaces

export interface CartItem {
  product_uuid: string;
  name: string;
  price: number;
  quantity: number;
  variant_title?: string;
  variant_uuid?: string;
  images?: string | string[];
  inventory_quantity?: number;
}

export interface CustomerInfoData {
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
}

export interface BillingAddressData {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CheckoutFormData {
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  billing_address: BillingAddressData;
  customer_notes: string;
}

export interface Country {
  code: string;
  name: string;
  phoneCode: string;
}

export interface State {
  code: string;
  name: string;
  countryCode: string;
}

export interface CheckoutErrors {
  [key: string]: string;
}

export interface CheckoutHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export interface CustomerInfoFormProps {
  data: CustomerInfoData;
  onChange: (data: Partial<CustomerInfoData>) => void;
  errors: CheckoutErrors;
}

export interface BillingAddressFormProps {
  data: BillingAddressData;
  onChange: (data: Partial<BillingAddressData>) => void;
  errors: CheckoutErrors;
  customerName?: string;
}

export interface CheckoutOrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  onEditCart?: () => void;
}

export interface PaymentSectionProps {
  orderNotes: string;
  onOrderNotesChange: (notes: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string;
  isFormValid: boolean;
}

export interface CheckoutSessionRequest {
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  billing_address: BillingAddressData;
  customer_notes: string;
  success_url: string;
  cancel_url: string;
}

export interface CheckoutSessionResponse {
  url: string;
  session_id: string;
}