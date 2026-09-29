const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export function apiBase(): string {
  return API_URL;
}

export type Country = {
  code: string;
  market: string;
  name: string;
  default_currency: string;
};

export type Shop = {
  id: string;
  farmer_user_id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  country_code: string;
  default_currency: string;
  contact: string | null;
  status: string;
  published_at: string | null;
};

export type ProductWithPrice = {
  id: string;
  shop_id: string;
  sku: string;
  name: string;
  description: string | null;
  status: string;
  amount_minor_units: number;
  currency: string;
  variant_id: string;
  quantity: number;
  display?: {
    amount_minor_units: number;
    currency: string;
    approximate: boolean;
  } | null;
};

export async function fetchCountries(): Promise<Country[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/countries`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchCountryShops(countryOrMarket: string): Promise<Shop[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/v1/countries/${encodeURIComponent(countryOrMarket)}/shops`,
      { next: { revalidate: 30 } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchPublicShop(
  countryOrMarket: string,
  slug: string,
): Promise<Shop | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/v1/shops/${encodeURIComponent(countryOrMarket)}/${encodeURIComponent(slug)}`,
      { next: { revalidate: 30 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchPublicCatalogue(
  countryOrMarket: string,
  slug: string,
  displayCurrency?: string,
): Promise<{ shop: Shop; products: ProductWithPrice[] } | null> {
  try {
    const q = displayCurrency
      ? `?display_currency=${encodeURIComponent(displayCurrency)}`
      : "";
    const res = await fetch(
      `${API_URL}/api/v1/shops/${encodeURIComponent(countryOrMarket)}/${encodeURIComponent(slug)}/products${q}`,
      { next: { revalidate: 30 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}
