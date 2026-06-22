import { getAboutPageData, getAboutPageMeta } from "@/lib/db/about";
import { parseLocale } from "@/lib/api-utils";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseLocale(searchParams.get("locale"));

    const [meta, data] = await Promise.all([
      getAboutPageMeta(locale),
      getAboutPageData(locale),
    ]);

    return jsonOk({ meta, ...data });
  } catch (error) {
    console.error("[GET /api/about]", error);
    return jsonError("Failed to fetch about page data", 500);
  }
}
