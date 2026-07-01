import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [
    heroSlides,
    featuresSection,
    features,
    skillsSection,
    skillBars,
    skillItems,
    cta,
    postsSection,
    projectsSection,
  ] = await Promise.all([
    prisma.homeHeroSlide.findMany({ orderBy: { order: "asc" } }),
    prisma.homeFeaturesSection.findUnique({ where: { id: "default" } }),
    prisma.homeFeature.findMany({ orderBy: { order: "asc" } }),
    prisma.homeSkillsSection.findUnique({ where: { id: "default" } }),
    prisma.homeSkillBar.findMany({ orderBy: { order: "asc" } }),
    prisma.homeSkillItem.findMany({ orderBy: { order: "asc" } }),
    prisma.homeCta.findUnique({ where: { id: "default" } }),
    prisma.homePostsSection.findUnique({ where: { id: "default" } }),
    prisma.homeProjectsSection.findUnique({ where: { id: "default" } }),
  ]);

  return jsonOk({
    heroSlides,
    featuresSection,
    features,
    skillsSection,
    skillBars,
    skillItems,
    cta,
    postsSection,
    projectsSection,
  });
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { section, data } = await request.json();

    switch (section) {
      case "heroSlide":
        if (data.id) {
          await prisma.homeHeroSlide.update({ where: { id: data.id }, data });
        } else {
          await prisma.homeHeroSlide.create({ data });
        }
        break;
      case "featuresSection":
        await prisma.homeFeaturesSection.upsert({
          where: { id: "default" },
          update: data,
          create: { id: "default", ...data },
        });
        break;
      case "skillsSection":
        await prisma.homeSkillsSection.upsert({
          where: { id: "default" },
          update: data,
          create: { id: "default", ...data },
        });
        break;
      case "postsSection":
        await prisma.homePostsSection.upsert({
          where: { id: "default" },
          update: data,
          create: { id: "default", ...data },
        });
        break;
      case "projectsSection":
        await prisma.homeProjectsSection.upsert({
          where: { id: "default" },
          update: data,
          create: { id: "default", ...data },
        });
        break;
      case "cta":
        await prisma.homeCta.upsert({
          where: { id: "default" },
          update: data,
          create: { id: "default", ...data },
        });
        break;
      case "feature":
        if (data.id) {
          await prisma.homeFeature.update({ where: { id: data.id }, data });
        } else {
          await prisma.homeFeature.create({ data });
        }
        break;
      case "skillBar":
        if (data.id) {
          await prisma.homeSkillBar.update({ where: { id: data.id }, data });
        } else {
          await prisma.homeSkillBar.create({ data });
        }
        break;
      case "skillItem":
        if (data.id) {
          await prisma.homeSkillItem.update({ where: { id: data.id }, data });
        } else {
          await prisma.homeSkillItem.create({ data });
        }
        break;
      default:
        return jsonError("Invalid section");
    }

    return jsonOk({ success: true });
  } catch (err) {
    console.error("[PUT /api/admin/home]", err);
    return jsonError("Update failed", 500);
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { section, id } = await request.json();
  if (!id) return jsonError("ID required");

  switch (section) {
    case "heroSlide":
      await prisma.homeHeroSlide.delete({ where: { id } });
      break;
    case "feature":
      await prisma.homeFeature.delete({ where: { id } });
      break;
    case "skillBar":
      await prisma.homeSkillBar.delete({ where: { id } });
      break;
    case "skillItem":
      await prisma.homeSkillItem.delete({ where: { id } });
      break;
    default:
      return jsonError("Invalid section");
  }

  return jsonOk({ success: true });
}
