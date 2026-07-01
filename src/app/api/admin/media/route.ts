import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";
import {
  UPLOAD_DIR,
  getUploadFilePath,
  getUploadPublicUrl,
} from "@/lib/uploads";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });
  return jsonOk(media);
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return jsonError("No file provided");

    if (!file.type.startsWith("image/")) {
      return jsonError("Only image files are allowed");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    await writeFile(getUploadFilePath(filename), buffer);

    const url = getUploadPublicUrl(filename);
    const media = await prisma.media.create({
      data: {
        filename: file.name,
        url,
        mimeType: file.type,
        size: file.size,
        userId: session!.userId,
      },
    });

    return jsonOk(media, 201);
  } catch (err) {
    console.error("[POST /api/admin/media]", err);
    return jsonError("Upload failed", 500);
  }
}
