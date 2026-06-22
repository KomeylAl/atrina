import { prisma } from "@/lib/prisma";
import { localizedField, pickLocalized, type Locale } from "@/lib/locale";
import type { ContactMethodItem, PageMetaItem } from "@/types/database";

export async function getContactPageMeta(locale: Locale): Promise<PageMetaItem> {
  const meta = await prisma.pageMeta.findUnique({ where: { id: "contact" } });
  if (!meta) {
    throw new Error("Contact page meta is not seeded.");
  }
  return {
    title: localizedField(meta, locale, "Title"),
    description: localizedField(meta, locale, "Description"),
  };
}

export async function getContactMethods(
  locale: Locale,
): Promise<ContactMethodItem[]> {
  const methods = await prisma.contactMethod.findMany({
    orderBy: { order: "asc" },
  });

  return methods.map((m) => ({
    id: m.id,
    type: m.type,
    label: pickLocalized(locale, m.faLabel, m.enLabel),
    value: m.value,
    link: m.link,
    colorFrom: m.colorFrom,
    colorTo: m.colorTo,
  }));
}

export async function createContactSubmission(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  return prisma.contactSubmission.create({ data });
}
