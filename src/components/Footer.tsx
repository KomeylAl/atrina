import Link from "next/link";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  type LucideIcon,
  MessageCircle,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import {
  getSiteSettings,
  getFooterNavLinks,
  getFooterContactInfo,
} from "@/lib/db/site";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  github: Github,
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  telegram: Send,
  whatsapp: MessageCircle,
};

const Footer = async ({ lang }: { lang: "fa" | "en" }) => {
  const [settings, footerNavLinks, footerContact] = await Promise.all([
    getSiteSettings(lang),
    getFooterNavLinks(lang),
    getFooterContactInfo(),
  ]);

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

            {settings.socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-6">
                {settings.socialLinks.map((social) => {
                  const Icon = SOCIAL_ICONS[social.platform.toLowerCase()] ?? Github;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-slate-600 dark:text-slate-400"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {settings.footerLinksTitle}
            </h3>
            <ul className="space-y-2">
              {footerNavLinks.map((link: { path: string; name: string }) => (
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
              {settings.footerContactTitle}
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              {footerContact.map((value: string, index: number) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </div>
        </div>

        {(settings.trustBadges.length > 0 || settings.footerCopyright) && (
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            {settings.trustBadges.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-4">
                {settings.trustBadges.map((badge) => {
                  const image = (
                    <img
                      src={badge.image}
                      alt={badge.alt || "trust badge"}
                      className="h-16 w-auto object-contain"
                    />
                  );
                  return badge.link ? (
                    <a
                      key={badge.id}
                      href={badge.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-90 hover:opacity-100 transition-opacity"
                    >
                      {image}
                    </a>
                  ) : (
                    <div key={badge.id}>{image}</div>
                  );
                })}
              </div>
            )}
            <p className="text-center text-slate-600 dark:text-slate-400 md:ms-auto">
              {settings.footerCopyright}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
