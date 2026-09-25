import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

async function fetchCountries(): Promise<{ code: string; name: string }[]> {
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

export default async function CountryHome({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const countries = await fetchCountries();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          borderBottom: "1px solid var(--line)",
          padding: "0.75rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--chalk)",
        }}
      >
        <Link
          href={`/${country}`}
          style={{
            fontFamily: "var(--font-display), system-ui",
            fontWeight: 800,
            fontSize: "1.35rem",
            letterSpacing: "-0.02em",
          }}
        >
          Kisaan
        </Link>
        <nav style={{ display: "flex", gap: "1rem", alignItems: "center", fontSize: "0.9rem" }}>
          <Link href={`/${country}/farmers`}>Farmers</Link>
          <Link
            href={`/${country}/become-a-farmer`}
            style={{
              background: "var(--tomato)",
              color: "#fff",
              padding: "0.4rem 0.85rem",
              fontWeight: 600,
            }}
          >
            Become a farmer
          </Link>
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        <section
          style={{
            padding: "4rem 1.25rem 3rem",
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display), system-ui",
              fontWeight: 800,
              fontSize: "clamp(2.75rem, 8vw, 4.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 1rem",
            }}
          >
            Fresh food.
            <br />
            Direct from farmers.
          </p>
          <p style={{ color: "var(--muted)", fontSize: "1.125rem", maxWidth: "36ch", margin: "0 0 2rem" }}>
            Shop local farmers and producers, all in one place. More of your money reaches the grower.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link
              href={`/${country}/discover`}
              style={{
                background: "var(--field)",
                color: "#fff",
                padding: "0.85rem 1.25rem",
                fontWeight: 600,
              }}
            >
              Shop fresh food
            </Link>
            <Link
              href={`/${country}/become-a-farmer`}
              style={{
                border: "1.5px solid var(--ink)",
                padding: "0.85rem 1.25rem",
                fontWeight: 600,
              }}
            >
              Become a farmer
            </Link>
          </div>
        </section>

        <section
          style={{
            borderTop: "1px solid var(--line)",
            padding: "2rem 1.25rem",
            background: "var(--chalk)",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
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
                API offline — start Postgres + API (`docker compose up`) to load countries.
              </p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {countries.map((c) => (
                  <li key={c.code}>
                    <Link
                      href={`/${c.code.toLowerCase()}`}
                      style={{
                        display: "inline-block",
                        border: "1.5px solid var(--ink)",
                        padding: "0.4rem 0.75rem",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        background: c.code.toLowerCase() === country.toLowerCase() ? "var(--ink)" : "transparent",
                        color: c.code.toLowerCase() === country.toLowerCase() ? "var(--chalk)" : "var(--ink)",
                      }}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid var(--line)", padding: "1.5rem", fontSize: "0.8rem", color: "var(--muted)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          Phase 1 foundation — farmer shops are first-class. Postgres-backed API at {API_URL}.
        </div>
      </footer>
    </div>
  );
}
