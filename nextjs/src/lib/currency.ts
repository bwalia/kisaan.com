// Professional Multi-Currency Utility for Frontend
// Provides currency formatting, symbols, and validation

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimal_places: number;
  stripe_supported: boolean;
}

// Supported currencies with their formatting rules
const SUPPORTED_CURRENCIES: Record<string, Currency> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', decimal_places: 2, stripe_supported: true },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', decimal_places: 2, stripe_supported: true },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', decimal_places: 2, stripe_supported: true },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimal_places: 2, stripe_supported: true },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', decimal_places: 2, stripe_supported: true },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimal_places: 2, stripe_supported: true },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimal_places: 0, stripe_supported: true },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', decimal_places: 2, stripe_supported: true },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimal_places: 2, stripe_supported: true },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimal_places: 2, stripe_supported: true },
};

/**
 * Get currency symbol for a given currency code
 * @param currencyCode - ISO 4217 currency code (e.g., "USD", "EUR")
 * @returns Currency symbol (e.g., "$", "€")
 */
export function getCurrencySymbol(currencyCode: string = 'USD'): string {
  const currency = SUPPORTED_CURRENCIES[currencyCode.toUpperCase()];
  return currency ? currency.symbol : currencyCode;
}

/**
 * Get decimal places for a given currency
 * @param currencyCode - ISO 4217 currency code
 * @returns Number of decimal places (e.g., 2 for USD, 0 for JPY)
 */
export function getDecimalPlaces(currencyCode: string = 'USD'): number {
  const currency = SUPPORTED_CURRENCIES[currencyCode.toUpperCase()];
  return currency ? currency.decimal_places : 2;
}

/**
 * Format amount with currency symbol and proper decimals
 * @param amount - Numeric amount to format
 * @param currencyCode - ISO 4217 currency code
 * @returns Formatted string (e.g., "$1,234.56", "¥1,234")
 */
export function formatCurrency(amount: number | string | null | undefined, currencyCode: string = 'USD'): string {
  const num = parseFloat(String(amount || 0));

  if (isNaN(num)) {
    return `${getCurrencySymbol(currencyCode)}0`;
  }

  const code = currencyCode.toUpperCase();
  const symbol = getCurrencySymbol(code);
  const decimalPlaces = getDecimalPlaces(code);

  // Format with proper decimal places
  const formatted = num.toFixed(decimalPlaces);

  // Add thousand separators
  const parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const formattedNumber = parts.join('.');

  return `${symbol}${formattedNumber}`;
}

/**
 * Format amount using Intl.NumberFormat for locale-aware formatting
 * @param amount - Numeric amount to format
 * @param currencyCode - ISO 4217 currency code
 * @param locale - BCP 47 locale (e.g., "en-US", "en-GB", "hi-IN")
 * @returns Locale-formatted currency string
 */
export function formatCurrencyLocale(
  amount: number | string | null | undefined,
  currencyCode: string = 'USD',
  locale: string = 'en-US'
): string {
  const num = parseFloat(String(amount || 0));

  if (isNaN(num)) {
    return formatCurrency(0, currencyCode);
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
    }).format(num);
  } catch (error) {
    // Fallback to basic formatting if Intl fails
    return formatCurrency(num, currencyCode);
  }
}

/**
 * Parse formatted currency string to number
 * @param formattedAmount - Formatted currency string (e.g., "$1,234.56")
 * @returns Numeric value
 */
export function parseCurrency(formattedAmount: string): number {
  // Remove currency symbols, spaces, and commas
  const cleaned = formattedAmount.replace(/[^\d.-]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Check if currency code is valid
 * @param currencyCode - Currency code to validate
 * @returns true if valid, false otherwise
 */
export function isValidCurrency(currencyCode: string): boolean {
  return !!SUPPORTED_CURRENCIES[currencyCode.toUpperCase()];
}

/**
 * Get currency information
 * @param currencyCode - Currency code
 * @returns Currency object or null
 */
export function getCurrencyInfo(currencyCode: string): Currency | null {
  return SUPPORTED_CURRENCIES[currencyCode.toUpperCase()] || null;
}

/**
 * Get all supported currencies
 * @returns Array of Currency objects
 */
export function getAllCurrencies(): Currency[] {
  return Object.values(SUPPORTED_CURRENCIES).sort((a, b) => a.code.localeCompare(b.code));
}

/**
 * Detect currency from country code
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Currency code
 */
export function detectCurrencyFromCountry(countryCode: string): string {
  const countryToCurrency: Record<string, string> = {
    US: 'USD', GB: 'GBP', IN: 'INR', CA: 'CAD', AU: 'AUD',
    JP: 'JPY', CN: 'CNY', CH: 'CHF', SG: 'SGD',
    // European Union countries
    DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
    BE: 'EUR', AT: 'EUR', PT: 'EUR', IE: 'EUR', FI: 'EUR',
    GR: 'EUR', LU: 'EUR', SI: 'EUR', CY: 'EUR', MT: 'EUR',
    SK: 'EUR', EE: 'EUR', LV: 'EUR', LT: 'EUR',
  };

  return countryToCurrency[countryCode.toUpperCase()] || 'USD';
}

/**
 * Convert amount to smallest currency unit for Stripe
 * USD: 100.50 → 10050 cents
 * JPY: 1000 → 1000 (no decimals)
 * @param amount - Decimal amount
 * @param currencyCode - Currency code
 * @returns Amount in smallest unit
 */
export function toStripeAmount(amount: number, currencyCode: string = 'USD'): number {
  const decimalPlaces = getDecimalPlaces(currencyCode);
  return Math.round(amount * Math.pow(10, decimalPlaces));
}

/**
 * Convert from Stripe smallest unit to decimal amount
 * USD: 10050 cents → 100.50
 * JPY: 1000 → 1000
 * @param stripeAmount - Amount in smallest unit
 * @param currencyCode - Currency code
 * @returns Decimal amount
 */
export function fromStripeAmount(stripeAmount: number, currencyCode: string = 'USD'): number {
  const decimalPlaces = getDecimalPlaces(currencyCode);
  return stripeAmount / Math.pow(10, decimalPlaces);
}

/**
 * Format price range
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @param currencyCode - Currency code
 * @returns Formatted range (e.g., "$10 - $50")
 */
export function formatPriceRange(minPrice: number, maxPrice: number, currencyCode: string = 'USD'): string {
  const min = formatCurrency(minPrice, currencyCode);
  const max = formatCurrency(maxPrice, currencyCode);
  return `${min} - ${max}`;
}

/**
 * Default currency (can be configured per deployment)
 */
export const DEFAULT_CURRENCY = 'USD';

/**
 * Get locale for currency formatting based on currency code
 * @param currencyCode - Currency code
 * @returns BCP 47 locale identifier
 */
export function getCurrencyLocale(currencyCode: string): string {
  const localeMap: Record<string, string> = {
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    INR: 'en-IN',
    CAD: 'en-CA',
    AUD: 'en-AU',
    JPY: 'ja-JP',
    CNY: 'zh-CN',
    CHF: 'de-CH',
    SGD: 'en-SG',
  };

  return localeMap[currencyCode.toUpperCase()] || 'en-US';
}
