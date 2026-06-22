import { prisma } from "@/lib/prisma";
import { localizedField, pickLocalized, type Locale } from "@/lib/locale";
import type { PageMetaItem, TeamMemberItem } from "@/types/database";

export async function getAboutPageMeta(locale: Locale): Promise<PageMetaItem> {
  const meta = await prisma.pageMeta.findUnique({ where: { id: "about" } });
  if (!meta) {
    throw new Error("About page meta is not seeded.");
  }
  return {
    title: localizedField(meta, locale, "Title"),
    description: localizedField(meta, locale, "Description"),
  };
}

export async function getAboutPageData(locale: Locale) {
  const [story, stats, values, teamSection, cta, teamMembers, settings] =
    await Promise.all([
      prisma.aboutStory.findUnique({ where: { id: "default" } }),
      prisma.aboutStat.findMany({ orderBy: { order: "asc" } }),
      prisma.aboutValue.findMany({ orderBy: { order: "asc" } }),
      prisma.aboutTeamSection.findUnique({ where: { id: "default" } }),
      prisma.aboutCta.findUnique({ where: { id: "default" } }),
      prisma.teamMember.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.siteSettings.findUnique({ where: { id: "default" } }),
    ]);

  if (!story || !teamSection || !cta) {
    throw new Error("About page content is not seeded.");
  }

  return {
    story: {
      title: localizedField(story, locale, "Title"),
      paragraphs: [
        localizedField(story, locale, "Paragraph1"),
        localizedField(story, locale, "Paragraph2"),
        localizedField(story, locale, "Paragraph3"),
      ],
    },
    stats: stats.map((s) => ({
      id: s.id,
      value: s.value,
      label: pickLocalized(locale, s.faLabel, s.enLabel),
    })),
    values: values.map((v) => ({
      id: v.id,
      title: localizedField(v, locale, "Title"),
      description: localizedField(v, locale, "Description"),
    })),
    team: {
      title: localizedField(teamSection, locale, "Title"),
      subtitle: localizedField(teamSection, locale, "Subtitle"),
      members: teamMembers.map((m): TeamMemberItem => ({
        id: m.id,
        name: m.name,
        role: pickLocalized(locale, m.faRole, m.enRole),
        bio: pickLocalized(locale, m.faBio, m.enBio),
        image: m.image,
        linkedin: m.linkedin,
        twitter: m.twitter,
        github: m.github,
      })),
    },
    cta: {
      title: localizedField(cta, locale, "Title"),
      description: localizedField(cta, locale, "Description"),
      emailLabel: localizedField(cta, locale, "EmailLabel"),
      email: settings?.careersEmail ?? "careers@atrina.com",
    },
    valuesSectionTitle: locale === "fa" ? "ارزش‌های ما" : "Our Values",
  };
}
