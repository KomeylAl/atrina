import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [settings, navLinks, pageMeta] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.navLink.findMany({ orderBy: { order: "asc" } }),
    prisma.pageMeta.findMany(),
  ]);

  return jsonOk({ settings, navLinks, pageMeta });
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
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

  const { id } = await request.json();
  await prisma.navLink.delete({ where: { id } });
  return jsonOk({ success: true });
}
