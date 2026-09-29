import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default async function FarmersPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  return (
    <div style={{ minHeight: "100vh" }}>
      <SiteHeader country={country} />
      <main style={{ padding: "2.5rem 1.25rem", maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-display), system-ui" }}>Farmers</h1>
        <p style={{ color: "var(--muted)" }}>
          Every farmer on Kisaan runs an independent shop inside the warehouse.
        </p>
        <Link href={`/${country}/shops`} style={{ color: "var(--field)", fontWeight: 600 }}>
          Browse shops →
        </Link>
      </main>
    </div>
  );
}
