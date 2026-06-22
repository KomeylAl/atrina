"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface HeroContent {
  badge: string;
  titleTop: string;
  titleBottom: string;
  description: string;
  linkOneText: string;
  linkTwoText: string;
  linkOneHref: string;
  linkTwoHref: string;
}

const Hero = ({
  content,
  locale,
}: {
  content: HeroContent;
  locale: string;
}) => {
  return (
    <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
      <motion.div
        className="max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="h-4 w-4" />
          <span>{content.badge}</span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {content.titleTop}{" "}
          <span className="bg-linear-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {content.titleBottom}
          </span>
        </motion.h1>

        <motion.p
          className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {content.description}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href={`/${locale}${content.linkOneHref}`}>
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white group"
            >
              {content.linkOneText}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href={`/${locale}${content.linkTwoHref}`}>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 dark:border-slate-700"
            >
              {content.linkTwoText}
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
