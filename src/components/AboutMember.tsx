"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import type { TeamMemberItem } from "@/types/database";

interface AboutMemberProps {
  member: TeamMemberItem;
  index: number;
}

const AboutMember = ({ member, index }: AboutMemberProps) => {
  return (
    <motion.div
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <div className="relative aspect-square bg-slate-100 dark:bg-slate-700 overflow-hidden">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white text-4xl font-bold">
                {member.name?.charAt(0)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          {member.name}
        </h3>
        <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">
          {member.role}
        </p>

        {member.bio && (
          <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
            {member.bio}
          </p>
        )}

        <div className="flex items-center space-x-2">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Linkedin className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </a>
          )}
          {member.twitter && (
            <a
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Twitter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Github className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AboutMember;
