import RateVolunteersClient from "@/app/ngo/needs/[id]/rate-volunteers/RateVolunteersClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RateVolunteersClient needId={id} />;
}