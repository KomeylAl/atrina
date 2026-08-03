import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET() {
  const { error } = await requireAdmin({ permission: "settings" });
  if (error) return error;

  const [settings, navLinks, pageMeta, socialLinks, trustBadges] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.navLink.findMany({ orderBy: { order: "asc" } }),
    prisma.pageMeta.findMany(),
    prisma.footerSocialLink.findMany({ orderBy: { order: "asc" } }),
    prisma.footerTrustBadge.findMany({ orderBy: { order: "asc" } }),
  ]);

  return jsonOk({ settings, navLinks, pageMeta, socialLinks, trustBadges });
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin({ permission: "settings" });
  if (error) return error;

  try {
    const { section, data } = await request.json();

    switch (section) {
      case "settings":
        await prisma.siteSettings.upsert({
          where: { id: "default" },
          update: data,
          create: { id: "default", ...data },
        });
        break;
      case "navLink":
        if (data.id) {
          await prisma.navLink.update({ where: { id: data.id }, data });
        } else {
          await prisma.navLink.create({ data });
        }
        break;
      case "pageMeta":
        await prisma.pageMeta.upsert({
          where: { id: data.id },
          update: data,
          create: data,
        });
        break;
      case "socialLink":
        if (data.id) {
          await prisma.footerSocialLink.update({ where: { id: data.id }, data });
        } else {
          await prisma.footerSocialLink.create({ data });
        }
        break;
      case "trustBadge":
        if (data.id) {
          await prisma.footerTrustBadge.update({ where: { id: data.id }, data });
        } else {
          await prisma.footerTrustBadge.create({ data });
        }
        break;
      default:
        return jsonError("Invalid section");
    }

    return jsonOk({ success: true });
  } catch (err) {
    console.error("[PUT /api/admin/settings]", err);
    return jsonError("Update failed", 500);
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { section, id } = await request.json();

  switch (section) {
    case "navLink":
      await prisma.navLink.delete({ where: { id } });
      break;
    case "socialLink":
      await prisma.footerSocialLink.delete({ where: { id } });
      break;
    case "trustBadge":
      await prisma.footerTrustBadge.delete({ where: { id } });
      break;
    default:
      // backward compatible: body with only { id } deletes nav link
      if (id && !section) {
        await prisma.navLink.delete({ where: { id } });
        break;
      }
      return jsonError("Invalid section");
  }

  return jsonOk({ success: true });
}
