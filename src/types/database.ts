import type { Locale } from "@/lib/locale";

export interface LocalizedNavLink {
  name: string;
  path: string;
}

export interface HomePageData {
  heroSlides: Array<{
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
  }>;
  features: {
    title: string;
    description: string;
    items: Array<{
      id: string;
      icon: string;
      title: string;
      description: string;
    }>;
  };
  skills: {
    title: string;
    description: string;
    bars: Array<{ id: string; name: string; level: number }>;
    items: Array<{ id: string; text: string }>;
  };
  cta: {
    title: string;
    description: string;
    linkText: string;
    linkHref: string;
  };
  latestPosts: {
    title: string;
    description: string;
    items: Array<{
      id: string;
      slug: string;
      title: string;
      excerpt: string;
      thumbnail: string;
      category: string;
      publishedAt: string | null;
    }>;
  };
  featuredProjects: {
    title: string;
    description: string;
    items: Array<{
      id: string;
      slug: string;
      name: string;
      description: string;
      thumbnail: string;
      category: string;
    }>;
  };
}

export interface BlogPostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  categoryKey: string;
  author: string;
  readTime: number | null;
  publishedAt: string | null;
  tags: string[];
}

export interface ProjectListItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  thumbnail: string | null;
  category: string;
  categoryKey: string;
  client: string | null;
  technologies: string[];
  completionDate: string | null;
}

export interface WorkListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  category: string;
  categoryKey: string;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  technologies: string[];
}

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  linkedin: string | null;
  twitter: string | null;
  github: string | null;
}

export interface ContactMethodItem {
  id: string;
  type: string;
  label: string;
  value: string;
  link: string;
  colorFrom: string;
  colorTo: string;
}

export interface PageMetaItem {
  title: string;
  description: string;
}

export interface SiteSettingsData {
  logo: string;
  footerDescription: string;
  footerCopyright: string;
  careersEmail: string;
  navLinks: LocalizedNavLink[];
}

export type { Locale };
