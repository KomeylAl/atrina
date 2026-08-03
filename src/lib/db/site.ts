import { prisma } from "@/lib/prisma";
import { localizedField, pickLocalized, type Locale } from "@/lib/locale";
import type { SiteSettingsData } from "@/types/database";

export async function getSiteSettings(locale: Locale): Promise<SiteSettingsData> {
  const [settings, navLinks, socialLinks, trustBadges] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.navLink.findMany({ orderBy: { order: "asc" } }),
    prisma.footerSocialLink.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.footerTrustBadge.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ]);

  if (!settings) {
    throw new Error("Site settings are not seeded.");
  }

  return {
    logo: localizedField(settings, locale, "Logo"),
    footerDescription: localizedField(settings, locale, "FooterDescription"),
    footerCopyright: localizedField(settings, locale, "FooterCopyright"),
    footerLinksTitle: localizedField(settings, locale, "FooterLinksTitle"),
    footerContactTitle: localizedField(settings, locale, "FooterContactTitle"),
    careersEmail: settings.careersEmail,
    navLinks: navLinks
      .filter((link) => link.showInHeader)
      .map((link) => ({
        name: pickLocalized(locale, link.faName, link.enName),
        path: `/${locale}${link.path === "/" ? "" : link.path}`,
      })),
    socialLinks: socialLinks.map((s) => ({
      id: s.id,
      platform: s.platform,
      url: s.url,
    })),
    trustBadges: trustBadges.map((b) => ({
      id: b.id,
      image: b.image,
      link: b.link,
      alt: pickLocalized(locale, b.faAlt, b.enAlt),
    })),
  };
}

export async function getFooterNavLinks(locale: Locale) {
  const navLinks = await prisma.navLink.findMany({
    where: { showInFooter: true },
    orderBy: { order: "asc" },
  });

  return navLinks.map((link) => ({
    name: pickLocalized(locale, link.faName, link.enName),
    path: `/${locale}${link.path === "/" ? "" : link.path}`,
  }));
}

export async function getFooterContactInfo() {
  const methods = await prisma.contactMethod.findMany({
    where: { type: { in: ["EMAIL", "PHONE"] } },
    orderBy: { order: "asc" },
    take: 2,
  });

  return methods.map((m) => m.value);
}
