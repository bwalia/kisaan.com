'use client';

import { useState } from 'react';
import type { PaymentSectionProps } from '@/types/checkout';

export default function PaymentSection({
  orderNotes,
  onOrderNotesChange,
  onSubmit,
  isLoading,
  error,
  isFormValid
}: PaymentSectionProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions to continue');
      return;
    }
    if (!isFormValid) {
      alert('Please fill in all required fields correctly');
      return;
    }
    onSubmit();
  };

  return (
    <div className="space-y-6">
      {/* Order Notes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
            3
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Order Notes</h2>
            <p className="text-sm text-gray-600">Optional special instructions</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            value={orderNotes}
            onChange={(e) => onOrderNotesChange(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] resize-none"
            placeholder="Any special delivery instructions, gift message, or other notes for your order..."
          />
          <p className="mt-2 text-xs text-gray-500">
            Character limit: {orderNotes.length}/500
          </p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h3>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
          <div className="text-sm text-gray-700 space-y-3">
            <p><strong>Payment Terms:</strong> Payment is processed securely through Stripe. We accept major credit cards and debit cards.</p>
            <p><strong>Shipping Policy:</strong> Orders are typically processed within 1-2 business days. Shipping times vary by location and method selected.</p>
            <p><strong>Return Policy:</strong> Items may be returned within 30 days of delivery in original condition. Return shipping costs may apply.</p>
            <p><strong>Privacy:</strong> Your personal information is securely stored and never shared with third parties without consent.</p>
            <p><strong>Cancellation:</strong> Orders may be cancelled within 1 hour of placement if not yet processed.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 text-[#16a34a] border-gray-300 rounded focus:ring-[#16a34a] mt-0.5"
          />
          <label htmlFor="agreeTerms" className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="/terms" target="_blank" className="text-[#16a34a] hover:text-[#16a34a] underline">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" className="text-[#16a34a] hover:text-[#16a34a] underline">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-800">Payment Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !agreedToTerms || !isFormValid}
          className="w-full bg-[#16a34a] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#16a34a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating Secure Checkout...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Complete Secure Payment
            </>
          )}
        </button>

        {/* Payment Security Info */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Privacy Protected</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 You'll be redirected to Stripe's secure payment page
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Your payment information is never stored on our servers
            </p>
          </div>
        </div>

        {/* Stripe Badge */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-2">
          <span className="text-xs text-gray-500">Powered by</span>
          <div className="bg-gray-900 text-white px-3 py-1 rounded text-xs font-semibold">
            stripe
          </div>
        </div>
      </div>

      {/* Additional Security Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">What happens next?</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• You'll be redirected to Stripe's secure checkout page</li>
              <li>• Enter your payment details safely on Stripe's platform</li>
              <li>• Complete your payment and return to our site</li>
              <li>• Receive an email confirmation with your order details</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}