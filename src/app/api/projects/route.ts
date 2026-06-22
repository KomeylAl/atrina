import { getProjects, getProjectCategories, getProjectsPageMeta } from "@/lib/db/projects";
import { parseLocale } from "@/lib/api-utils";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseLocale(searchParams.get("locale"));
    const category = searchParams.get("category") ?? undefined;

    const [meta, categories, projects] = await Promise.all([
      getProjectsPageMeta(locale),
      getProjectCategories(locale),
      getProjects(locale, category),
    ]);

    return jsonOk({ meta, categories, projects });
  } catch (error) {
    console.error("[GET /api/projects]", error);
    return jsonError("Failed to fetch projects", 500);
  }
}
