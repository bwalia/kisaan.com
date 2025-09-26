'use client';

import { useState } from 'react';
import type { CustomerInfoFormProps } from '@/types/checkout';

export default function CustomerInfoForm({ data, onChange, errors }: CustomerInfoFormProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const getFieldError = (fieldName: string) => {
    return errors[fieldName];
  };

  const isFieldValid = (fieldName: string, value: string) => {
    if (!value && focusedField !== fieldName) return null;

    switch (fieldName) {
      case 'customer_email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'customer_first_name':
      case 'customer_last_name':
        return value.trim().length >= 2;
      case 'customer_phone':
        return !value || /^[\+]?[\d\s\-\(\)]{10,}$/.test(value);
      default:
        return true;
    }
  };

  const getFieldIcon = (fieldName: string, value: string) => {
    const isValid = isFieldValid(fieldName, value);
    if (isValid === null) return null;

    return isValid ? (
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-[#fe004d] text-white rounded-full flex items-center justify-center text-sm font-semibold">
          1
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
          <p className="text-sm text-gray-600">We'll use this to contact you about your order</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <div className="relative">
              <input
                type="text"
                name="customer_first_name"
                required
                value={data.customer_first_name}
                onChange={handleChange}
                onFocus={() => setFocusedField('customer_first_name')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  getFieldError('customer_first_name')
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-[#fe004d] focus:border-[#fe004d]'
                } ${isFieldValid('customer_first_name', data.customer_first_name) === true ? 'pr-12' : ''}`}
                placeholder="Enter your first name"
              />
              {getFieldIcon('customer_first_name', data.customer_first_name) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon('customer_first_name', data.customer_first_name)}
                </div>
              )}
            </div>
            {getFieldError('customer_first_name') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('customer_first_name')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <div className="relative">
              <input
                type="text"
                name="customer_last_name"
                required
                value={data.customer_last_name}
                onChange={handleChange}
                onFocus={() => setFocusedField('customer_last_name')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  getFieldError('customer_last_name')
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-[#fe004d] focus:border-[#fe004d]'
                } ${isFieldValid('customer_last_name', data.customer_last_name) === true ? 'pr-12' : ''}`}
                placeholder="Enter your last name"
              />
              {getFieldIcon('customer_last_name', data.customer_last_name) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon('customer_last_name', data.customer_last_name)}
                </div>
              )}
            </div>
            {getFieldError('customer_last_name') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('customer_last_name')}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              name="customer_email"
              required
              value={data.customer_email}
              onChange={handleChange}
              onFocus={() => setFocusedField('customer_email')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                getFieldError('customer_email')
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-[#fe004d] focus:border-[#fe004d]'
              } ${isFieldValid('customer_email', data.customer_email) === true ? 'pr-12' : ''}`}
              placeholder="Enter your email address"
            />
            {getFieldIcon('customer_email', data.customer_email) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getFieldIcon('customer_email', data.customer_email)}
              </div>
            )}
          </div>
          {getFieldError('customer_email') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('customer_email')}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            We'll send your receipt and order updates to this email
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number (Optional)
          </label>
          <div className="relative">
            <input
              type="tel"
              name="customer_phone"
              value={data.customer_phone}
              onChange={handleChange}
              onFocus={() => setFocusedField('customer_phone')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                getFieldError('customer_phone')
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-[#fe004d] focus:border-[#fe004d]'
              } ${isFieldValid('customer_phone', data.customer_phone) === true ? 'pr-12' : ''}`}
              placeholder="Enter your phone number"
            />
            {getFieldIcon('customer_phone', data.customer_phone) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getFieldIcon('customer_phone', data.customer_phone)}
              </div>
            )}
          </div>
          {getFieldError('customer_phone') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('customer_phone')}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            For order updates and delivery notifications
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Privacy & Security</h4>
              <p className="text-xs text-gray-600">
                Your personal information is encrypted and securely stored. We'll never share your contact details with third parties without your consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}