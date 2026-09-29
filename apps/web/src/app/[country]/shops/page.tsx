import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchCountryShops } from "@/lib/api";

export default async function ShopsIndexPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const shops = await fetchCountryShops(country);

  return (
    <div style={{ minHeight: "100vh" }}>
      <SiteHeader country={country} />
      <main style={{ padding: "2.5rem 1.25rem", maxWidth: 820, margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: "var(--font-display), system-ui",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            margin: "0 0 0.5rem",
          }}
        >
          Farm shops
        </h1>
        <p style={{ color: "var(--muted)", margin: "0 0 2rem" }}>
          Independent seller sub-shops listed in this Kisaan market.
        </p>

        {shops.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>
            No published shops.{" "}
            <Link href={`/${country}/become-a-farmer`} style={{ color: "var(--field)", fontWeight: 600 }}>
              Create one
            </Link>
            .
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "1.25rem" }}>
            {shops.map((shop) => (
              <li key={shop.id} style={{ borderTop: "1px solid var(--line)", paddingTop: "1.25rem" }}>
                <Link href={`/${country}/shops/${shop.slug}`}>
                  <strong
                    style={{
                      fontFamily: "var(--font-display), system-ui",
                      fontSize: "1.25rem",
                      display: "block",
                    }}
                  >
                    {shop.name}
                  </strong>
                  <span style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
                    {shop.description || `${shop.default_currency} · /${country}/shops/${shop.slug}`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
