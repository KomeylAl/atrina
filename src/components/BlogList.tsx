"use client";

import { format } from "date-fns";
import { Calendar, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import type { BlogPostListItem } from "@/types/database";

const categoryColors: Record<string, string> = {
  web_development: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  mobile_development: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  ai_ml: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  devops: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  cloud: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  security: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  best_practices: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
};

interface BlogListProps {
  posts: BlogPostListItem[];
  locale: string;
}

export default function BlogList({ posts, locale }: BlogListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -8 }}
        >
          <Link
            href={`/${locale}/blog/${post.slug}`}
            className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-xl transition-all duration-300 block"
          >
            <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-100 to-cyan-100 dark:from-slate-700 dark:to-slate-600" />
              )}
            </div>

            <div className="p-6">
              {post.categoryKey && (
                <Badge
                  className={`${
                    categoryColors[post.categoryKey] ||
                    "bg-slate-100 text-slate-700"
                  } mb-3`}
                >
                  {post.category}
                </Badge>
              )}

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-500 mb-4">
                {post.author && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                )}
                {post.readTime && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime} min read</span>
                  </div>
                )}
              </div>

              {post.publishedAt && (
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-500 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                </div>
              )}

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
