"use client";

import { Lightbulb, Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import type { WorkListItem } from "@/types/database";

const categoryColors: Record<string, string> = {
  ui_ux: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  development: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  consulting: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  devops: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  data_science: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
};

interface WorkListProps {
  works: WorkListItem[];
  labels: { challenge: string; solution: string; results: string };
  locale: string;
}

export default function WorkList({ works, labels, locale }: WorkListProps) {
  return (
    <div className="space-y-16">
      {works.map((work, index) => (
        <motion.div
          key={work.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
        >
          <Link
            href={`/${locale}/work/${work.slug}`}
            className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-2xl transition-all duration-500 block"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div
                className={`relative aspect-4/3 lg:aspect-auto bg-slate-100 dark:bg-slate-800 overflow-hidden ${
                  index % 2 === 0 ? "lg:order-1" : "lg:order-2"
                }`}
              >
                {work.thumbnail ? (
                  <img
                    src={work.thumbnail}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Target className="h-20 w-20 text-slate-300 dark:text-slate-700" />
                  </div>
                )}
              </div>

              <div
                className={`p-8 lg:p-12 flex flex-col justify-center ${
                  index % 2 === 0 ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <div className="mb-6">
                  <Badge
                    className={
                      categoryColors[work.categoryKey] ||
                      "bg-slate-100 text-slate-700"
                    }
                  >
                    {work.category}
                  </Badge>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  {work.title}
                </h2>

                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  {work.description}
                </p>

                {work.challenge && (
                  <div className="mb-6">
                    <div className="flex items-start space-x-3 mb-2">
                      <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {labels.challenge}
                      </h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 ml-8">
                      {work.challenge}
                    </p>
                  </div>
                )}

                {work.solution && (
                  <div className="mb-6">
                    <div className="flex items-start space-x-3 mb-2">
                      <Target className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {labels.solution}
                      </h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 ml-8">
                      {work.solution}
                    </p>
                  </div>
                )}

                {work.results && (
                  <div className="mb-8">
                    <div className="flex items-start space-x-3 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {labels.results}
                      </h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 ml-8">
                      {work.results}
                    </p>
                  </div>
                )}

                {work.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {work.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
