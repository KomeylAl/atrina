import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const projects = await prisma.project.findMany({
    include: { category: true },
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  });
  return jsonOk(projects);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const session = await getSession();
  const data = await request.json();

  const project = await prisma.project.create({
    data: { ...data, userId: session?.userId },
  });
  return jsonOk(project, 201);
}
