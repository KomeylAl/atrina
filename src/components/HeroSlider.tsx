"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { resolveMediaUrl } from "@/lib/uploads";
import { ForwardArrow, ChevronPrev, ChevronNext } from "@/components/icons/DirectionalIcon";
import type { AppLocale } from "@/lib/format-locale";

interface HeroSlide {
  id: string;
  image: string | null;
  badge: string;
  titleTop: string;
  titleBottom: string;
  description: string;
  linkOneText: string;
  linkTwoText: string;
  linkOneHref: string;
  linkTwoHref: string;
}

export default function HeroSlider({
  slides,
  locale,
}: {
  slides: HeroSlide[];
  locale: AppLocale;
}) {
  const [index, setIndex] = useState(0);
  const isRtl = locale === "fa";
  const current = slides[index] ?? slides[0];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [slides.length, next]);

  if (!current) return null;

  const imageUrl = current.image ? resolveMediaUrl(current.image) : null;

  return (
    <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + "-content"}
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? -30 : 30 }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>{current.badge}</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
              {current.titleTop}{" "}
              <span className="bg-linear-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {current.titleBottom}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-xl">
              {current.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/${locale}${current.linkOneHref}`}>
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white group w-full sm:w-auto">
                  {current.linkOneText}
                  <ForwardArrow className="ms-2" />
                </Button>
              </Link>
              <Link href={`/${locale}${current.linkTwoHref}`}>
                <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-700 w-full sm:w-auto">
                  {current.linkTwoText}
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + "-image"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center">
                  <div className="text-white/20 text-9xl font-black">A</div>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-2xl bg-indigo-600/20 blur-2xl" />
            <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-cyan-500/20 blur-2xl" />
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronPrev />
          </button>
          <div className="flex gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-indigo-600" : "w-2 bg-slate-300 dark:bg-slate-600"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Next slide"
          >
            <ChevronNext />
          </button>
        </div>
      )}
    </div>
  );
}
