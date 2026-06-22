import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [story, stats, values, teamSection, cta, teamMembers] =
    await Promise.all([
      prisma.aboutStory.findUnique({ where: { id: "default" } }),
      prisma.aboutStat.findMany({ orderBy: { order: "asc" } }),
      prisma.aboutValue.findMany({ orderBy: { order: "asc" } }),
      prisma.aboutTeamSection.findUnique({ where: { id: "default" } }),
      prisma.aboutCta.findUnique({ where: { id: "default" } }),
      prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
    ]);

  return jsonOk({ story, stats, values, teamSection, cta, teamMembers });
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { section, data } = await request.json();

    switch (section) {
      case "story":
        await prisma.aboutStory.upsert({
          where: { id: "default" },
          update: data,
          create: { id: "default", ...data },
        });
        break;
      case "teamSection":
        await prisma.aboutTeamSection.upsert({
          where: { id: "default" },
          update: data,
          create: { id: "default", ...data },
        });
        break;
      case "cta":
        await prisma.aboutCta.upsert({
          where: { id: "default" },
          update: data,
          create: { id: "default", ...data },
        });
        break;
      case "stat":
        if (data.id) {
          await prisma.aboutStat.update({ where: { id: data.id }, data });
        } else {
          await prisma.aboutStat.create({ data });
        }
        break;
      case "value":
        if (data.id) {
          await prisma.aboutValue.update({ where: { id: data.id }, data });
        } else {
          await prisma.aboutValue.create({ data });
        }
        break;
      case "teamMember":
        if (data.id) {
          await prisma.teamMember.update({ where: { id: data.id }, data });
        } else {
          await prisma.teamMember.create({ data });
        }
        break;
      default:
        return jsonError("Invalid section");
    }

    return jsonOk({ success: true });
  } catch (err) {
    console.error("[PUT /api/admin/about]", err);
    return jsonError("Update failed", 500);
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { section, id } = await request.json();

  switch (section) {
    case "stat":
      await prisma.aboutStat.delete({ where: { id } });
      break;
    case "value":
      await prisma.aboutValue.delete({ where: { id } });
      break;
    case "teamMember":
      await prisma.teamMember.delete({ where: { id } });
      break;
    default:
      return jsonError("Invalid section");
  }

  return jsonOk({ success: true });
}
