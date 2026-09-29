"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { apiBase } from "@/lib/api";
import { marketToCountryCode } from "@/lib/markets";

type AuthUser = { id: string; email: string; name?: string | null; role: string };
type Shop = {
  id: string;
  slug: string;
  name: string;
  status: string;
  country_code: string;
  default_currency: string;
  description?: string | null;
};
type Product = {
  id: string;
  sku: string;
  name: string;
  status: string;
  amount_minor_units: number;
  currency: string;
  quantity: number;
};

const TOKEN_KEY = "kisaan_token";

export default function SellerDashboard({ country }: { country: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const api = apiBase();
  const countryCode = useMemo(() => marketToCountryCode(country), [country]);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    void refreshShops(token);
  }, [token]);

  useEffect(() => {
    if (!token || !selectedShopId) {
      setProducts([]);
      return;
    }
    void refreshProducts(token, selectedShopId);
  }, [token, selectedShopId]);

  async function auth(path: string, body: object) {
    setError("");
    setMessage("");
    const res = await fetch(`${api}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Auth failed");
      return;
    }
    localStorage.setItem(TOKEN_KEY, json.token);
    setToken(json.token);
    setUser(json.user);
    setMessage(`Signed in as ${json.user.email}`);
  }

  async function refreshShops(t: string) {
    const res = await fetch(`${api}/api/v1/shops/me`, {
      headers: { authorization: `Bearer ${t}` },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Could not load shops");
      return;
    }
    setShops(json.data ?? []);
    if (!selectedShopId && json.data?.[0]?.id) {
      setSelectedShopId(json.data[0].id);
    }
  }

  async function refreshProducts(t: string, shopId: string) {
    const res = await fetch(`${api}/api/v1/shops/${shopId}/products`, {
      headers: { authorization: `Bearer ${t}` },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Could not load products");
      return;
    }
    setProducts(json.data ?? []);
  }

  async function onCreateShop(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get("name") || ""),
      slug: String(fd.get("slug") || ""),
      country_code: countryCode,
      description: String(fd.get("description") || "") || null,
    };
    const res = await fetch(`${api}/api/v1/shops`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Create shop failed");
      return;
    }
    setMessage(`Created shop ${json.data.name}`);
    e.currentTarget.reset();
    await refreshShops(token);
    setSelectedShopId(json.data.id);
  }

  async function publishShop(id: string) {
    if (!token) return;
    const res = await fetch(`${api}/api/v1/shops/${id}/publish`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Publish failed");
      return;
    }
    setMessage(`Published ${json.data.name}`);
    await refreshShops(token);
  }

  async function onCreateProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token || !selectedShopId) return;
    const fd = new FormData(e.currentTarget);
    const major = Number(fd.get("price") || 0);
    const body = {
      sku: String(fd.get("sku") || ""),
      name: String(fd.get("name") || ""),
      description: String(fd.get("description") || "") || null,
      amount_minor_units: Math.round(major * 100),
      quantity: Number(fd.get("quantity") || 0),
    };
    const res = await fetch(`${api}/api/v1/shops/${selectedShopId}/products`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Create product failed");
      return;
    }
    setMessage(`Added product ${json.data.name}`);
    e.currentTarget.reset();
    await refreshProducts(token, selectedShopId);
  }

  async function publishProduct(id: string) {
    if (!token) return;
    const res = await fetch(`${api}/api/v1/products/${id}/publish`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Publish product failed");
      return;
    }
    setMessage(`Published product ${json.data.name}`);
    if (selectedShopId) await refreshProducts(token, selectedShopId);
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setShops([]);
    setProducts([]);
    setMessage("Signed out");
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <SiteHeader country={country} />
      <main style={{ padding: "2rem 1.25rem", maxWidth: 820, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-display), system-ui", margin: "0 0 0.5rem" }}>
          Seller dashboard
        </h1>
        <p style={{ color: "var(--muted)", margin: "0 0 1.5rem" }}>
          Create a branded sub-shop inside the Kisaan warehouse for market{" "}
          <strong>{country.toUpperCase()}</strong> ({countryCode}).
        </p>

        {(message || error) && (
          <p
            style={{
              color: error ? "var(--tomato)" : "var(--field)",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            {error || message}
          </p>
        )}

        {!token ? (
          <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            <AuthForm title="Register" submitLabel="Create account" onSubmit={(email, password, name) => auth("/api/v1/auth/register", { email, password, name })} />
            <AuthForm title="Login" submitLabel="Sign in" onSubmit={(email, password) => auth("/api/v1/auth/login", { email, password })} />
          </div>
        ) : (
          <div style={{ display: "grid", gap: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <p style={{ margin: 0 }}>
                Signed in{user ? ` as ${user.email}` : ""}.{" "}
                <button type="button" onClick={signOut} style={btnGhost}>
                  Sign out
                </button>
              </p>
              <Link href={`/${country}/shops`} style={{ color: "var(--field)", fontWeight: 600 }}>
                View public shops
              </Link>
            </div>

            <section style={sectionBox}>
              <h2 style={h2}>Create sub-shop</h2>
              <form onSubmit={onCreateShop} style={{ display: "grid", gap: "0.75rem" }}>
                <input name="name" required placeholder="Shop name" style={input} />
                <input name="slug" required placeholder="slug-like-this" pattern="[a-z0-9-]+" style={input} />
                <textarea name="description" placeholder="Short description" rows={3} style={input} />
                <button type="submit" style={btnPrimary}>
                  Create draft shop
                </button>
              </form>
            </section>

            <section style={sectionBox}>
              <h2 style={h2}>Your shops</h2>
              {shops.length === 0 ? (
                <p style={{ color: "var(--muted)", margin: 0 }}>No shops yet.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
                  {shops.map((s) => (
                    <li
                      key={s.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                        borderBottom: "1px solid var(--line)",
                        paddingBottom: "0.75rem",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedShopId(s.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          fontWeight: selectedShopId === s.id ? 700 : 500,
                        }}
                      >
                        {s.name} · {s.status} · {s.default_currency}
                      </button>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {s.status === "DRAFT" && (
                          <button type="button" style={btnPrimary} onClick={() => publishShop(s.id)}>
                            Publish
                          </button>
                        )}
                        {s.status === "PUBLISHED" && (
                          <Link
                            href={`/${country}/shops/${s.slug}`}
                            style={{ ...btnGhost, display: "inline-block" }}
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {selectedShopId && (
              <section style={sectionBox}>
                <h2 style={h2}>Add product</h2>
                <form onSubmit={onCreateProduct} style={{ display: "grid", gap: "0.75rem" }}>
                  <input name="sku" required placeholder="SKU" style={input} />
                  <input name="name" required placeholder="Product name" style={input} />
                  <textarea name="description" placeholder="Description" rows={2} style={input} />
                  <input name="price" required type="number" step="0.01" min="0" placeholder="Price (major units)" style={input} />
                  <input name="quantity" type="number" min="0" defaultValue={10} placeholder="Stock qty" style={input} />
                  <button type="submit" style={btnPrimary}>
                    Add draft product
                  </button>
                </form>

                <h3 style={{ ...h2, marginTop: "1.5rem", fontSize: "1.05rem" }}>Products</h3>
                {products.length === 0 ? (
                  <p style={{ color: "var(--muted)" }}>No products in this shop.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem" }}>
                    {products.map((p) => (
                      <li
                        key={p.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "0.75rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>
                          {p.name} · {p.status} · {(p.amount_minor_units / 100).toFixed(2)} {p.currency}
                        </span>
                        {p.status !== "PUBLISHED" && (
                          <button type="button" style={btnPrimary} onClick={() => publishProduct(p.id)}>
                            Publish
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function AuthForm({
  title,
  submitLabel,
  onSubmit,
}: {
  title: string;
  submitLabel: string;
  onSubmit: (email: string, password: string, name?: string) => void | Promise<void>;
}) {
  return (
    <section style={sectionBox}>
      <h2 style={h2}>{title}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          void onSubmit(
            String(fd.get("email") || ""),
            String(fd.get("password") || ""),
            String(fd.get("name") || "") || undefined,
          );
        }}
        style={{ display: "grid", gap: "0.75rem" }}
      >
        {title === "Register" && <input name="name" placeholder="Name" style={input} />}
        <input name="email" type="email" required placeholder="Email" style={input} />
        <input name="password" type="password" required minLength={8} placeholder="Password" style={input} />
        <button type="submit" style={btnPrimary}>
          {submitLabel}
        </button>
      </form>
    </section>
  );
}

const sectionBox: React.CSSProperties = {
  borderTop: "1px solid var(--line)",
  paddingTop: "1.25rem",
};

const h2: React.CSSProperties = {
  fontFamily: "var(--font-display), system-ui",
  fontSize: "1.2rem",
  margin: "0 0 0.75rem",
};

const input: React.CSSProperties = {
  border: "1.5px solid var(--ink)",
  background: "var(--chalk)",
  padding: "0.65rem 0.75rem",
  font: "inherit",
  width: "100%",
  boxSizing: "border-box",
};

const btnPrimary: React.CSSProperties = {
  background: "var(--tomato)",
  color: "#fff",
  border: "none",
  padding: "0.65rem 1rem",
  fontWeight: 600,
  cursor: "pointer",
  font: "inherit",
};

const btnGhost: React.CSSProperties = {
  background: "transparent",
  border: "1.5px solid var(--ink)",
  padding: "0.4rem 0.75rem",
  fontWeight: 600,
  cursor: "pointer",
  font: "inherit",
  color: "inherit",
};
