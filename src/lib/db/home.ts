import { prisma } from "@/lib/prisma";
import { localizedField, pickLocalized, type Locale } from "@/lib/locale";
import { resolveMediaUrl } from "@/lib/uploads";
import type { HomePageData } from "@/types/database";
import { PostStatus } from "@prisma/client";

function mapHeroContent(
  item: Record<string, unknown>,
  locale: Locale,
) {
  return {
    badge: localizedField(item, locale, "Badge"),
    titleTop: localizedField(item, locale, "TitleTop"),
    titleBottom: localizedField(item, locale, "TitleBottom"),
    description: localizedField(item, locale, "Description"),
    linkOneText: localizedField(item, locale, "LinkOneText"),
    linkTwoText: localizedField(item, locale, "LinkTwoText"),
    linkOneHref: (item.linkOneHref as string) ?? "/projects",
    linkTwoHref: (item.linkTwoHref as string) ?? "/about",
  };
}

export async function getHomePageData(locale: Locale): Promise<HomePageData> {
  const [
    hero,
    heroSlides,
    featuresSection,
    features,
    skillsSection,
    skillBars,
    skillItems,
    cta,
    postsSection,
    projectsSection,
    latestPosts,
    featuredProjects,
  ] = await Promise.all([
    prisma.homeHero.findUnique({ where: { id: "default" } }),
    prisma.homeHeroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.homeFeaturesSection.findUnique({ where: { id: "default" } }),
    prisma.homeFeature.findMany({ orderBy: { order: "asc" } }),
    prisma.homeSkillsSection.findUnique({ where: { id: "default" } }),
    prisma.homeSkillBar.findMany({ orderBy: { order: "asc" } }),
    prisma.homeSkillItem.findMany({ orderBy: { order: "asc" } }),
    prisma.homeCta.findUnique({ where: { id: "default" } }),
    prisma.homePostsSection.findUnique({ where: { id: "default" } }),
    prisma.homeProjectsSection.findUnique({ where: { id: "default" } }),
    prisma.post.findMany({
      where: { status: PostStatus.PUBLISHED },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.project.findMany({
      where: { isPublished: true, isFeatured: true },
      include: { category: true },
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
      take: 3,
    }),
  ]);

  if (!hero || !featuresSection || !skillsSection || !cta) {
    throw new Error("Home page content is not seeded. Run: npx prisma db seed");
  }

  const slides =
    heroSlides.length > 0
      ? heroSlides.map((slide) => ({
          id: slide.id,
          image: resolveMediaUrl(slide.image),
          ...mapHeroContent(slide, locale),
        }))
      : [
          {
            id: "default",
            image: null as string | null,
            ...mapHeroContent(hero, locale),
          },
        ];

  return {
    heroSlides: slides,
    features: {
      title: localizedField(featuresSection, locale, "Title"),
      description: localizedField(featuresSection, locale, "Description"),
      items: features.map((f) => ({
        id: f.id,
        icon: f.icon,
        title: localizedField(f, locale, "Title"),
        description: localizedField(f, locale, "Description"),
      })),
    },
    skills: {
      title: localizedField(skillsSection, locale, "Title"),
      description: localizedField(skillsSection, locale, "Description"),
      bars: skillBars.map((b) => ({
        id: b.id,
        name: pickLocalized(locale, b.faName, b.enName),
        level: b.level,
      })),
      items: skillItems.map((i) => ({
        id: i.id,
        text: pickLocalized(locale, i.faText, i.enText),
      })),
    },
    cta: {
      title: localizedField(cta, locale, "Title"),
      description: localizedField(cta, locale, "Description"),
      linkText: localizedField(cta, locale, "LinkText"),
      linkHref: cta.linkHref,
    },
    latestPosts: {
      title: postsSection
        ? localizedField(postsSection, locale, "Title")
        : locale === "fa"
          ? "آخرین مقالات"
          : "Latest Articles",
      description: postsSection
        ? localizedField(postsSection, locale, "Description")
        : "",
      items: latestPosts.map((post) => ({
        id: post.id,
        slug: pickLocalized(locale, post.faSlug, post.enSlug),
        title: pickLocalized(locale, post.faTitle, post.enTitle),
        excerpt: pickLocalized(locale, post.faExcerpt, post.enExcerpt),
        thumbnail: resolveMediaUrl(post.thumbnail),
        category: pickLocalized(locale, post.category.faName, post.category.enName),
        publishedAt: post.publishedAt?.toISOString() ?? null,
      })),
    },
    featuredProjects: {
      title: projectsSection
        ? localizedField(projectsSection, locale, "Title")
        : locale === "fa"
          ? "پروژه‌های برجسته"
          : "Featured Projects",
      description: projectsSection
        ? localizedField(projectsSection, locale, "Description")
        : "",
      items: featuredProjects.map((p) => ({
        id: p.id,
        slug: pickLocalized(locale, p.faSlug, p.enSlug),
        name: pickLocalized(locale, p.faName, p.enName),
        description: pickLocalized(locale, p.faDescription, p.enDescription),
        thumbnail: resolveMediaUrl(p.thumbnail),
        category: pickLocalized(locale, p.category.faName, p.category.enName),
      })),
    },
  };
}
