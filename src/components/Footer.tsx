import Link from "next/link";
import {
  getSiteSettings,
  getFooterNavLinks,
  getFooterContactInfo,
} from "@/lib/db/site";

const Footer = async ({ lang }: { lang: "fa" | "en" }) => {
  const [settings, footerNavLinks, footerContact] = await Promise.all([
    getSiteSettings(lang),
    getFooterNavLinks(lang),
    getFooterContactInfo(),
  ]);

  const linksTitle = lang === "fa" ? "لینک‌های سریع" : "Quick Links";
  const contactTitle = lang === "fa" ? "تماس" : "Contact";

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {settings.logo}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
              {settings.footerDescription}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {linksTitle}
            </h3>
            <ul className="space-y-2">
              {footerNavLinks.map((link: { path: string, name: string }) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {contactTitle}
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              {footerContact.map((value: string, index: number) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-600 dark:text-slate-400">
          <p>{settings.footerCopyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
