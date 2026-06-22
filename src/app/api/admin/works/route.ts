import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const works = await prisma.work.findMany({
    include: { category: true },
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  });
  return jsonOk(works);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const data = await request.json();
  const work = await prisma.work.create({ data });
  return jsonOk(work, 201);
}
