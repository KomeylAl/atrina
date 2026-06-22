import { prisma } from "@/lib/prisma";
import { localizedField, pickLocalized, type Locale } from "@/lib/locale";
import type { BlogPostListItem, PageMetaItem } from "@/types/database";
import { PostStatus } from "@prisma/client";

export async function getBlogPageMeta(locale: Locale): Promise<PageMetaItem> {
  const meta = await prisma.pageMeta.findUnique({ where: { id: "blog" } });
  if (!meta) {
    throw new Error("Blog page meta is not seeded.");
  }
  return {
    title: localizedField(meta, locale, "Title"),
    description: localizedField(meta, locale, "Description"),
  };
}

export async function getBlogCategories(locale: Locale) {
  const categories = await prisma.categories.findMany({
    orderBy: { createdAt: "asc" },
  });

  return [
    {
      key: "all",
      label: locale === "fa" ? "همهٔ پست‌ها" : "All Posts",
    },
    ...categories.map((c) => ({
      key: pickLocalized(locale, c.faSlug, c.enSlug),
      label: pickLocalized(locale, c.faName, c.enName),
    })),
  ];
}

export async function getBlogPosts(
  locale: Locale,
  filters?: { category?: string; search?: string },
): Promise<BlogPostListItem[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      ...(filters?.category && filters.category !== "all"
        ? {
            category: {
              OR: [{ faSlug: filters.category }, { enSlug: filters.category }],
            },
          }
        : {}),
      ...(filters?.search
        ? {
            OR: [
              { faTitle: { contains: filters.search, mode: "insensitive" } },
              { enTitle: { contains: filters.search, mode: "insensitive" } },
              { faExcerpt: { contains: filters.search, mode: "insensitive" } },
              { enExcerpt: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      user: { select: { name: true } },
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: { publishedAt: "desc" },
  });

  return posts.map((post) => ({
    id: post.id,
    slug: pickLocalized(locale, post.faSlug, post.enSlug),
    title: pickLocalized(locale, post.faTitle, post.enTitle),
    excerpt: pickLocalized(locale, post.faExcerpt, post.enExcerpt),
    thumbnail: post.thumbnail,
    category: pickLocalized(locale, post.category.faName, post.category.enName),
    categoryKey: pickLocalized(locale, post.category.faSlug, post.category.enSlug),
    author: post.user.name,
    readTime: post.readTime,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    tags: post.tags.map((pt) =>
      pickLocalized(locale, pt.tag.faName, pt.tag.enName),
    ),
  }));
}

export async function getBlogPostBySlug(locale: Locale, slug: string) {
  const post = await prisma.post.findFirst({
    where: {
      status: PostStatus.PUBLISHED,
      OR: [{ faSlug: slug }, { enSlug: slug }],
    },
    include: {
      user: { select: { name: true } },
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!post) return null;

  return {
    id: post.id,
    slug: pickLocalized(locale, post.faSlug, post.enSlug),
    title: pickLocalized(locale, post.faTitle, post.enTitle),
    excerpt: pickLocalized(locale, post.faExcerpt, post.enExcerpt),
    content: pickLocalized(locale, post.faContent, post.enContent),
    thumbnail: post.thumbnail,
    category: pickLocalized(locale, post.category.faName, post.category.enName),
    categoryKey: pickLocalized(locale, post.category.faSlug, post.category.enSlug),
    author: post.user.name,
    readTime: post.readTime,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    tags: post.tags.map((pt) =>
      pickLocalized(locale, pt.tag.faName, pt.tag.enName),
    ),
  };
}
