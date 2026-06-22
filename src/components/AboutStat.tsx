"use client";

import { motion } from "framer-motion";

interface AboutStatProps {
  stat: any;
  index: number;
}

const AboutStat = ({ stat, index }: AboutStatProps) => {
  return (
    <motion.div
      key={index}
      className="text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="text-4xl md:text-5xl font-bold bg-linear-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
        {stat.value}
      </div>
      <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
    </motion.div>
  );
};

export default AboutStat;
