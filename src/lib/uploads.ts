import path from "path";

/**
 * Persistent upload directory (outside `public/` — survives Next.js builds).
 * Avoid `process.cwd()` here so Turbopack does not NFT-trace the whole project.
 */
export function getUploadDir() {
  return process.env.UPLOAD_DIR || "uploads";
}
export function getUploadFilePath(filename: string) {
  const safe = path.basename(filename);
  return path.join(getUploadDir(), safe);
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
