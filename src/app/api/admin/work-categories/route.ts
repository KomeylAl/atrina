import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk } from "@/lib/api-response";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const categories = await prisma.workCategory.findMany({
    orderBy: { order: "asc" },
  });
  return jsonOk(categories);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const data = await request.json();
  const category = await prisma.workCategory.create({ data });
  return jsonOk(category, 201);
}
