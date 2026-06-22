import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";
import { getSession } from "@/lib/auth/session";

async function crudHandlers(model: "categories" | "tags") {
  const isCategory = model === "categories";

  return {
    GET: async () => {
      const { error } = await requireAdmin();
      if (error) return error;
      const items = isCategory
        ? await prisma.categories.findMany({ orderBy: { createdAt: "desc" } })
        : await prisma.tags.findMany({ orderBy: { createdAt: "desc" } });
      return jsonOk(items);
    },

    POST: async (request: Request) => {
      const { error } = await requireAdmin();
      if (error) return error;
      const session = await getSession();
      if (!session) return jsonError("Unauthorized", 401);

      const data = await request.json();
      const item = isCategory
        ? await prisma.categories.create({ data: { ...data, userId: session.userId } })
        : await prisma.tags.create({ data: { ...data, userId: session.userId } });
      return jsonOk(item, 201);
    },
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "categories";
  return (await crudHandlers(type as "categories" | "tags")).GET();
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "categories";
  return (await crudHandlers(type as "categories" | "tags")).POST(request);
}
