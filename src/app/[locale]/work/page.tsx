import WorkFilters from "@/components/WorkFilters";
import WorkList from "@/components/WorkList";
import { getWorks, getWorkCategories, getWorkPageMeta } from "@/lib/db/works";

export default async function Work({
  searchParams,
  params,
}: {
  searchParams: Promise<{ category?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as "fa" | "en";
  const { category } = (await searchParams) || {};
  const selectedCategory = category ?? "all";

  const [meta, categories, works] = await Promise.all([
    getWorkPageMeta(locale),
    getWorkCategories(locale),
    getWorks(locale, selectedCategory),
  ]);

  const workLabels = {
    challenge: locale === "fa" ? "چالش" : "The Challenge",
    solution: locale === "fa" ? "راه‌حل ما" : "Our Solution",
    results: locale === "fa" ? "نتایج" : "Results",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section className="bg-linear-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            {meta.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl">
            {meta.description}
          </p>
        </div>
      </section>

      <section className="py-8 border-b border-slate-200 dark:border-slate-800 sticky top-[73px] z-40 backdrop-blur-lg bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6">
          <WorkFilters categories={categories} lang={locale} />
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          {works.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-slate-600 dark:text-slate-400">
                {locale === "fa"
                  ? "هیچ نمونه‌کاری در این دسته‌بندی پیدا نشد."
                  : "No case studies found in this category yet."}
              </p>
            </div>
          ) : (
            <WorkList works={works} labels={workLabels} locale={locale} />
          )}
        </div>
      </section>
    </div>
  );
}
