import { getBlogPostBySlug } from "@/lib/db/blog";
import { parseLocale } from "@/lib/api-utils";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseLocale(searchParams.get("locale"));
    const { slug } = await params;
    const post = await getBlogPostBySlug(locale, slug);

    if (!post) {
      return jsonError("Post not found", 404);
    }

    return jsonOk(post);
  } catch (error) {
    console.error("[GET /api/blog/[slug]]", error);
    return jsonError("Failed to fetch blog post", 500);
  }
}
