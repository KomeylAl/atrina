import { getHomePageData } from "@/lib/db/home";
import { parseLocale } from "@/lib/api-utils";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseLocale(searchParams.get("locale"));
    const data = await getHomePageData(locale);
    return jsonOk(data);
  } catch (error) {
    console.error("[GET /api/home]", error);
    return jsonError("Failed to fetch home page data", 500);
  }
}
