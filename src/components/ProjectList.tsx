"use client";

import { Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ProjectListItem } from "@/types/database";
import { formatMonthYear, type AppLocale } from "@/lib/format-locale";

const categoryColors: Record<string, string> = {
  web: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  mobile: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  desktop: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  ai_ml: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  blockchain: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  cloud: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
};

interface ProjectListProps {
  projects: ProjectListItem[];
  locale: AppLocale;
}

export default function ProjectList({ projects, locale }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -8 }}
        >
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-xl transition-all duration-300 block"
          >
            <div className="relative aspect-4/3 bg-slate-100 dark:bg-slate-800 overflow-hidden">
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ExternalLink className="h-12 w-12 text-slate-300 dark:text-slate-700" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge
                  className={
                    categoryColors[project.categoryKey] ||
                    "bg-slate-100 text-slate-700"
                  }
                >
                  {project.category}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {project.name}
              </h3>

              {project.client && (
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-3">
                  Client: {project.client}
                </p>
              )}

              <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {project.description}
              </p>

              {project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              )}

              {project.completionDate && (
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-500">
                  <Calendar className="h-4 w-4 me-2" />
                  {formatMonthYear(project.completionDate, locale)}
                </div>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
