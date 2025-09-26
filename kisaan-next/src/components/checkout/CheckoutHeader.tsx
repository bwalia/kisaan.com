'use client';

import Link from 'next/link';
import type { CheckoutHeaderProps } from '@/types/checkout';

export default function CheckoutHeader({ currentStep, totalSteps }: CheckoutHeaderProps) {
  const steps = [
    { number: 1, name: 'Information', description: 'Contact & shipping details' },
    { number: 2, name: 'Payment', description: 'Secure checkout' },
    { number: 3, name: 'Confirmation', description: 'Order complete' },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-[#fe004d] transition-colors">
            Home
          </Link>
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/cart" className="text-gray-500 hover:text-[#fe004d] transition-colors">
            Cart
          </Link>
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
            <p className="text-gray-600">Complete your order securely and safely</p>
          </div>

          {/* Security Badges */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Stripe Powered</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    step.number <= currentStep
                      ? 'bg-[#fe004d] text-white'
                      : step.number === currentStep + 1
                      ? 'bg-gray-200 text-gray-600 border-2 border-gray-300'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.number < currentStep ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>

                {/* Step Info */}
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div
                    className={`h-1 rounded-full ${
                      step.number < currentStep ? 'bg-[#fe004d]' : 'bg-gray-200'
                    }`}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Step Names */}
        <div className="sm:hidden mt-4 text-center">
          <p className="text-sm font-medium text-gray-900">
            Step {currentStep}: {steps.find(s => s.number === currentStep)?.name}
          </p>
          <p className="text-xs text-gray-500">
            {steps.find(s => s.number === currentStep)?.description}
          </p>
        </div>
      </div>
    </div>
  );
}