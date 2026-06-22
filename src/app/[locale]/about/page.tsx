import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import AboutStat from "@/components/AboutStat";
import AboutValue from "@/components/AboutValue";
import AboutMember from "@/components/AboutMember";
import { getAboutPageData, getAboutPageMeta } from "@/lib/db/about";

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as "fa" | "en";

  const [meta, data] = await Promise.all([
    getAboutPageMeta(locale),
    getAboutPageData(locale),
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section className="bg-linear-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            {meta.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl">
            {meta.description}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {data.stats.map((stat, index) => (
              <AboutStat key={stat.id} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            {data.story.title}
          </h2>
          <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {data.story.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">
            {data.valuesSectionTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.values.map((value, index) => (
              <AboutValue key={value.id} value={value} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 text-center">
            {data.team.title}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 text-center mb-12 max-w-3xl mx-auto">
            {data.team.subtitle}
          </p>

          {data.team.members.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-slate-600 dark:text-slate-400">
                {locale === "fa"
                  ? "اعضای تیم به‌زودی اضافه می‌شوند."
                  : "Team members will be added soon."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.team.members.map((member, index) => (
                <AboutMember key={member.id} member={member} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-linear-to-br from-indigo-600 to-cyan-600 dark:from-indigo-700 dark:to-cyan-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {data.cta.title}
          </h2>
          <p className="text-xl text-indigo-100 mb-8">{data.cta.description}</p>
          <a href={`mailto:${data.cta.email}`}>
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              <Mail className="mr-2 h-5 w-5" />
              {data.cta.emailLabel}
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
