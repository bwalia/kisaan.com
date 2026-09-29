/** Market URL keys (`uk`) ↔ ISO country codes (`GB`). */

const MARKET_TO_ISO: Record<string, string> = {
  uk: "GB",
  gb: "GB",
  in: "IN",
  us: "US",
  ie: "IE",
  de: "DE",
  fr: "FR",
  ca: "CA",
  au: "AU",
};

const ISO_TO_MARKET: Record<string, string> = {
  GB: "uk",
  IN: "in",
  US: "us",
  IE: "ie",
  DE: "de",
  FR: "fr",
  CA: "ca",
  AU: "au",
};

export function marketToCountryCode(market: string): string {
  const key = market.trim().toLowerCase();
  return MARKET_TO_ISO[key] ?? key.toUpperCase();
}

export function countryToMarket(countryCode: string): string {
  const code = countryCode.trim().toUpperCase();
  return ISO_TO_MARKET[code] ?? code.toLowerCase();
}

/** Default display currency for a market key. */
export function marketDefaultCurrency(market: string): string {
  switch (marketToCountryCode(market)) {
    case "GB":
      return "GBP";
    case "IN":
      return "INR";
    case "US":
      return "USD";
    case "IE":
    case "DE":
    case "FR":
      return "EUR";
    case "CA":
      return "CAD";
    case "AU":
      return "AUD";
    default:
      return "GBP";
  }
}

export function formatMoney(amountMinorUnits: number, currency: string): string {
  const major = amountMinorUnits / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(major);
  } catch {
    return `${currency} ${major.toFixed(2)}`;
  }
}
