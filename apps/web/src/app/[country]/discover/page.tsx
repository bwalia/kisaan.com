export default function DiscoverStub({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  return (
    <Stub title="Discover" note="Catalogue and search arrive in Phase 2." params={params} />
  );
}

async function Stub({
  title,
  note,
  params,
}: {
  title: string;
  note: string;
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  return (
    <main style={{ padding: "2rem 1.25rem", maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-display), system-ui" }}>{title}</h1>
      <p style={{ color: "var(--muted)" }}>{note}</p>
      <a href={`/${country}`} style={{ color: "var(--field)", fontWeight: 600 }}>
        Back to home
      </a>
    </main>
  );
}
