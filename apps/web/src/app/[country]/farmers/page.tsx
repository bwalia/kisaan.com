export default async function FarmersStub({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  return (
    <main style={{ padding: "2rem 1.25rem", maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-display), system-ui" }}>Farmers</h1>
      <p style={{ color: "var(--muted)" }}>
        Farmer directory and shop pages arrive in Phase 2. Shops are first-class domain objects.
      </p>
      <a href={`/${country}`} style={{ color: "var(--field)", fontWeight: 600 }}>
        Back to home
      </a>
    </main>
  );
}
