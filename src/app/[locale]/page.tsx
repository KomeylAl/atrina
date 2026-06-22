import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Skills from "@/components/Skills";
import LineSliderSkills from "@/components/LineSliderSkills";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import { getHomePageData } from "@/lib/db/home";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as "fa" | "en";
  const data = await getHomePageData(locale);

  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="relative overflow-hidden bg-linear-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/20 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:mask-[linear-gradient(0deg,rgba(0,0,0,1),rgba(0,0,0,0.6))]" />
        <Hero content={data.hero} locale={locale} />
      </section>

      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {data.features.title}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {data.features.description}
            </p>
          </div>
          <Features features={data.features.items} />
        </div>
      </section>

      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                {data.skills.title}
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                {data.skills.description}
              </p>
              <Skills skills={data.skills.bars} />
            </div>
            <LineSliderSkills items={data.skills.items.map((i) => i.text)} />
          </div>
        </div>
      </section>

      <section className="py-24 bg-linear-to-br from-indigo-600 to-cyan-600 dark:from-indigo-700 dark:to-cyan-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {data.cta.title}
          </h2>
          <p className="text-xl text-indigo-100 mb-10">{data.cta.description}</p>
          <Link href={`/${locale}${data.cta.linkHref}`}>
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50 group"
            >
              {data.cta.linkText}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
