import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BackArrow } from "@/components/icons/DirectionalIcon";
import { getBlogPostBySlug } from "@/lib/db/blog";
import {
  formatDate,
  formatReadTimeShort,
  type AppLocale,
} from "@/lib/format-locale";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as AppLocale;
  const post = await getBlogPostBySlug(locale, slug);

  if (!post) notFound();

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950">
      <div className="bg-linear-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 mb-8 hover:underline">
            <BackArrow />
            {locale === "fa" ? "بازگشت به بلاگ" : "Back to blog"}
          </Link>
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><User className="h-4 w-4" />{post.author}</span>
            {post.publishedAt && (
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(post.publishedAt, locale)}</span>
            )}
            {post.readTime && (
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{formatReadTimeShort(post.readTime, locale)}</span>
            )}
          </div>
        </div>
      </div>

      {post.thumbnail && (
        <div className="max-w-5xl mx-auto px-6 -mt-4">
          <img src={post.thumbnail} alt={post.title} className="w-full rounded-2xl shadow-xl aspect-video object-cover" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed border-s-4 border-indigo-500 ps-4">
          {post.excerpt}
        </p>
        <div
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
