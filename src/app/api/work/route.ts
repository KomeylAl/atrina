import { getWorks, getWorkCategories, getWorkPageMeta } from "@/lib/db/works";
import { parseLocale } from "@/lib/api-utils";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseLocale(searchParams.get("locale"));
    const category = searchParams.get("category") ?? undefined;

    const [meta, categories, works] = await Promise.all([
      getWorkPageMeta(locale),
      getWorkCategories(locale),
      getWorks(locale, category),
    ]);

    return jsonOk({ meta, categories, works });
  } catch (error) {
    console.error("[GET /api/work]", error);
    return jsonError("Failed to fetch work items", 500);
  }
}
