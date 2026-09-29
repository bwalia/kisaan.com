import Link from "next/link";

export function SiteHeader({
  country,
  extra,
}: {
  country: string;
  extra?: React.ReactNode;
}) {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--line)",
        padding: "0.75rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        background: "var(--chalk)",
        flexWrap: "wrap",
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
      <nav
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          fontSize: "0.9rem",
          flexWrap: "wrap",
        }}
      >
        <Link href={`/${country}/shops`}>Shops</Link>
        <Link href={`/${country}/seller`}>Seller</Link>
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
        {extra}
      </nav>
    </header>
  );
}
