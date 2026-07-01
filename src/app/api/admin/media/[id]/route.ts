import { unlink } from "fs/promises";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";
import { getUploadFilePath } from "@/lib/uploads";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return jsonError("Not found", 404);

  try {
    const filename = media.url.replace(/^\/api\/uploads\//, "").replace(/^\/uploads\//, "");
    await unlink(getUploadFilePath(filename)).catch(() => {});
    await prisma.media.delete({ where: { id } });
    return jsonOk({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/media/[id]]", err);
    return jsonError("Delete failed", 500);
  }
}
