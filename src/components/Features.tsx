"use client";

import { motion } from "framer-motion";
import { Code, Zap, Shield, Users } from "lucide-react";

const Features = ({ features }: { features: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {features.map((feature: any, index: number) => (
        <motion.div
          key={index}
          className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="h-14 w-14 rounded-xl bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            {feature.icon === "Code" ? (
              <Code className="h-7 w-7 text-white" />
            ) : feature.icon === "Zap" ? (
              <Zap className="h-7 w-7 text-white" />
            ) : feature.icon === "Shield" ? (
              <Shield className="h-7 w-7 text-white" />
            ) : (
              <Users className="h-7 w-7 text-white" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {feature.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default Features;
