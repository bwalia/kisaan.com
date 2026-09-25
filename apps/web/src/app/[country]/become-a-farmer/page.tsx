export default async function BecomeFarmerPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  return (
    <main style={{ padding: "2rem 1.25rem", maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-display), system-ui" }}>
        Your farm. Your shop. Your customers.
      </h1>
      <p style={{ color: "var(--muted)" }}>
        Sell directly on Kisaan with transparent fees. Farmer onboarding lands in Phase 2–5.
      </p>
      <a href={`/${country}`} style={{ color: "var(--field)", fontWeight: 600 }}>
        Back to home
      </a>
    </main>
  );
}
