"use client";

import { motion } from "framer-motion";

interface AboutValueProps {
  value: any;
  index: number;
}

const AboutValue = ({ value, index }: AboutValueProps) => {
  return (
    <motion.div
      key={index}
      className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        {value.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400">{value.description}</p>
    </motion.div>
  );
};

export default AboutValue;
