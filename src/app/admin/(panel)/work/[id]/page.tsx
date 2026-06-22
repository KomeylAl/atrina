import WorkForm from "@/components/admin/WorkForm";

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WorkForm workId={id} />;
}
