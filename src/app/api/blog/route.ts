import { getBlogPosts, getBlogCategories, getBlogPageMeta } from "@/lib/db/blog";
import { parseLocale } from "@/lib/api-utils";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseLocale(searchParams.get("locale"));
    const category = searchParams.get("category") ?? undefined;
    const search = searchParams.get("q") ?? undefined;

    const [meta, categories, posts] = await Promise.all([
      getBlogPageMeta(locale),
      getBlogCategories(locale),
      getBlogPosts(locale, { category, search }),
    ]);

    return jsonOk({ meta, categories, posts });
  } catch (error) {
    console.error("[GET /api/blog]", error);
    return jsonError("Failed to fetch blog data", 500);
  }
}
