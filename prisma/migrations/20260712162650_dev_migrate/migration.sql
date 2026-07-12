-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'WRITER');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContactMethodType" AS ENUM ('EMAIL', 'PHONE', 'WHATSAPP', 'TELEGRAM');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('COMPLETED', 'IN_PROGRESS', 'PLANNED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'WRITER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "faName" TEXT NOT NULL,
    "enName" TEXT NOT NULL,
    "faSlug" TEXT NOT NULL,
    "enSlug" TEXT NOT NULL,
    "faExcerpt" TEXT NOT NULL,
    "enExcerpt" TEXT NOT NULL,
    "faContent" TEXT NOT NULL,
    "enContent" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "faName" TEXT NOT NULL,
    "enName" TEXT NOT NULL,
    "faSlug" TEXT NOT NULL,
    "enSlug" TEXT NOT NULL,
    "faExcerpt" TEXT NOT NULL,
    "enExcerpt" TEXT NOT NULL,
    "faContent" TEXT NOT NULL,
    "enContent" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "faTitle" TEXT NOT NULL,
    "enTitle" TEXT NOT NULL,
    "faSlug" TEXT NOT NULL,
    "enSlug" TEXT NOT NULL,
    "faExcerpt" TEXT NOT NULL,
    "enExcerpt" TEXT NOT NULL,
    "faContent" TEXT NOT NULL,
    "enContent" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "thumbnail" TEXT NOT NULL,
    "readTime" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostTag" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "faLogo" TEXT NOT NULL DEFAULT 'Atrina Dev',
    "enLogo" TEXT NOT NULL DEFAULT 'Atrina Dev',
    "faFooterDescription" TEXT NOT NULL,
    "enFooterDescription" TEXT NOT NULL,
    "faFooterCopyright" TEXT NOT NULL,
    "enFooterCopyright" TEXT NOT NULL,
    "careersEmail" TEXT NOT NULL DEFAULT 'careers@atrina.com',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavLink" (
    "id" TEXT NOT NULL,
    "faName" TEXT NOT NULL,
    "enName" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "showInHeader" BOOLEAN NOT NULL DEFAULT true,
    "showInFooter" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NavLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeHero" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "faBadge" TEXT NOT NULL,
    "enBadge" TEXT NOT NULL,
    "faTitleTop" TEXT NOT NULL,
    "enTitleTop" TEXT NOT NULL,
    "faTitleBottom" TEXT NOT NULL,
    "enTitleBottom" TEXT NOT NULL,
    "faDescription" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,
    "faLinkOneText" TEXT NOT NULL,
    "enLinkOneText" TEXT NOT NULL,
    "faLinkTwoText" TEXT NOT NULL,
    "enLinkTwoText" TEXT NOT NULL,
    "linkOneHref" TEXT NOT NULL DEFAULT '/projects',
    "linkTwoHref" TEXT NOT NULL DEFAULT '/about',

    CONSTRAINT "HomeHero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeHeroSlide" (
    "id" TEXT NOT NULL,
    "faBadge" TEXT NOT NULL,
    "enBadge" TEXT NOT NULL,
    "faTitleTop" TEXT NOT NULL,
    "enTitleTop" TEXT NOT NULL,
    "faTitleBottom" TEXT NOT NULL,
    "enTitleBottom" TEXT NOT NULL,
    "faDescription" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,
    "faLinkOneText" TEXT NOT NULL,
    "enLinkOneText" TEXT NOT NULL,
    "faLinkTwoText" TEXT NOT NULL,
    "enLinkTwoText" TEXT NOT NULL,
    "linkOneHref" TEXT NOT NULL DEFAULT '/projects',
    "linkTwoHref" TEXT NOT NULL DEFAULT '/about',
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HomeHeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomePostsSection" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "faTitle" TEXT NOT NULL,
    "enTitle" TEXT NOT NULL,
    "faDescription" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,

    CONSTRAINT "HomePostsSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeProjectsSection" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "faTitle" TEXT NOT NULL,
    "enTitle" TEXT NOT NULL,
    "faDescription" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,

    CONSTRAINT "HomeProjectsSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeFeaturesSection" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "faTitle" TEXT NOT NULL,
    "enTitle" TEXT NOT NULL,
    "faDescription" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,

    CONSTRAINT "HomeFeaturesSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeFeature" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "faTitle" TEXT NOT NULL,
    "enTitle" TEXT NOT NULL,
    "faDescription" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HomeFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeSkillsSection" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "faTitle" TEXT NOT NULL,
    "enTitle" TEXT NOT NULL,
    "faDescription" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,

    CONSTRAINT "HomeSkillsSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeSkillBar" (
    "id" TEXT NOT NULL,
    "faName" TEXT NOT NULL,
    "enName" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HomeSkillBar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeSkillItem" (
    "id" TEXT NOT NULL,
    "faText" TEXT NOT NULL,
    "enText" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HomeSkillItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeCta" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "faTitle" TEXT NOT NULL,
    "enTitle" TEXT NOT NULL,
    "faDescription" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,
    "faLinkText" TEXT NOT NULL,
    "enLinkText" TEXT NOT NULL,
    "linkHref" TEXT NOT NULL DEFAULT '/contact',

    CONSTRAINT "HomeCta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageMeta" (
    "id" TEXT NOT NULL,
    "faTitle" TEXT NOT NULL,
    "enTitle" TEXT NOT NULL,
    "faDescription" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,

    CONSTRAINT "PageMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutStory" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "faTitle" TEXT NOT NULL,
    "enTitle" TEXT NOT NULL,
    "faParagraph1" TEXT NOT NULL,
    "enParagraph1" TEXT NOT NULL,
    "faParagraph2" TEXT NOT NULL,
    "enParagraph2" TEXT NOT NULL,
    "faParagraph3" TEXT NOT NULL,
    "enParagraph3" TEXT NOT NULL,

    CONSTRAINT "AboutStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutStat" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "faLabel" TEXT NOT NULL,
    "enLabel" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AboutStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutValue" (
    "id" TEXT NOT NULL,
    "faTitle" TEXT NOT NULL,
    "enTitle" TEXT NOT NULL,
    "faDescription" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AboutValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutTeamSection" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "faTitle" TEXT NOT NULL,
    "enTitle" TEXT NOT NULL,
    "faSubtitle" TEXT NOT NULL,
    "enSubtitle" TEXT NOT NULL,

    CONSTRAINT "AboutTeamSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutCta" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "faTitle" TEXT NOT NULL,
    "enTitle" TEXT NOT NULL,
    "faDescription" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,
    "faEmailLabel" TEXT NOT NULL,
    "enEmailLabel" TEXT NOT NULL,

    CONSTRAINT "AboutCta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "faRole" TEXT NOT NULL,
    "enRole" TEXT NOT NULL,
    "faBio" TEXT,
    "enBio" TEXT,
    "image" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "github" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMethod" (
    "id" TEXT NOT NULL,
    "type" "ContactMethodType" NOT NULL,
    "faLabel" TEXT NOT NULL,
    "enLabel" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "colorFrom" TEXT NOT NULL DEFAULT 'from-blue-500',
    "colorTo" TEXT NOT NULL DEFAULT 'to-cyan-500',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ContactMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectCategory" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "faName" TEXT NOT NULL,
    "enName" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "categoryId" TEXT NOT NULL,
    "faName" TEXT NOT NULL,
    "enName" TEXT NOT NULL,
    "faSlug" TEXT NOT NULL,
    "enSlug" TEXT NOT NULL,
    "faDescription" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,
    "client" TEXT,
    "technologies" TEXT[],
    "thumbnail" TEXT,
    "completionDate" TIMESTAMP(3),
    "status" "ProjectStatus" NOT NULL DEFAULT 'COMPLETED',
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkCategory" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "faName" TEXT NOT NULL,
    "enName" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WorkCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "faTitle" TEXT NOT NULL,
    "enTitle" TEXT NOT NULL,
    "faSlug" TEXT NOT NULL,
    "enSlug" TEXT NOT NULL,
    "faDescription" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,
    "faChallenge" TEXT,
    "enChallenge" TEXT,
    "faSolution" TEXT,
    "enSolution" TEXT,
    "faResults" TEXT,
    "enResults" TEXT,
    "thumbnail" TEXT,
    "galleryImages" TEXT[],
    "technologies" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_faSlug_key" ON "Categories"("faSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_enSlug_key" ON "Categories"("enSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_faSlug_key" ON "Tags"("faSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_enSlug_key" ON "Tags"("enSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Post_faSlug_key" ON "Post"("faSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Post_enSlug_key" ON "Post"("enSlug");

-- CreateIndex
CREATE UNIQUE INDEX "PostTag_postId_tagId_key" ON "PostTag"("postId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectCategory_key_key" ON "ProjectCategory"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Project_faSlug_key" ON "Project"("faSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_enSlug_key" ON "Project"("enSlug");

-- CreateIndex
CREATE UNIQUE INDEX "WorkCategory_key_key" ON "WorkCategory"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Work_faSlug_key" ON "Work"("faSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Work_enSlug_key" ON "Work"("enSlug");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProjectCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "WorkCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
