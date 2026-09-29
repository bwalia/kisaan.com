import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchPublicCatalogue } from "@/lib/api";
import { formatMoney, marketDefaultCurrency } from "@/lib/markets";

export default async function ShopStorefrontPage({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  const { country, slug } = await params;
  const displayCurrency = marketDefaultCurrency(country);
  const data = await fetchPublicCatalogue(country, slug, displayCurrency);

  if (!data) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <SiteHeader country={country} />
        <main style={{ padding: "2.5rem 1.25rem", maxWidth: 720, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "var(--font-display), system-ui" }}>Shop not found</h1>
          <p style={{ color: "var(--muted)" }}>
            This sub-shop is unpublished or does not exist in this market.
          </p>
          <Link href={`/${country}/shops`} style={{ color: "var(--field)", fontWeight: 600 }}>
            Back to shops
          </Link>
        </main>
      </div>
    );
  }

  const { shop, products } = data;

  return (
    <div style={{ minHeight: "100vh" }}>
      <SiteHeader country={country} />
      <main>
        <section
          style={{
            padding: "3rem 1.25rem 2rem",
            borderBottom: "1px solid var(--line)",
            background: "var(--chalk)",
          }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <p style={{ margin: "0 0 0.5rem", color: "var(--muted)", fontSize: "0.85rem" }}>
              Kisaan warehouse · {shop.country_code} · {shop.default_currency}
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display), system-ui",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                margin: "0 0 0.75rem",
                letterSpacing: "-0.02em",
              }}
            >
              {shop.name}
            </h1>
            {shop.description && (
              <p style={{ color: "var(--muted)", maxWidth: "48ch", margin: 0 }}>{shop.description}</p>
            )}
          </div>
        </section>

        <section style={{ padding: "2rem 1.25rem", maxWidth: 820, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui",
              fontSize: "1.25rem",
              margin: "0 0 1.25rem",
            }}
          >
            Catalogue
          </h2>
          {products.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No published products yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "1.5rem" }}>
              {products.map((p) => (
                <li
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    borderBottom: "1px solid var(--line)",
                    paddingBottom: "1.25rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong style={{ fontFamily: "var(--font-display), system-ui", fontSize: "1.1rem" }}>
                      {p.name}
                    </strong>
                    {p.description && (
                      <span style={{ display: "block", color: "var(--muted)", fontSize: "0.95rem" }}>
                        {p.description}
                      </span>
                    )}
                    <span style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)" }}>
                      SKU {p.sku} · stock {p.quantity}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700 }}>{formatMoney(p.amount_minor_units, p.currency)}</div>
                    {p.display && p.display.approximate && (
                      <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                        ≈ {formatMoney(p.display.amount_minor_units, p.display.currency)} (approx.)
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
