import "dotenv/config";
import {
  PrismaClient,
  PostStatus,
  ContactMethodType,
  ProjectStatus,
} from "@prisma/client";
import en from "../src/locales/en.json";
import fa from "../src/locales/fa.json";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tags.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.project.deleteMany();
  await prisma.projectCategory.deleteMany();
  await prisma.work.deleteMany();
  await prisma.workCategory.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.contactMethod.deleteMany();
  await prisma.aboutStat.deleteMany();
  await prisma.aboutValue.deleteMany();
  await prisma.homeFeature.deleteMany();
  await prisma.homeSkillBar.deleteMany();
  await prisma.homeSkillItem.deleteMany();
  await prisma.homeHeroSlide.deleteMany();
  await prisma.navLink.deleteMany();
  await prisma.media.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      displayName: "تیم آترینا",
      email: "admin@atrina.com",
      password: await hashPassword("changeme"),
      role: "ADMIN",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      faFooterDescription: fa.footer.footerDescription,
      enFooterDescription: en.footer.footerDescription,
      faFooterCopyright: fa.footer.footerCopyRight,
      enFooterCopyright: en.footer.footerCopyRight,
      careersEmail: "careers@atrina.com",
    },
  });

  const navPaths = [
    { path: "/", fa: "خانه", en: "Home" },
    { path: "/projects", fa: "پروژه‌ها", en: "Projects" },
    { path: "/work", fa: "نمونه‌کارها", en: "Work" },
    { path: "/blog", fa: "بلاگ", en: "Blog" },
    { path: "/about", fa: "درباره", en: "About" },
    { path: "/contact", fa: "تماس", en: "Contact" },
  ];

  for (const [index, link] of navPaths.entries()) {
    await prisma.navLink.create({
      data: {
        faName: link.fa,
        enName: link.en,
        path: link.path,
        order: index,
      },
    });
  }

  await prisma.homeHero.upsert({
    where: { id: "default" },
    update: {},
    create: {
      faBadge: fa.mainContent.hreo.heroBadge,
      enBadge: en.mainContent.hreo.heroBadge,
      faTitleTop: fa.mainContent.hreo.hreoMainTextTop,
      enTitleTop: en.mainContent.hreo.hreoMainTextTop,
      faTitleBottom: fa.mainContent.hreo.heroMainTextBottom,
      enTitleBottom: en.mainContent.hreo.heroMainTextBottom,
      faDescription: fa.mainContent.hreo.heroDescription,
      enDescription: en.mainContent.hreo.heroDescription,
      faLinkOneText: fa.mainContent.hreo.heroLinkOne,
      enLinkOneText: en.mainContent.hreo.heroLinkOne,
      faLinkTwoText: fa.mainContent.hreo.heroLinkTow,
      enLinkTwoText: en.mainContent.hreo.heroLinkTow,
    },
  });

  await prisma.homeHeroSlide.create({
    data: {
      faBadge: fa.mainContent.hreo.heroBadge,
      enBadge: en.mainContent.hreo.heroBadge,
      faTitleTop: fa.mainContent.hreo.hreoMainTextTop,
      enTitleTop: en.mainContent.hreo.hreoMainTextTop,
      faTitleBottom: fa.mainContent.hreo.heroMainTextBottom,
      enTitleBottom: en.mainContent.hreo.heroMainTextBottom,
      faDescription: fa.mainContent.hreo.heroDescription,
      enDescription: en.mainContent.hreo.heroDescription,
      faLinkOneText: fa.mainContent.hreo.heroLinkOne,
      enLinkOneText: en.mainContent.hreo.heroLinkOne,
      faLinkTwoText: fa.mainContent.hreo.heroLinkTow,
      enLinkTwoText: en.mainContent.hreo.heroLinkTow,
      order: 0,
      isActive: true,
    },
  });

  await prisma.homePostsSection.upsert({
    where: { id: "default" },
    update: {},
    create: {
      faTitle: "آخرین مقالات",
      enTitle: "Latest Articles",
      faDescription: "تازه‌ترین مطالب و بینش‌های فنی تیم ما",
      enDescription: "Fresh insights and technical articles from our team",
    },
  });

  await prisma.homeProjectsSection.upsert({
    where: { id: "default" },
    update: {},
    create: {
      faTitle: "پروژه‌های برجسته",
      enTitle: "Featured Projects",
      faDescription: "نمونه‌کارهای منتخب از پورتفولیوی ما",
      enDescription: "Selected highlights from our portfolio",
    },
  });

  await prisma.homeFeaturesSection.upsert({
    where: { id: "default" },
    update: {},
    create: {
      faTitle: fa.mainContent.features.featuresTitle,
      enTitle: en.mainContent.features.featuresTitle,
      faDescription: fa.mainContent.features.featuresDescription,
      enDescription: en.mainContent.features.featuresDescription,
    },
  });

  for (const [index, feature] of en.mainContent.features.featuresData.entries()) {
    const faFeature = fa.mainContent.features.featuresData[index];
    await prisma.homeFeature.create({
      data: {
        icon: feature.icon,
        faTitle: faFeature.title,
        enTitle: feature.title,
        faDescription: faFeature.description,
        enDescription: feature.description,
        order: index,
      },
    });
  }

  await prisma.homeSkillsSection.upsert({
    where: { id: "default" },
    update: {},
    create: {
      faTitle: fa.mainContent.skills.skillsTitle,
      enTitle: en.mainContent.skills.skillsTitle,
      faDescription: fa.mainContent.skills.skillsDescription,
      enDescription: en.mainContent.skills.skillsDescription,
    },
  });

  for (const [index, skill] of en.mainContent.skills.skillsBarChart.entries()) {
    const faSkill = fa.mainContent.skills.skillsBarChart[index];
    await prisma.homeSkillBar.create({
      data: {
        faName: faSkill.name,
        enName: skill.name,
        level: skill.level,
        order: index,
      },
    });
  }

  for (const [index, item] of en.mainContent.skills.skillsItems.entries()) {
    await prisma.homeSkillItem.create({
      data: {
        faText: fa.mainContent.skills.skillsItems[index],
        enText: item,
        order: index,
      },
    });
  }

  await prisma.homeCta.upsert({
    where: { id: "default" },
    update: {},
    create: {
      faTitle: fa.mainContent.CTA.CTATitle,
      enTitle: en.mainContent.CTA.CTATitle,
      faDescription: fa.mainContent.CTA.CTADescription,
      enDescription: en.mainContent.CTA.CTADescription,
      faLinkText: fa.mainContent.CTA.CTALink,
      enLinkText: en.mainContent.CTA.CTALink,
      linkHref: "/contact",
    },
  });

  const pageMetas = [
    { id: "projects", fa: fa.projects, en: en.projects },
    { id: "work", fa: fa.work, en: en.work },
    { id: "blog", fa: fa.blog, en: en.blog },
    { id: "about", fa: fa.about, en: en.about },
    { id: "contact", fa: fa.contact, en: en.contact },
  ] as const;

  for (const meta of pageMetas) {
    await prisma.pageMeta.upsert({
      where: { id: meta.id },
      update: {},
      create: {
        id: meta.id,
        faTitle: meta.fa.pageTitle,
        enTitle: meta.en.pageTitle,
        faDescription: meta.fa.pageDescription,
        enDescription: meta.en.pageDescription,
      },
    });
  }

  await prisma.aboutStory.upsert({
    where: { id: "default" },
    update: {},
    create: {
      faTitle: fa.about.story.title,
      enTitle: en.about.story.title,
      faParagraph1: fa.about.story.paragraph1,
      enParagraph1: en.about.story.paragraph1,
      faParagraph2: fa.about.story.paragraph2,
      enParagraph2: en.about.story.paragraph2,
      faParagraph3: fa.about.story.paragraph3,
      enParagraph3: en.about.story.paragraph3,
    },
  });

  for (const [index, stat] of en.about.stats.entries()) {
    const faStat = fa.about.stats[index];
    await prisma.aboutStat.create({
      data: {
        value: stat.value,
        faLabel: faStat.label,
        enLabel: stat.label,
        order: index,
      },
    });
  }

  for (const [index, value] of en.about.values.entries()) {
    const faValue = fa.about.values[index];
    await prisma.aboutValue.create({
      data: {
        faTitle: faValue.title,
        enTitle: value.title,
        faDescription: faValue.description,
        enDescription: value.description,
        order: index,
      },
    });
  }

  await prisma.aboutTeamSection.upsert({
    where: { id: "default" },
    update: {},
    create: {
      faTitle: fa.about.team.title,
      enTitle: en.about.team.title,
      faSubtitle: fa.about.team.subtitle,
      enSubtitle: en.about.team.subtitle,
    },
  });

  await prisma.aboutCta.upsert({
    where: { id: "default" },
    update: {},
    create: {
      faTitle: fa.about.cta.title,
      enTitle: en.about.cta.title,
      faDescription: fa.about.cta.description,
      enDescription: en.about.cta.description,
      faEmailLabel: fa.about.cta.email,
      enEmailLabel: en.about.cta.email,
    },
  });

  const teamMembers = [
    {
      name: "Ali Rezaei",
      faRole: "مدیر فنی",
      enRole: "CTO",
      faBio: "بیش از ۱۰ سال تجربه در توسعه نرم‌افزار و معماری سیستم.",
      enBio: "10+ years of experience in software development and system architecture.",
    },
    {
      name: "Sara Mohammadi",
      faRole: "طراح UI/UX",
      enRole: "UI/UX Designer",
      faBio: "متخصص طراحی تجربه کاربری با تمرکز بر محصولات B2B.",
      enBio: "UX specialist focused on B2B product design.",
    },
    {
      name: "Reza Karimi",
      faRole: "توسعه‌دهنده ارشد",
      enRole: "Senior Developer",
      faBio: "متخصص React، Next.js و Node.js.",
      enBio: "Expert in React, Next.js, and Node.js.",
    },
  ];

  for (const [index, member] of teamMembers.entries()) {
    await prisma.teamMember.create({
      data: { ...member, order: index },
    });
  }

  const contactMethods = [
    {
      type: ContactMethodType.EMAIL,
      faLabel: fa.contact.email,
      enLabel: en.contact.email,
      value: "contact@atrina.com",
      link: "mailto:contact@atrina.com",
      colorFrom: "from-blue-500",
      colorTo: "to-cyan-500",
      order: 0,
    },
    {
      type: ContactMethodType.PHONE,
      faLabel: fa.contact.phone,
      enLabel: en.contact.phone,
      value: "+1 (555) 123-4567",
      link: "tel:+15551234567",
      colorFrom: "from-green-500",
      colorTo: "to-emerald-500",
      order: 1,
    },
    {
      type: ContactMethodType.WHATSAPP,
      faLabel: fa.contact.whatsapp,
      enLabel: en.contact.whatsapp,
      value: "+1 (555) 123-4567",
      link: "https://wa.me/15551234567",
      colorFrom: "from-green-400",
      colorTo: "to-green-600",
      order: 2,
    },
    {
      type: ContactMethodType.TELEGRAM,
      faLabel: fa.contact.telegram,
      enLabel: en.contact.telegram,
      value: "@atrina_support",
      link: "https://t.me/atrina_support",
      colorFrom: "from-blue-400",
      colorTo: "to-blue-600",
      order: 3,
    },
  ];

  for (const method of contactMethods) {
    await prisma.contactMethod.create({ data: method });
  }

  const projectCategories = [
    { key: "web", faName: "وب", enName: "Web", order: 0 },
    { key: "mobile", faName: "موبایل", enName: "Mobile", order: 1 },
    { key: "ai_ml", faName: "هوش مصنوعی", enName: "AI/ML", order: 2 },
    { key: "cloud", faName: "ابر", enName: "Cloud", order: 3 },
    { key: "blockchain", faName: "بلاکچین", enName: "Blockchain", order: 4 },
  ];

  const createdProjectCategories: Record<string, string> = {};
  for (const cat of projectCategories) {
    const created = await prisma.projectCategory.create({ data: cat });
    createdProjectCategories[cat.key] = created.id;
  }

  const projects = [
    {
      categoryKey: "web",
      faName: "پلتفرم فروش آنلاین",
      enName: "E-Commerce Platform",
      faSlug: "ecommerce-platform",
      enSlug: "ecommerce-platform",
      faDescription: "پلتفرم فروش آنلاین مقیاس‌پذیر با پنل مدیریت پیشرفته.",
      enDescription: "Scalable e-commerce platform with advanced admin panel.",
      client: "TechStore Inc.",
      technologies: ["Next.js", "PostgreSQL", "Stripe", "Redis"],
      completionDate: new Date("2024-06-01"),
    },
    {
      categoryKey: "mobile",
      faName: "اپلیکیشن تحویل غذا",
      enName: "Food Delivery App",
      faSlug: "food-delivery-app",
      enSlug: "food-delivery-app",
      faDescription: "اپلیکیشن iOS و Android برای سفارش و ردیابی غذا.",
      enDescription: "iOS and Android app for food ordering and tracking.",
      client: "FoodHub",
      technologies: ["React Native", "Node.js", "MongoDB"],
      completionDate: new Date("2024-03-15"),
    },
    {
      categoryKey: "ai_ml",
      faName: "دستیار هوشمند پشتیبانی",
      enName: "AI Support Assistant",
      faSlug: "ai-support-assistant",
      enSlug: "ai-support-assistant",
      faDescription: "چت‌بات هوشمند مبتنی بر LLM برای پشتیبانی مشتری.",
      enDescription: "LLM-powered chatbot for customer support automation.",
      client: "ServicePro",
      technologies: ["Python", "OpenAI", "FastAPI", "LangChain"],
      completionDate: new Date("2024-09-20"),
    },
  ];

  for (const [index, project] of projects.entries()) {
    const { categoryKey, ...data } = project;
    await prisma.project.create({
      data: {
        ...data,
        categoryId: createdProjectCategories[categoryKey],
        userId: admin.id,
        order: index,
        status: ProjectStatus.COMPLETED,
        isFeatured: index < 2,
      },
    });
  }

  const workCategories = [
    { key: "ui_ux", faName: "UI/UX", enName: "UI/UX", order: 0 },
    { key: "development", faName: "توسعه", enName: "Development", order: 1 },
    { key: "consulting", faName: "مشاوره", enName: "Consulting", order: 2 },
    { key: "devops", faName: "DevOps", enName: "DevOps", order: 3 },
    { key: "data_science", faName: "علم داده", enName: "Data Science", order: 4 },
  ];

  const createdWorkCategories: Record<string, string> = {};
  for (const cat of workCategories) {
    const created = await prisma.workCategory.create({ data: cat });
    createdWorkCategories[cat.key] = created.id;
  }

  const works = [
    {
      categoryKey: "development",
      faTitle: "تحول دیجیتال بانکداری",
      enTitle: "Banking Digital Transformation",
      faSlug: "banking-digital-transformation",
      enSlug: "banking-digital-transformation",
      faDescription: "بازطراحی کامل پلتفرم بانکداری آنلاین برای ۲ میلیون کاربر.",
      enDescription: "Complete redesign of online banking platform for 2M users.",
      faChallenge: "سیستم قدیمی کند بود و تجربه کاربری ضعیفی داشت.",
      enChallenge: "Legacy system was slow with poor user experience.",
      faSolution: "معماری میکروسرویس با React و Kubernetes.",
      enSolution: "Microservices architecture with React and Kubernetes.",
      faResults: "۴۰٪ افزایش رضایت کاربر و ۶۰٪ کاهش زمان بارگذاری.",
      enResults: "40% increase in user satisfaction and 60% faster load times.",
      technologies: ["React", "Node.js", "Kubernetes", "PostgreSQL"],
    },
    {
      categoryKey: "ui_ux",
      faTitle: "طراحی اپلیکیشن سلامت",
      enTitle: "Healthcare App Design",
      faSlug: "healthcare-app-design",
      enSlug: "healthcare-app-design",
      faDescription: "طراحی UI/UX برای اپلیکیشن مدیریت سلامت.",
      enDescription: "UI/UX design for health management application.",
      faChallenge: "نیاز به رابط کاربری ساده برای گروه سنی بالا.",
      enChallenge: "Need for simple interface for elderly users.",
      faSolution: "طراحی مبتنی بر دسترسی‌پذیری با فونت بزرگ و navigation ساده.",
      enSolution: "Accessibility-first design with large fonts and simple navigation.",
      faResults: "۹۵٪ رضایت کاربر در تست‌های usability.",
      enResults: "95% user satisfaction in usability tests.",
      technologies: ["Figma", "Design System", "User Research"],
    },
  ];

  for (const [index, work] of works.entries()) {
    const { categoryKey, ...data } = work;
    await prisma.work.create({
      data: {
        ...data,
        categoryId: createdWorkCategories[categoryKey],
        order: index,
        galleryImages: [],
      },
    });
  }

  const blogCategories = [
    {
      faSlug: "web_development",
      enSlug: "web_development",
      faName: "توسعه وب",
      enName: "Web Development",
      faExcerpt: "مقالات توسعه وب",
      enExcerpt: "Web development articles",
      faContent: "محتوای دسته‌بندی توسعه وب",
      enContent: "Web development category content",
    },
    {
      faSlug: "ai_ml",
      enSlug: "ai_ml",
      faName: "هوش مصنوعی",
      enName: "AI/ML",
      faExcerpt: "مقالات هوش مصنوعی",
      enExcerpt: "AI/ML articles",
      faContent: "محتوای دسته‌بندی هوش مصنوعی",
      enContent: "AI/ML category content",
    },
    {
      faSlug: "devops",
      enSlug: "devops",
      faName: "DevOps",
      enName: "DevOps",
      faExcerpt: "مقالات DevOps",
      enExcerpt: "DevOps articles",
      faContent: "محتوای دسته‌بندی DevOps",
      enContent: "DevOps category content",
    },
  ];

  const createdBlogCategories: Record<string, string> = {};
  for (const cat of blogCategories) {
    const created = await prisma.categories.create({
      data: {
        userId: admin.id,
        ...cat,
        thumbnail: "/images/blog/default.jpg",
      },
    });
    createdBlogCategories[cat.enSlug] = created.id;
  }

  const tags = [
    {
      faName: "Next.js",
      enName: "Next.js",
      faSlug: "nextjs",
      enSlug: "nextjs",
      faExcerpt: "Next.js",
      enExcerpt: "Next.js",
      faContent: "Next.js",
      enContent: "Next.js",
    },
    {
      faName: "React",
      enName: "React",
      faSlug: "react",
      enSlug: "react",
      faExcerpt: "React",
      enExcerpt: "React",
      faContent: "React",
      enContent: "React",
    },
    {
      faName: "TypeScript",
      enName: "TypeScript",
      faSlug: "typescript",
      enSlug: "typescript",
      faExcerpt: "TypeScript",
      enExcerpt: "TypeScript",
      faContent: "TypeScript",
      enContent: "TypeScript",
    },
  ];

  const createdTags: Record<string, string> = {};
  for (const tag of tags) {
    const created = await prisma.tags.create({
      data: {
        userId: admin.id,
        ...tag,
        thumbnail: "/images/tags/default.jpg",
      },
    });
    createdTags[tag.enSlug] = created.id;
  }

  const posts = [
    {
      categorySlug: "web_development",
      tagSlugs: ["nextjs", "react", "typescript"],
      faTitle: "راهنمای کامل Next.js 15",
      enTitle: "Complete Guide to Next.js 15",
      faSlug: "nextjs-15-guide",
      enSlug: "nextjs-15-guide",
      faExcerpt: "همه چیز درباره ویژگی‌های جدید Next.js 15",
      enExcerpt: "Everything about new Next.js 15 features",
      faContent: "محتوای کامل مقاله Next.js 15...",
      enContent: "Full article content about Next.js 15...",
      readTime: 8,
      publishedAt: new Date("2024-11-01"),
    },
    {
      categorySlug: "ai_ml",
      tagSlugs: ["typescript"],
      faTitle: "ادغام LLM در اپلیکیشن‌های وب",
      enTitle: "Integrating LLMs in Web Applications",
      faSlug: "llm-web-integration",
      enSlug: "llm-web-integration",
      faExcerpt: "چگونه مدل‌های زبانی را در پروژه خود استفاده کنیم",
      enExcerpt: "How to use language models in your project",
      faContent: "محتوای کامل مقاله LLM...",
      enContent: "Full article content about LLM integration...",
      readTime: 12,
      publishedAt: new Date("2024-10-15"),
    },
    {
      categorySlug: "devops",
      tagSlugs: ["nextjs"],
      faTitle: "CI/CD با GitHub Actions",
      enTitle: "CI/CD with GitHub Actions",
      faSlug: "cicd-github-actions",
      enSlug: "cicd-github-actions",
      faExcerpt: "راه‌اندازی pipeline خودکار برای پروژه Next.js",
      enExcerpt: "Setting up automated pipeline for Next.js projects",
      faContent: "محتوای کامل مقاله CI/CD...",
      enContent: "Full article content about CI/CD...",
      readTime: 10,
      publishedAt: new Date("2024-09-20"),
    },
  ];

  for (const post of posts) {
    const { categorySlug, tagSlugs, ...data } = post;
    const createdPost = await prisma.post.create({
      data: {
        userId: admin.id,
        categoryId: createdBlogCategories[categorySlug],
        ...data,
        status: PostStatus.PUBLISHED,
        thumbnail: "/images/blog/default.jpg",
      },
    });

    for (const tagSlug of tagSlugs) {
      await prisma.postTag.create({
        data: {
          postId: createdPost.id,
          tagId: createdTags[tagSlug],
        },
      });
    }
  }

  // Migrate legacy /uploads/ URLs to /api/uploads/
  const legacyMedia = await prisma.media.findMany({
    where: { url: { startsWith: "/uploads/" } },
  });
  for (const item of legacyMedia) {
    await prisma.media.update({
      where: { id: item.id },
      data: { url: item.url.replace("/uploads/", "/api/uploads/") },
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
