import { getWorkBySlug } from "@/lib/db/works";
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
    const work = await getWorkBySlug(locale, slug);

    if (!work) {
      return jsonError("Work item not found", 404);
    }

    return jsonOk(work);
  } catch (error) {
    console.error("[GET /api/work/[slug]]", error);
    return jsonError("Failed to fetch work item", 500);
  }
}
