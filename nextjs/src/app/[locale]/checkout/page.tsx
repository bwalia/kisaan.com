"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { isOrderingDisabled } from "@/utils/site-config";
import DisabledFeatureMessage from "@/components/DisabledFeatureMessage";
import api from "@/lib/api";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CustomerInfoForm from "@/components/checkout/CustomerInfoForm";
import BillingAddressForm from "@/components/checkout/BillingAddressForm";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import PaymentSection from "@/components/checkout/PaymentSection";
import type { CartItem, CheckoutFormData, CheckoutErrors } from '@/types/checkout';
import { getDefaultCountry } from '@/lib/countries';

interface CartTotals {
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  requires_shipping: boolean;
}

export default function Checkout() {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [total, setTotal] = useState(0);
  const [cartTotals, setCartTotals] = useState<CartTotals | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [formData, setFormData] = useState<CheckoutFormData>({
    customer_email: "",
    customer_first_name: "",
    customer_last_name: "",
    customer_phone: "",
    billing_address: {
      name: "",
      address1: "",
      city: "",
      state: "",
      zip: "",
      country: getDefaultCountry(),
    },
    customer_notes: "",
  });

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const currentStep = 1;

  useEffect(() => {
    // Only redirect if auth is not loading and user is not authenticated
    if (!authLoading && !user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    // Only load cart if user is authenticated and auth is not loading
    if (!authLoading && user) {
      loadCart();
    }
  }, [user, authLoading, router]);

  const loadCart = async () => {
    try {
      const [cartResponse, totalsResponse] = await Promise.all([
        api.getCart(),
        api.getCartTotals()
      ]);

      const cartData = cartResponse?.cart || {};
      setCart(cartData);
      setTotal(cartResponse?.total || 0);
      setCartTotals(totalsResponse || null);

      if (Object.keys(cartData).length === 0) {
        router.push("/cart");
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCart({});
      setTotal(0);
      setCartTotals(null);
      router.push("/cart");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Customer info validation
    if (!formData.customer_first_name.trim()) {
      newErrors.customer_first_name = "First name is required";
    }
    if (!formData.customer_last_name.trim()) {
      newErrors.customer_last_name = "Last name is required";
    }
    if (!formData.customer_email.trim()) {
      newErrors.customer_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = "Please enter a valid email address";
    }

    // Billing address validation
    if (!formData.billing_address.name.trim()) {
      newErrors.billing_name = "Full name is required";
    }
    if (!formData.billing_address.address1.trim()) {
      newErrors.billing_address1 = "Street address is required";
    }
    if (!formData.billing_address.city.trim()) {
      newErrors.billing_city = "City is required";
    }
    if (!formData.billing_address.state) {
      newErrors.billing_state = "State is required";
    }
    if (!formData.billing_address.zip.trim()) {
      newErrors.billing_zip = "Postal code is required";
    } else if (formData.billing_address.zip.trim().length < 3) {
      newErrors.billing_zip = "Please enter a valid postal code (minimum 3 characters)";
    }

    setErrors(newErrors);

    // Auto-scroll to first error if validation fails
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstErrorKey = Object.keys(newErrors)[0];
        let targetName = firstErrorKey;

        // Map error keys to actual form field names
        if (firstErrorKey.startsWith('billing_')) {
          targetName = firstErrorKey.replace('billing_', '');
        }

        const errorElement = document.querySelector(`[name="${targetName}"]`) as HTMLElement;
        if (errorElement) {
          errorElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          errorElement.focus();
        }
      }, 100);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setPaymentError("");

    try {
      const response = await api.createCheckoutSession({
        customer_email: formData.customer_email,
        customer_first_name: formData.customer_first_name,
        customer_last_name: formData.customer_last_name,
        customer_phone: formData.customer_phone,
        billing_address: formData.billing_address,
        customer_notes: formData.customer_notes,
        success_url: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/checkout`,
      });

      window.location.href = response.url;
    } catch (error: any) {
      setPaymentError("Failed to create checkout session: " + error.message);
      setLoading(false);
    }
  };

  const handleCustomerInfoChange = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Clear related errors
    Object.keys(data).forEach((key) => {
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
    });
  };

  const handleBillingAddressChange = (
    data: Partial<typeof formData.billing_address>
  ) => {
    setFormData((prev) => ({
      ...prev,
      billing_address: { ...prev.billing_address, ...data },
    }));
    // Clear related errors
    Object.keys(data).forEach((key) => {
      const errorKey = `billing_${key}`;
      if (errors[errorKey]) {
        setErrors((prev) => ({ ...prev, [errorKey]: "" }));
      }
    });
  };

  const handleOrderNotesChange = (notes: string) => {
    setFormData((prev) => ({ ...prev, customer_notes: notes }));
  };

  const cartItems = cart ? Object.values(cart) : [];
  const subtotal = total || 0;

  // Use dynamic calculations from backend if available, otherwise fallback to defaults
  const taxAmount = cartTotals?.tax_amount || 0;
  const shipping = cartTotals?.shipping_amount || 0;
  const finalTotal = cartTotals?.total_amount || subtotal;
  const customerFullName =
    `${formData.customer_first_name} ${formData.customer_last_name}`.trim();
  const isFormValid =
    Object.keys(errors).length === 0 &&
    !!formData.customer_first_name &&
    !!formData.customer_last_name &&
    !!formData.customer_email &&
    !!formData.billing_address.name &&
    !!formData.billing_address.address1 &&
    !!formData.billing_address.city &&
    !!formData.billing_address.state &&
    !!formData.billing_address.zip;

  // Show loading state while auth is loading or cart is empty
  if (authLoading || (!user && !authLoading) || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16a34a] mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authLoading ? "Authenticating..." : "Loading checkout..."}
          </p>
        </div>
      </div>
    );
  }

  // Show disabled message if ordering is disabled
  if (isOrderingDisabled()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <DisabledFeatureMessage featureType="ordering" className="mb-4" />
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/cart')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mr-4"
            >
              Back to Cart
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CheckoutHeader currentStep={currentStep} totalSteps={3} />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Forms */}
          <div className="xl:col-span-2 space-y-6">
            {/* Customer Information */}
            <CustomerInfoForm
              data={{
                customer_email: formData.customer_email,
                customer_first_name: formData.customer_first_name,
                customer_last_name: formData.customer_last_name,
                customer_phone: formData.customer_phone,
              }}
              onChange={handleCustomerInfoChange}
              errors={errors}
            />

            {/* Billing Address */}
            <BillingAddressForm
              data={formData.billing_address}
              onChange={handleBillingAddressChange}
              errors={errors}
              customerName={customerFullName}
            />

            {/* Payment Section */}
            <PaymentSection
              orderNotes={formData.customer_notes}
              onOrderNotesChange={handleOrderNotesChange}
              onSubmit={handleSubmit}
              isLoading={loading}
              error={paymentError}
              isFormValid={isFormValid}
            />
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <CheckoutOrderSummary
              cartItems={cartItems}
              subtotal={cartTotals?.subtotal || subtotal}
              tax={taxAmount}
              shipping={shipping}
              total={finalTotal}
              onEditCart={() => router.push("/cart")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
