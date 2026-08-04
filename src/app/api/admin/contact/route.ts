import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [methods, submissions, info] = await Promise.all([
    prisma.contactMethod.findMany({ orderBy: { order: "asc" } }),
    prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.contactPageInfo.findUnique({ where: { id: "default" } }),
  ]);

  return jsonOk({ methods, submissions, info });
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
  } else if (section === "info") {
    await prisma.contactPageInfo.upsert({
      where: { id: "default" },
      update: data,
      create: { id: "default", ...data },
    });
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
