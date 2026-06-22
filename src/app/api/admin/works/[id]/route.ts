import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const work = await prisma.work.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!work) return jsonError("Not found", 404);
  return jsonOk(work);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const data = await request.json();
  const work = await prisma.work.update({ where: { id }, data });
  return jsonOk(work);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await prisma.work.delete({ where: { id } });
  return jsonOk({ success: true });
}
