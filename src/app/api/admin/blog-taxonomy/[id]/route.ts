import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { type, ...data } = await request.json();

  const item =
    type === "tags"
      ? await prisma.tags.update({ where: { id }, data })
      : await prisma.categories.update({ where: { id }, data });

  return jsonOk(item);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { type } = await request.json();

  if (type === "tags") {
    await prisma.postTag.deleteMany({ where: { tagId: id } });
    await prisma.tags.delete({ where: { id } });
  } else {
    await prisma.categories.delete({ where: { id } });
  }

  return jsonOk({ success: true });
}
