import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [
    posts,
    projects,
    works,
    submissions,
    teamMembers,
    mediaCount,
    unreadSubmissions,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.project.count(),
    prisma.work.count(),
    prisma.contactSubmission.count(),
    prisma.teamMember.count({ where: { isActive: true } }),
    prisma.media.count(),
    prisma.contactSubmission.count({ where: { isRead: false } }),
  ]);

  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    select: { id: true, faTitle: true, enTitle: true, status: true, updatedAt: true },
  });

  const recentSubmissions = await prisma.contactSubmission.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, subject: true, isRead: true, createdAt: true },
  });

  return jsonOk({
    stats: {
      posts,
      projects,
      works,
      submissions,
      teamMembers,
      mediaCount,
      unreadSubmissions,
    },
    recentPosts,
    recentSubmissions,
  });
}
