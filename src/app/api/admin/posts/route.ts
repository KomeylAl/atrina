import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const posts = await prisma.post.findMany({
    include: {
      category: { select: { faName: true, enName: true } },
      tags: { include: { tag: { select: { faName: true, enName: true } } } },
      user: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return jsonOk(posts);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = await request.json();
    const { tagIds, ...data } = body;

    const post = await prisma.post.create({
      data: {
        ...data,
        userId: session.userId,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    if (tagIds?.length) {
      await prisma.postTag.createMany({
        data: tagIds.map((tagId: string) => ({ postId: post.id, tagId })),
      });
    }

    return jsonOk(post, 201);
  } catch (err) {
    console.error("[POST /api/admin/posts]", err);
    return jsonError("Create failed", 500);
  }
}
