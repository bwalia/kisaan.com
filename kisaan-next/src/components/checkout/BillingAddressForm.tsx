'use client';

import { useState, useEffect } from 'react';
import type { BillingAddressFormProps, Country, State } from '@/types/checkout';
import {
  getCountries,
  getStatesByCountry,
  getCommonCountries,
  getPostalCodePlaceholder,
  getPostalCodeLabel,
  requiresState,
  getDefaultCountry
} from '@/lib/countries';

export default function BillingAddressForm({
  data,
  onChange,
  errors,
  customerName = ''
}: BillingAddressFormProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [sameAsCustomer, setSameAsCustomer] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [showAllCountries, setShowAllCountries] = useState(false);

  // Load countries and states on component mount
  useEffect(() => {
    const allCountries = getCountries();
    setCountries(allCountries);

    // Set default country if none selected
    if (!data.country) {
      const defaultCountry = getDefaultCountry();
      onChange({ country: defaultCountry });
    }
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (data.country) {
      const countryStates = getStatesByCountry(data.country);
      setStates(countryStates);

      // Clear state if it doesn't exist in the new country
      if (data.state && !countryStates.find(s => s.code === data.state)) {
        onChange({ state: '' });
      }
    } else {
      setStates([]);
    }
  }, [data.country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    onChange({ country: countryCode, state: '' }); // Clear state when country changes
  };

  const handleSameAsCustomer = (checked: boolean) => {
    setSameAsCustomer(checked);
    if (checked && customerName) {
      onChange({ name: customerName });
    }
  };

  const getFieldError = (fieldName: string) => {
    return errors[`billing_${fieldName}`];
  };

  const isFieldValid = (fieldName: string, value: string) => {
    if (!value && focusedField !== fieldName) return null;

    switch (fieldName) {
      case 'name':
        return value.trim().length >= 2;
      case 'address1':
        return value.trim().length >= 5;
      case 'city':
        return value.trim().length >= 2;
      case 'state':
        return value !== '';
      case 'zip':
        return value.length >= 3;
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
          2
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Billing Address</h2>
          <p className="text-sm text-gray-600">Where should we send your invoice?</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Same as customer name checkbox */}
        {customerName && (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="sameAsCustomer"
              checked={sameAsCustomer}
              onChange={(e) => handleSameAsCustomer(e.target.checked)}
              className="w-4 h-4 text-[#fe004d] border-gray-300 rounded focus:ring-[#fe004d]"
            />
            <label htmlFor="sameAsCustomer" className="text-sm text-gray-700">
              Same as contact name ({customerName})
            </label>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              required
              value={data.name}
              onChange={handleChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                getFieldError('name')
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-[#fe004d] focus:border-[#fe004d]'
              } ${isFieldValid('name', data.name) === true ? 'pr-12' : ''}`}
              placeholder="Full name on billing address"
            />
            {getFieldIcon('name', data.name) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getFieldIcon('name', data.name)}
              </div>
            )}
          </div>
          {getFieldError('name') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <div className="relative">
            <input
              type="text"
              name="address1"
              required
              value={data.address1}
              onChange={handleChange}
              onFocus={() => setFocusedField('address1')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                getFieldError('address1')
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-[#fe004d] focus:border-[#fe004d]'
              } ${isFieldValid('address1', data.address1) === true ? 'pr-12' : ''}`}
              placeholder="Enter your street address"
            />
            {getFieldIcon('address1', data.address1) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getFieldIcon('address1', data.address1)}
              </div>
            )}
          </div>
          {getFieldError('address1') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('address1')}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <select
            name="country"
            required
            value={data.country}
            onChange={handleCountryChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              getFieldError('country')
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-[#fe004d] focus:border-[#fe004d]'
            }`}
          >
            <option value="">Select Country</option>

            {/* Common Countries */}
            <optgroup label="Popular Countries">
              {getCommonCountries().map((country) => (
                <option key={`common-${country.code}`} value={country.code}>
                  {country.name}
                </option>
              ))}
            </optgroup>

            {/* All Countries */}
            {showAllCountries && (
              <optgroup label="All Countries">
                {countries
                  .filter(country => !getCommonCountries().find(c => c.code === country.code))
                  .map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
              </optgroup>
            )}
          </select>

          {!showAllCountries && (
            <button
              type="button"
              onClick={() => setShowAllCountries(true)}
              className="mt-2 text-sm text-[#fe004d] hover:text-[#e6003d] font-medium"
            >
              + Show all countries
            </button>
          )}

          {getFieldError('country') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('country')}</p>
          )}
        </div>

        {/* City, State, ZIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <div className="relative">
              <input
                type="text"
                name="city"
                required
                value={data.city}
                onChange={handleChange}
                onFocus={() => setFocusedField('city')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  getFieldError('city')
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-[#fe004d] focus:border-[#fe004d]'
                } ${isFieldValid('city', data.city) === true ? 'pr-12' : ''}`}
                placeholder="Enter city"
              />
              {getFieldIcon('city', data.city) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon('city', data.city)}
                </div>
              )}
            </div>
            {getFieldError('city') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('city')}</p>
            )}
          </div>

          {/* State/Province (conditional) */}
          {requiresState(data.country) ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {data.country === 'US' ? 'State' : data.country === 'CA' ? 'Province' : 'State/Province'} *
              </label>
              <select
                name="state"
                required
                value={data.state}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  getFieldError('state')
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-[#fe004d] focus:border-[#fe004d]'
                }`}
              >
                <option value="">Select {data.country === 'CA' ? 'Province' : 'State'}</option>
                {states.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
              {getFieldError('state') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('state')}</p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province (Optional)
              </label>
              <input
                type="text"
                name="state"
                value={data.state}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe004d] focus:border-[#fe004d]"
                placeholder="State or Province"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getPostalCodeLabel(data.country)} *
            </label>
            <div className="relative">
              <input
                type="text"
                name="zip"
                required
                value={data.zip}
                onChange={handleChange}
                onFocus={() => setFocusedField('zip')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  getFieldError('zip')
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-[#fe004d] focus:border-[#fe004d]'
                } ${isFieldValid('zip', data.zip) === true ? 'pr-12' : ''}`}
                placeholder={getPostalCodePlaceholder(data.country)}
              />
              {getFieldIcon('zip', data.zip) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon('zip', data.zip)}
                </div>
              )}
            </div>
            {getFieldError('zip') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('zip')}</p>
            )}
          </div>
        </div>


        {/* Address Verification Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">International Shipping</h4>
              <p className="text-xs text-blue-700">
                We ship worldwide! Address format and shipping costs will be calculated based on your selected country. Address verification ensures secure processing and delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}