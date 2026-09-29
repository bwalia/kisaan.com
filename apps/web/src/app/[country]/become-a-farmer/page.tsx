import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default async function BecomeFarmerPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  return (
    <div style={{ minHeight: "100vh" }}>
      <SiteHeader country={country} />
      <main style={{ padding: "2.5rem 1.25rem", maxWidth: 640, margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: "var(--font-display), system-ui",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            margin: "0 0 0.75rem",
          }}
        >
          Your farm. Your sub-shop.
        </h1>
        <p style={{ color: "var(--muted)", margin: "0 0 1.5rem" }}>
          Kisaan is the warehouse. You create a branded shop with its own slug, catalogue, and
          market currency — then publish when you are ready.
        </p>
        <ol style={{ color: "var(--muted)", paddingLeft: "1.25rem", margin: "0 0 2rem" }}>
          <li>Register or sign in on the seller dashboard</li>
          <li>Create a draft shop for this country market</li>
          <li>Add products priced in minor units (never floats)</li>
          <li>Publish the shop and products to appear on the warehouse floor</li>
        </ol>
        <Link
          href={`/${country}/seller`}
          style={{
            display: "inline-block",
            background: "var(--tomato)",
            color: "#fff",
            padding: "0.85rem 1.25rem",
            fontWeight: 600,
          }}
        >
          Open seller dashboard
        </Link>
      </main>
    </div>
  );
}
