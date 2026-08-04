import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, localizedPath } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects, works] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED", noIndex: false },
      select: { faSlug: true, enSlug: true, updatedAt: true },
    }),
    prisma.project.findMany({
      where: { isPublished: true, noIndex: false },
      select: { faSlug: true, enSlug: true, updatedAt: true },
    }),
    prisma.work.findMany({
      where: { isPublished: true, noIndex: false },
      select: { faSlug: true, enSlug: true, updatedAt: true },
    }),
  ]);

  const staticPages = ["/", "/about", "/contact", "/blog", "/projects", "/work"];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: absoluteUrl(localizedPath("fa", path)),
    lastModified: new Date(),
    alternates: {
      languages: {
        fa: absoluteUrl(localizedPath("fa", path)),
        en: absoluteUrl(localizedPath("en", path)),
      },
    },
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(localizedPath("fa", `/blog/${post.faSlug}`)),
    lastModified: post.updatedAt,
    alternates: {
      languages: {
        fa: absoluteUrl(localizedPath("fa", `/blog/${post.faSlug}`)),
        en: absoluteUrl(localizedPath("en", `/blog/${post.enSlug}`)),
      },
    },
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(localizedPath("fa", `/projects/${project.faSlug}`)),
    lastModified: project.updatedAt,
    alternates: {
      languages: {
        fa: absoluteUrl(localizedPath("fa", `/projects/${project.faSlug}`)),
        en: absoluteUrl(localizedPath("en", `/projects/${project.enSlug}`)),
      },
    },
  }));

  const workEntries: MetadataRoute.Sitemap = works.map((work) => ({
    url: absoluteUrl(localizedPath("fa", `/work/${work.faSlug}`)),
    lastModified: work.updatedAt,
    alternates: {
      languages: {
        fa: absoluteUrl(localizedPath("fa", `/work/${work.faSlug}`)),
        en: absoluteUrl(localizedPath("en", `/work/${work.enSlug}`)),
      },
    },
  }));

  return [
    ...staticEntries,
    ...postEntries,
    ...projectEntries,
    ...workEntries,
  ];
}
