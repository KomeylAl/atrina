import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getUploadFilePath } from "@/lib/uploads";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path: segments } = await params;
    const filename = segments.map((s) => path.basename(s)).join("/");
    const filepath = getUploadFilePath(filename);

    const buffer = await readFile(filepath);
    const ext = path.extname(filename).toLowerCase();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
