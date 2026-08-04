-- AlterTable
ALTER TABLE "Post"
ADD COLUMN "faSeoTitle" TEXT,
ADD COLUMN "enSeoTitle" TEXT,
ADD COLUMN "faSeoDescription" TEXT,
ADD COLUMN "enSeoDescription" TEXT,
ADD COLUMN "ogImage" TEXT,
ADD COLUMN "noIndex" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Project"
ADD COLUMN "faSeoTitle" TEXT,
ADD COLUMN "enSeoTitle" TEXT,
ADD COLUMN "faSeoDescription" TEXT,
ADD COLUMN "enSeoDescription" TEXT,
ADD COLUMN "ogImage" TEXT,
ADD COLUMN "noIndex" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Work"
ADD COLUMN "faSeoTitle" TEXT,
ADD COLUMN "enSeoTitle" TEXT,
ADD COLUMN "faSeoDescription" TEXT,
ADD COLUMN "enSeoDescription" TEXT,
ADD COLUMN "ogImage" TEXT,
ADD COLUMN "noIndex" BOOLEAN NOT NULL DEFAULT false;
