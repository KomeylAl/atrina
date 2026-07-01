import { notFound } from "next/navigation";
import Link from "next/link";
import { Lightbulb, Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BackArrow } from "@/components/icons/DirectionalIcon";
import { getWorkBySlug } from "@/lib/db/works";

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as "fa" | "en";
  const work = await getWorkBySlug(locale, slug);

  if (!work) notFound();

  const labels = {
    challenge: locale === "fa" ? "چالش" : "The Challenge",
    solution: locale === "fa" ? "راه‌حل" : "Our Solution",
    results: locale === "fa" ? "نتایج" : "Results",
  };

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950">
      <div className="bg-linear-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <Link href={`/${locale}/work`} className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 mb-8 hover:underline">
            <BackArrow />
            {locale === "fa" ? "بازگشت به نمونه‌کارها" : "Back to work"}
          </Link>
          <Badge className="mb-4">{work.category}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">{work.title}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl">{work.description}</p>
        </div>
      </div>

      {work.thumbnail && (
        <div className="max-w-5xl mx-auto px-6 -mt-6">
          <img src={work.thumbnail} alt={work.title} className="w-full rounded-2xl shadow-xl aspect-video object-cover" />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        {work.challenge && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950"><Lightbulb className="h-5 w-5 text-indigo-600" /></div>
              <h2 className="text-2xl font-bold">{labels.challenge}</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: work.challenge }} />
          </section>
        )}
        {work.solution && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-950"><Target className="h-5 w-5 text-cyan-600" /></div>
              <h2 className="text-2xl font-bold">{labels.solution}</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: work.solution }} />
          </section>
        )}
        {work.results && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950"><TrendingUp className="h-5 w-5 text-green-600" /></div>
              <h2 className="text-2xl font-bold">{labels.results}</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: work.results }} />
          </section>
        )}

        {work.galleryImages && work.galleryImages.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">{locale === "fa" ? "گالری" : "Gallery"}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {work.galleryImages.map((img, i) => (
                <img key={i} src={img} alt="" className="rounded-xl aspect-square object-cover" />
              ))}
            </div>
          </section>
        )}

        {work.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-8 border-t border-slate-200 dark:border-slate-800">
            {work.technologies.map((tech) => (
              <span key={tech} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">{tech}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
