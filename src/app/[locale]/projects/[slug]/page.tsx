import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BackArrow } from "@/components/icons/DirectionalIcon";
import { getProjectBySlug } from "@/lib/db/projects";
import { formatMonthYear, type AppLocale } from "@/lib/format-locale";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as AppLocale;
  const project = await getProjectBySlug(locale, slug);

  if (!project) notFound();

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950">
      <div className="relative">
        {project.thumbnail ? (
          <div className="h-64 md:h-96 overflow-hidden">
            <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div className="h-48 bg-linear-to-br from-indigo-600 to-cyan-600" />
        )}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-5xl mx-auto px-6 pb-8">
            <Badge className="mb-3 bg-white/20 text-white border-0">{project.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white">{project.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link href={`/${locale}/projects`} className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 mb-8 hover:underline">
          <BackArrow />
          {locale === "fa" ? "بازگشت به پروژه‌ها" : "Back to projects"}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: project.description }} />
          </div>
          <aside className="space-y-6">
            {project.client && (
              <div className="rounded-xl border p-6 dark:border-slate-800">
                <h3 className="font-semibold mb-2">{locale === "fa" ? "کلاینت" : "Client"}</h3>
                <p className="text-slate-600 dark:text-slate-400">{project.client}</p>
              </div>
            )}
            {project.completionDate && (
              <div className="rounded-xl border p-6 dark:border-slate-800">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Calendar className="h-4 w-4" />{locale === "fa" ? "تاریخ تکمیل" : "Completed"}</h3>
                <p className="text-slate-600 dark:text-slate-400">{formatMonthYear(project.completionDate, locale)}</p>
              </div>
            )}
            {project.technologies.length > 0 && (
              <div className="rounded-xl border p-6 dark:border-slate-800">
                <h3 className="font-semibold mb-3">{locale === "fa" ? "تکنولوژی‌ها" : "Technologies"}</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-sm">{tech}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </article>
  );
}
