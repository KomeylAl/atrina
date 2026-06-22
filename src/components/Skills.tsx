"use client";

import { motion } from "framer-motion";

const Skills = ({ skills }: { skills: any }) => {
  return (
    <div className="space-y-6">
      {skills.map((skill: any, index: number) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-slate-900 dark:text-white">
              {skill.name}
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
              {skill.level}%
            </span>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-1000"
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Skills;
