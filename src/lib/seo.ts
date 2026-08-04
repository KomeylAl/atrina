import type { Metadata } from "next";
import type { Locale } from "@/lib/locale";

const DEFAULT_SITE_URL = "http://localhost:5000";
const SITE_NAME = "Atrina Dev";

export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    DEFAULT_SITE_URL;

  return new URL(raw);
}

export function absoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

export function normalizePath(path: string) {
  if (!path.startsWith("/")) return `/${path}`;
  return path;
}

export function localizedPath(locale: Locale, path = "/") {
  const normalized = normalizePath(path);
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function createAlternates(path: string) {
  return {
    canonical: localizedPath("fa", path), // overridden per-locale below
    languages: {
      fa: localizedPath("fa", path),
      en: localizedPath("en", path),
      "x-default": "/fa",
    },
  };
}

type SeoInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
};

export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
  type = "website",
  noIndex = false,
  alternates,
}: SeoInput): Metadata {
  const currentPath = localizedPath(locale, path);
  const imageUrl = image ? absoluteUrl(image) : undefined;
  const finalAlternates = alternates ?? {
    canonical: currentPath,
    languages: {
      fa: localizedPath("fa", path),
      en: localizedPath("en", path),
      "x-default": "/fa",
    },
  };

  return {
    metadataBase: getSiteUrl(),
    title,
    description,
    alternates: {
      canonical: finalAlternates.canonical ?? currentPath,
      languages: finalAlternates.languages,
    },
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
      },
    },
    openGraph: {
      type,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      url: currentPath,
      siteName: SITE_NAME,
      title,
      description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export function buildOrganizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(localizedPath(locale)),
  };
}

export function buildWebsiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(localizedPath(locale)),
    inLanguage: locale,
  };
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function buildBreadcrumbJsonLd(
  locale: Locale,
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}
