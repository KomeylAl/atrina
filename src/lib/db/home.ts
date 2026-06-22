import { prisma } from "@/lib/prisma";
import { localizedField, pickLocalized, type Locale } from "@/lib/locale";
import type { HomePageData } from "@/types/database";

export async function getHomePageData(locale: Locale): Promise<HomePageData> {
  const [
    hero,
    featuresSection,
    features,
    skillsSection,
    skillBars,
    skillItems,
    cta,
  ] = await Promise.all([
    prisma.homeHero.findUnique({ where: { id: "default" } }),
    prisma.homeFeaturesSection.findUnique({ where: { id: "default" } }),
    prisma.homeFeature.findMany({ orderBy: { order: "asc" } }),
    prisma.homeSkillsSection.findUnique({ where: { id: "default" } }),
    prisma.homeSkillBar.findMany({ orderBy: { order: "asc" } }),
    prisma.homeSkillItem.findMany({ orderBy: { order: "asc" } }),
    prisma.homeCta.findUnique({ where: { id: "default" } }),
  ]);

  if (!hero || !featuresSection || !skillsSection || !cta) {
    throw new Error("Home page content is not seeded. Run: npx prisma db seed");
  }

  return {
    hero: {
      badge: localizedField(hero, locale, "Badge"),
      titleTop: localizedField(hero, locale, "TitleTop"),
      titleBottom: localizedField(hero, locale, "TitleBottom"),
      description: localizedField(hero, locale, "Description"),
      linkOneText: localizedField(hero, locale, "LinkOneText"),
      linkTwoText: localizedField(hero, locale, "LinkTwoText"),
      linkOneHref: hero.linkOneHref,
      linkTwoHref: hero.linkTwoHref,
    },
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
  };
}
