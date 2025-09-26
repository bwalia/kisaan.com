import { Country, State, City } from "country-state-city";
import type {
  Country as CountryType,
  State as StateType,
} from "@/types/checkout";

// Get all countries formatted for our forms
export const getCountries = (): CountryType[] => {
  return Country.getAllCountries().map((country) => ({
    code: country.isoCode,
    name: country.name,
    phoneCode: country.phonecode,
  }));
};

// Get states for a specific country
export const getStatesByCountry = (countryCode: string): StateType[] => {
  return State.getStatesOfCountry(countryCode).map((state) => ({
    code: state.isoCode,
    name: state.name,
    countryCode: state.countryCode,
  }));
};

// Get cities for a specific state and country
export const getCitiesByState = (countryCode: string, stateCode: string) => {
  return City.getCitiesOfState(countryCode, stateCode).map((city) => ({
    name: city.name,
    stateCode: city.stateCode,
    countryCode: city.countryCode,
  }));
};

// Common countries (for prioritized display)
export const getCommonCountries = (): CountryType[] => {
  const commonCodes = ["US", "CA", "GB", "AU", "DE", "FR", "IN", "JP", "CN"];
  const allCountries = getCountries();

  return commonCodes
    .map((code) => allCountries.find((country) => country.code === code))
    .filter(Boolean) as CountryType[];
};

// Format postal code placeholder based on country
export const getPostalCodePlaceholder = (countryCode: string): string => {
  const placeholders: { [key: string]: string } = {
    US: "12345 or 12345-6789",
    CA: "K1A 0A6",
    GB: "SW1A 1AA",
    AU: "2000",
    DE: "10115",
    FR: "75001",
    IN: "110001",
    JP: "100-0001",
    CN: "100000",
  };

  return placeholders[countryCode] || "Enter postal code";
};

// Format postal code label based on country
export const getPostalCodeLabel = (countryCode: string): string => {
  const labels: { [key: string]: string } = {
    US: "ZIP Code",
    CA: "Postal Code",
    GB: "Postcode",
    AU: "Postcode",
    DE: "Postleitzahl",
    FR: "Code Postal",
    IN: "PIN Code",
    JP: "Postal Code",
    CN: "Postal Code",
  };

  return labels[countryCode] || "Postal Code";
};

// Validate postal code format based on country
export const validatePostalCode = (
  countryCode: string,
  postalCode: string
): boolean => {
  const patterns: { [key: string]: RegExp } = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
    GB: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/i,
    AU: /^\d{4}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    IN: /^\d{6}$/,
    JP: /^\d{3}-\d{4}$/,
    CN: /^\d{6}$/,
  };

  const pattern = patterns[countryCode];
  return pattern ? pattern.test(postalCode) : postalCode.length >= 3;
};

// Check if country requires state/province
export const requiresState = (countryCode: string): boolean => {
  const stateRequiredCountries = ["US", "CA", "AU", "IN", "BR", "MX"];
  return stateRequiredCountries.includes(countryCode);
};

// Get default country (can be based on user's location or preference)
export const getDefaultCountry = (): string => {
  // For now, default to US, but this could be dynamic based on:
  // - User's IP geolocation
  // - Browser language
  // - User preference
  return "US";
};
