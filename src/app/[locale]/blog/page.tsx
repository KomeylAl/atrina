import BlogFilters from "@/components/BlogFilters";
import BlogList from "@/components/BlogList";
import BlogSearch from "@/components/BlogSearch";
import {
  getBlogPosts,
  getBlogCategories,
  getBlogPageMeta,
} from "@/lib/db/blog";

export default async function Blog({
  searchParams,
  params,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as "fa" | "en";
  const { category, q: searchQuery } = (await searchParams) || {};

  const [meta, categories, posts] = await Promise.all([
    getBlogPageMeta(locale),
    getBlogCategories(locale),
    getBlogPosts(locale, { category, search: searchQuery }),
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section className="bg-linear-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            {meta.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mb-8">
            {meta.description}
          </p>
          <div className="max-w-md">
            <BlogSearch locale={locale} />
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-slate-200 dark:border-slate-800 sticky top-[73px] z-40 backdrop-blur-lg bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6">
          <BlogFilters categories={categories} lang={locale} />
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-slate-600 dark:text-slate-400">
                {locale === "fa"
                  ? "هیچ پستی پیدا نشد. فیلترها را تغییر دهید."
                  : "No blog posts found. Try adjusting your filters."}
              </p>
            </div>
          ) : (
            <BlogList posts={posts} locale={locale} />
          )}
        </div>
      </section>
    </div>
  );
}
