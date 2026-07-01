import Link from "next/link";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ForwardArrow } from "@/components/icons/DirectionalIcon";
import { formatDate, type AppLocale } from "@/lib/format-locale";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  publishedAt: string | null;
}

export default function HomeLatestPosts({
  title,
  description,
  posts,
  locale,
}: {
  title: string;
  description: string;
  posts: Post[];
  locale: AppLocale;
}) {
  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
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
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            {locale === "fa" ? "مشاهده همه" : "View all"}
            <ForwardArrow />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300"
            >
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-indigo-100 to-cyan-100 dark:from-slate-700 dark:to-slate-600" />
                )}
              </div>
              <div className="p-6">
                <Badge className="mb-3">{post.category}</Badge>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                {post.publishedAt && (
                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar className="h-3 w-3 me-1" />
                    {formatDate(post.publishedAt, locale)}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
