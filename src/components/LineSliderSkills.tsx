"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const LineSliderSkills = ({ items }: { items: String[] }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-start space-x-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CheckCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-300 text-lg">
              {item}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LineSliderSkills;
