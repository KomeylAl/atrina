import path from "path";

/** Persistent upload directory (outside `public/` — survives Next.js builds) */
export const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export function getUploadFilePath(filename: string) {
  const safe = path.basename(filename);
  return path.join(UPLOAD_DIR, safe);
}

export function getUploadPublicUrl(filename: string) {
  const safe = path.basename(filename);
  return `/api/uploads/${safe}`;
}

/** Normalize legacy `/uploads/...` URLs to the API route */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/api/uploads/")) return url;
  if (url.startsWith("/uploads/")) {
    return `/api/uploads/${url.replace("/uploads/", "")}`;
  }
  return url;
}
