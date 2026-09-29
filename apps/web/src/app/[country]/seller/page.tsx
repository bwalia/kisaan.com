import SellerDashboard from "@/components/SellerDashboard";

export default async function SellerPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  return <SellerDashboard country={country} />;
}
