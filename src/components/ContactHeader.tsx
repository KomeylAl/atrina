"use client";

import { motion } from "framer-motion";

interface ContactHeaderProps {
  title: string;
  description: string;
}

const ContactHeader = ({ title, description }: ContactHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
        {title}
      </h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl">
        {description}
      </p>
    </motion.div>
  );
};

export default ContactHeader;
