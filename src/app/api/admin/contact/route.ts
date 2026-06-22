import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [methods, submissions] = await Promise.all([
    prisma.contactMethod.findMany({ orderBy: { order: "asc" } }),
    prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return jsonOk({ methods, submissions });
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { section, data } = await request.json();

  if (section === "method") {
    if (data.id) {
      await prisma.contactMethod.update({ where: { id: data.id }, data });
    } else {
      await prisma.contactMethod.create({ data });
    }
  } else if (section === "markRead") {
    await prisma.contactSubmission.update({
      where: { id: data.id },
      data: { isRead: true },
    });
  } else {
    return jsonError("Invalid section");
  }

  return jsonOk({ success: true });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { section, id } = await request.json();

  if (section === "method") {
    await prisma.contactMethod.delete({ where: { id } });
  } else if (section === "submission") {
    await prisma.contactSubmission.delete({ where: { id } });
  }

  return jsonOk({ success: true });
}
