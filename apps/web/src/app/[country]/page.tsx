import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { apiBase, fetchCountries, fetchCountryShops } from "@/lib/api";
import { countryToMarket, formatMoney } from "@/lib/markets";

export default async function CountryHome({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const [countries, shops] = await Promise.all([
    fetchCountries(),
    fetchCountryShops(country),
  ]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteHeader country={country} />

      <main style={{ flex: 1 }}>
        <section
          style={{
            padding: "4rem 1.25rem 3rem",
            maxWidth: 820,
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display), system-ui",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 7vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 1rem",
            }}
          >
            One warehouse.
            <br />
            Many farm shops.
          </p>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "1.125rem",
              maxWidth: "40ch",
              margin: "0 0 2rem",
            }}
          >
            Kisaan is the online warehouse. Each farmer runs a branded sub-shop with their own
            catalogue and currency for this market.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link
              href={`/${country}/shops`}
              style={{
                background: "var(--field)",
                color: "#fff",
                padding: "0.85rem 1.25rem",
                fontWeight: 600,
              }}
            >
              Browse shops
            </Link>
            <Link
              href={`/${country}/become-a-farmer`}
              style={{
                border: "1.5px solid var(--ink)",
                padding: "0.85rem 1.25rem",
                fontWeight: 600,
              }}
            >
              Open your shop
            </Link>
          </div>
        </section>

        <section
          style={{
            borderTop: "1px solid var(--line)",
            padding: "2.5rem 1.25rem",
          }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui",
                fontSize: "1.35rem",
                margin: "0 0 1.25rem",
              }}
            >
              Shops in this market
            </h2>
            {shops.length === 0 ? (
              <p style={{ color: "var(--muted)", margin: 0 }}>
                No published shops yet.{" "}
                <Link href={`/${country}/become-a-farmer`} style={{ color: "var(--field)", fontWeight: 600 }}>
                  Be the first farmer
                </Link>{" "}
                — or run <code>./scripts/seed.sh</code> for demos.
              </p>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gap: "1rem",
                }}
              >
                {shops.map((shop) => (
                  <li key={shop.id} style={{ borderBottom: "1px solid var(--line)", paddingBottom: "1rem" }}>
                    <Link href={`/${country}/shops/${shop.slug}`} style={{ display: "block" }}>
                      <strong
                        style={{
                          fontFamily: "var(--font-display), system-ui",
                          fontSize: "1.15rem",
                        }}
                      >
                        {shop.name}
                      </strong>
                      <span style={{ display: "block", color: "var(--muted)", fontSize: "0.95rem" }}>
                        {shop.description || `Prices in ${shop.default_currency}`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section
          style={{
            borderTop: "1px solid var(--line)",
            padding: "2rem 1.25rem",
            background: "var(--chalk)",
          }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui",
                fontSize: "1.25rem",
                margin: "0 0 1rem",
              }}
            >
              Markets
            </h2>
            {countries.length === 0 ? (
              <p style={{ color: "var(--muted)", margin: 0 }}>
                API offline — start Postgres + API to load countries.
              </p>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                {countries.map((c) => {
                  const market = c.market || countryToMarket(c.code);
                  const active = market === country.toLowerCase();
                  return (
                    <li key={c.code}>
                      <Link
                        href={`/${market}`}
                        style={{
                          display: "inline-block",
                          border: "1.5px solid var(--ink)",
                          padding: "0.4rem 0.75rem",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          background: active ? "var(--ink)" : "transparent",
                          color: active ? "var(--chalk)" : "var(--ink)",
                        }}
                      >
                        {c.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </main>

      <footer
        style={{
          borderTop: "1px solid var(--line)",
          padding: "1.5rem",
          fontSize: "0.8rem",
          color: "var(--muted)",
        }}
      >
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          Phase 2 — warehouse of farmer shops. API {apiBase()}. Example price{" "}
          {formatMoney(1299, "GBP")}.
        </div>
      </footer>
    </div>
  );
}
