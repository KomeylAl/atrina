import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ForwardArrow } from "@/components/icons/DirectionalIcon";
import type { AppLocale } from "@/lib/format-locale";

interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
}

export default function HomeFeaturedProjects({
  title,
  description,
  projects,
  locale,
}: {
  title: string;
  description: string;
  projects: Project[];
  locale: AppLocale;
}) {
  if (projects.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              {title}
            </h2>
            {description && (
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                {description}
              </p>
            )}
          </div>
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            {locale === "fa" ? "مشاهده همه" : "View all"}
            <ForwardArrow />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/${locale}/projects/${project.slug}`}
              className={`group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 ${
                index === 0 ? "md:col-span-2 md:row-span-1" : ""
              }`}
            >
              <div className={`relative overflow-hidden ${index === 0 ? "aspect-21/9" : "aspect-4/3"}`}>
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-indigo-600 to-cyan-600" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge className="mb-3 bg-white/20 text-white border-0 backdrop-blur-sm">
                    {project.category}
                  </Badge>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {project.name}
                  </h3>
                  <p className="text-white/80 text-sm line-clamp-2">{project.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
