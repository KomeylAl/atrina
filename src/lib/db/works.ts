import { prisma } from "@/lib/prisma";
import { localizedField, pickLocalized, type Locale } from "@/lib/locale";
import type { PageMetaItem, WorkListItem } from "@/types/database";
import { resolveMediaUrl } from "@/lib/uploads";

export async function getWorkPageMeta(locale: Locale): Promise<PageMetaItem> {
  const meta = await prisma.pageMeta.findUnique({ where: { id: "work" } });
  if (!meta) {
    throw new Error("Work page meta is not seeded.");
  }
  return {
    title: localizedField(meta, locale, "Title"),
    description: localizedField(meta, locale, "Description"),
  };
}

export async function getWorkCategories(locale: Locale) {
  const categories = await prisma.workCategory.findMany({
    orderBy: { order: "asc" },
  });

  return [
    {
      key: "all",
      label: locale === "fa" ? "همهٔ نمونه‌کارها" : "All Work",
    },
    ...categories.map((c) => ({
      key: c.key,
      label: pickLocalized(locale, c.faName, c.enName),
    })),
  ];
}

export async function getWorks(
  locale: Locale,
  category?: string,
): Promise<WorkListItem[]> {
  const works = await prisma.work.findMany({
    where: {
      isPublished: true,
      ...(category && category !== "all"
        ? { category: { key: category } }
        : {}),
    },
    include: { category: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return works.map((w) => ({
    id: w.id,
    slug: pickLocalized(locale, w.faSlug, w.enSlug),
    title: pickLocalized(locale, w.faTitle, w.enTitle),
    description: pickLocalized(locale, w.faDescription, w.enDescription),
    thumbnail: resolveMediaUrl(w.thumbnail),
    category: pickLocalized(locale, w.category.faName, w.category.enName),
    categoryKey: w.category.key,
    challenge: pickLocalized(locale, w.faChallenge ?? "", w.enChallenge ?? "") || null,
    solution: pickLocalized(locale, w.faSolution ?? "", w.enSolution ?? "") || null,
    results: pickLocalized(locale, w.faResults ?? "", w.enResults ?? "") || null,
    technologies: w.technologies,
  }));
}

export async function getWorkBySlug(locale: Locale, slug: string) {
  const work = await prisma.work.findFirst({
    where: {
      isPublished: true,
      OR: [{ faSlug: slug }, { enSlug: slug }],
    },
    include: { category: true },
  });

  if (!work) return null;

  return {
    id: work.id,
    slug: pickLocalized(locale, work.faSlug, work.enSlug),
    title: pickLocalized(locale, work.faTitle, work.enTitle),
    description: pickLocalized(locale, work.faDescription, work.enDescription),
    thumbnail: work.thumbnail,
    category: pickLocalized(locale, work.category.faName, work.category.enName),
    categoryKey: work.category.key,
    challenge: pickLocalized(locale, work.faChallenge ?? "", work.enChallenge ?? "") || null,
    solution: pickLocalized(locale, work.faSolution ?? "", work.enSolution ?? "") || null,
    results: pickLocalized(locale, work.faResults ?? "", work.enResults ?? "") || null,
    technologies: work.technologies,
    galleryImages: work.galleryImages.map(resolveMediaUrl),
  };
}
