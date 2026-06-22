import { prisma } from "@/lib/prisma";
import { localizedField, pickLocalized, type Locale } from "@/lib/locale";
import type { PageMetaItem, ProjectListItem } from "@/types/database";

export async function getProjectsPageMeta(locale: Locale): Promise<PageMetaItem> {
  const meta = await prisma.pageMeta.findUnique({ where: { id: "projects" } });
  if (!meta) {
    throw new Error("Projects page meta is not seeded.");
  }
  return {
    title: localizedField(meta, locale, "Title"),
    description: localizedField(meta, locale, "Description"),
  };
}

export async function getProjectCategories(locale: Locale) {
  const categories = await prisma.projectCategory.findMany({
    orderBy: { order: "asc" },
  });

  return [
    {
      key: "all",
      label: locale === "fa" ? "همهٔ پروژه‌ها" : "All Projects",
    },
    ...categories.map((c) => ({
      key: c.key,
      label: pickLocalized(locale, c.faName, c.enName),
    })),
  ];
}

export async function getProjects(
  locale: Locale,
  category?: string,
): Promise<ProjectListItem[]> {
  const projects = await prisma.project.findMany({
    where: {
      isPublished: true,
      ...(category && category !== "all"
        ? { category: { key: category } }
        : {}),
    },
    include: { category: true },
    orderBy: [{ order: "asc" }, { completionDate: "desc" }],
  });

  return projects.map((p) => ({
    id: p.id,
    slug: pickLocalized(locale, p.faSlug, p.enSlug),
    name: pickLocalized(locale, p.faName, p.enName),
    description: pickLocalized(locale, p.faDescription, p.enDescription),
    thumbnail: p.thumbnail,
    category: pickLocalized(locale, p.category.faName, p.category.enName),
    categoryKey: p.category.key,
    client: p.client,
    technologies: p.technologies,
    completionDate: p.completionDate?.toISOString() ?? null,
  }));
}

export async function getProjectBySlug(locale: Locale, slug: string) {
  const project = await prisma.project.findFirst({
    where: {
      isPublished: true,
      OR: [{ faSlug: slug }, { enSlug: slug }],
    },
    include: { category: true },
  });

  if (!project) return null;

  return {
    id: project.id,
    slug: pickLocalized(locale, project.faSlug, project.enSlug),
    name: pickLocalized(locale, project.faName, project.enName),
    description: pickLocalized(locale, project.faDescription, project.enDescription),
    thumbnail: project.thumbnail,
    category: pickLocalized(locale, project.category.faName, project.category.enName),
    categoryKey: project.category.key,
    client: project.client,
    technologies: project.technologies,
    completionDate: project.completionDate?.toISOString() ?? null,
    status: project.status,
  };
}
