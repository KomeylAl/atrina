import { getSiteSettings, getFooterNavLinks, getFooterContactInfo } from "@/lib/db/site";
import { parseLocale } from "@/lib/api-utils";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseLocale(searchParams.get("locale"));

    const [settings, footerNavLinks, footerContact] = await Promise.all([
      getSiteSettings(locale),
      getFooterNavLinks(locale),
      getFooterContactInfo(),
    ]);

    return jsonOk({
      ...settings,
      footerNavLinks,
      footerContact,
    });
  } catch (error) {
    console.error("[GET /api/site]", error);
    return jsonError("Failed to fetch site settings", 500);
  }
}
