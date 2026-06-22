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
  const post = await prisma.post.findUnique({
    where: { id },
    include: { tags: true },
  });

  if (!post) return jsonError("Not found", 404);
  return jsonOk(post);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const { tagIds, ...data } = body;

    if (data.status === "PUBLISHED") {
      const existing = await prisma.post.findUnique({ where: { id } });
      if (existing && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
    }

    const post = await prisma.post.update({ where: { id }, data });

    if (tagIds !== undefined) {
      await prisma.postTag.deleteMany({ where: { postId: id } });
      if (tagIds.length) {
        await prisma.postTag.createMany({
          data: tagIds.map((tagId: string) => ({ postId: id, tagId })),
        });
      }
    }

    return jsonOk(post);
  } catch (err) {
    console.error("[PUT /api/admin/posts/[id]]", err);
    return jsonError("Update failed", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await prisma.postTag.deleteMany({ where: { postId: id } });
  await prisma.post.delete({ where: { id } });
  return jsonOk({ success: true });
}
