import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default async function DiscoverPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  return (
    <div style={{ minHeight: "100vh" }}>
      <SiteHeader country={country} />
      <main style={{ padding: "2.5rem 1.25rem", maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-display), system-ui" }}>Discover</h1>
        <p style={{ color: "var(--muted)" }}>
          Browse farmer sub-shops in this market. Cart and search land in later phases.
        </p>
        <Link href={`/${country}/shops`} style={{ color: "var(--field)", fontWeight: 600 }}>
          Go to shops →
        </Link>
      </main>
    </div>
  );
}
