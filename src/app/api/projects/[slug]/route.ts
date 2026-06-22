import { getProjectBySlug } from "@/lib/db/projects";
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
    const project = await getProjectBySlug(locale, slug);

    if (!project) {
      return jsonError("Project not found", 404);
    }

    return jsonOk(project);
  } catch (error) {
    console.error("[GET /api/projects/[slug]]", error);
    return jsonError("Failed to fetch project", 500);
  }
}
