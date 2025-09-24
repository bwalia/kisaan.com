'use client';
import { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import api from '@/lib/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  amount: number;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
  customerData: {
    customer_email: string;
    customer_first_name: string;
    customer_last_name: string;
    customer_phone?: string;
    billing_address: any;
    shipping_address?: any;
  };
}

function CheckoutForm({ amount, onSuccess, onError, customerData }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Payment not ready. Please try again.');
      return;
    }

    setLoading(true);

    try {
      // Confirm payment with Stripe using Payment Elements
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/payment/success',
          payment_method_data: {
            billing_details: {
              name: `${customerData.customer_first_name} ${customerData.customer_last_name}`,
              email: customerData.customer_email,
              phone: customerData.customer_phone,
              address: {
                line1: customerData.billing_address.address1,
                city: customerData.billing_address.city,
                state: customerData.billing_address.state,
                postal_code: customerData.billing_address.zip,
                country: customerData.billing_address.country || 'US'
              }
            }
          }
        },
        redirect: 'if_required' // Prevents redirect, handles in same page
      });

      if (error) {
        onError(error.message || 'Payment failed');
        setLoading(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded, confirm with backend and create order
        try {
          const orderResult = await api.confirmPayment({
            payment_intent_id: paymentIntent.id,
            ...customerData
          });
          onSuccess(orderResult);
        } catch (backendError: any) {
          onError('Payment succeeded but order creation failed: ' + backendError.message);
        }
      } else {
        onError('Payment was not completed successfully');
      }
    } catch (error: any) {
      onError('Payment processing failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Information
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
          <PaymentElement />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Amount:</span>
          <span className="text-lg font-bold">${amount.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>

      <div className="text-xs text-gray-500 text-center">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>Powered by Stripe</p>
      </div>
    </form>
  );
}

interface StripeCheckoutProps {
  amount: number;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
  customerData: {
    customer_email: string;
    customer_first_name: string;
    customer_last_name: string;
    customer_phone?: string;
    billing_address: any;
    shipping_address?: any;
  };
}

export default function StripeCheckout({ amount, onSuccess, onError, customerData }: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [hasCreated, setHasCreated] = useState(false);

  // Use useCallback to prevent function recreation on every render
  const createPaymentIntent = useCallback(async () => {
    // Prevent multiple creation attempts
    if (isCreating || hasCreated || clientSecret) return;

    setIsCreating(true);
    try {
      console.log('Creating Payment Intent for amount:', amount);
      const response = await api.createPaymentIntent({
        amount,
        currency: 'usd',
        ...customerData
      });
      console.log('Payment Intent created:', response.payment_intent_id);
      setClientSecret(response.client_secret);
      setHasCreated(true);
    } catch (error: any) {
      console.error('Failed to create Payment Intent:', error);
      onError('Failed to initialize payment: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  }, [amount, customerData, onError, isCreating, hasCreated, clientSecret]);

  useEffect(() => {
    createPaymentIntent();
  }, [createPaymentIntent]);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">
          {isCreating ? 'Creating payment session...' : 'Initializing payment...'}
        </span>
      </div>
    );
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
        customerData={customerData}
      />
    </Elements>
  );
}