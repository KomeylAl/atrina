-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "faFooterLinksTitle" TEXT NOT NULL DEFAULT 'پیوندهای سریع';
ALTER TABLE "SiteSettings" ADD COLUMN "enFooterLinksTitle" TEXT NOT NULL DEFAULT 'Quick Links';
ALTER TABLE "SiteSettings" ADD COLUMN "faFooterContactTitle" TEXT NOT NULL DEFAULT 'تماس';
ALTER TABLE "SiteSettings" ADD COLUMN "enFooterContactTitle" TEXT NOT NULL DEFAULT 'Contact';

-- CreateTable
CREATE TABLE "FooterSocialLink" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FooterSocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterTrustBadge" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT,
    "faAlt" TEXT NOT NULL DEFAULT '',
    "enAlt" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FooterTrustBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutValuesSection" (
    "id" TEXT NOT NULL,
    "faTitle" TEXT NOT NULL DEFAULT 'ارزش‌های ما',
    "enTitle" TEXT NOT NULL DEFAULT 'Our Values',

    CONSTRAINT "AboutValuesSection_pkey" PRIMARY KEY ("id")
);

-- Seed default values section row
INSERT INTO "AboutValuesSection" ("id", "faTitle", "enTitle")
VALUES ('default', 'ارزش‌های ما', 'Our Values')
ON CONFLICT ("id") DO NOTHING;

-- AlterTable TeamMember: rename monolingual name -> bilingual faName/enName
ALTER TABLE "TeamMember" ADD COLUMN "faName" TEXT;
ALTER TABLE "TeamMember" ADD COLUMN "enName" TEXT;
UPDATE "TeamMember" SET "faName" = COALESCE("faName", "name"), "enName" = COALESCE("enName", "name");
ALTER TABLE "TeamMember" ALTER COLUMN "faName" SET NOT NULL;
ALTER TABLE "TeamMember" ALTER COLUMN "enName" SET NOT NULL;
ALTER TABLE "TeamMember" DROP COLUMN "name";
