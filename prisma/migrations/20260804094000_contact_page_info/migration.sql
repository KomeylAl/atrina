-- CreateTable
CREATE TABLE "ContactPageInfo" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "faOfficeTitle" TEXT NOT NULL DEFAULT 'آدرس دفتر',
    "enOfficeTitle" TEXT NOT NULL DEFAULT 'Office Location',
    "faOfficeAddress" TEXT NOT NULL,
    "enOfficeAddress" TEXT NOT NULL,
    "faBusinessHoursTitle" TEXT NOT NULL DEFAULT 'ساعات کاری',
    "enBusinessHoursTitle" TEXT NOT NULL DEFAULT 'Business Hours',
    "faBusinessHours" TEXT NOT NULL,
    "enBusinessHours" TEXT NOT NULL,
    "faResponseTimeTitle" TEXT NOT NULL DEFAULT 'زمان پاسخ‌گویی',
    "enResponseTimeTitle" TEXT NOT NULL DEFAULT 'Response Time',
    "faResponseTime" TEXT NOT NULL,
    "enResponseTime" TEXT NOT NULL,

    CONSTRAINT "ContactPageInfo_pkey" PRIMARY KEY ("id")
);

-- Seed default row
INSERT INTO "ContactPageInfo" (
    "id",
    "faOfficeTitle",
    "enOfficeTitle",
    "faOfficeAddress",
    "enOfficeAddress",
    "faBusinessHoursTitle",
    "enBusinessHoursTitle",
    "faBusinessHours",
    "enBusinessHours",
    "faResponseTimeTitle",
    "enResponseTimeTitle",
    "faResponseTime",
    "enResponseTime"
) VALUES (
    'default',
    'آدرس دفتر',
    'Office Location',
    'خیابان فناوری ۱۲۳
تهران، ایران',
    '123 Tech Street
San Francisco, CA 94107
United States',
    'ساعات کاری',
    'Business Hours',
    'شنبه تا پنج‌شنبه: ۹ تا ۱۸
جمعه: تعطیل',
    'Monday - Friday: 9am - 6pm
Saturday - Sunday: Closed',
    'زمان پاسخ‌گویی',
    'Response Time',
    'معمولاً ظرف ۲۴ ساعت در روزهای کاری پاسخ می‌دهیم.',
    'We typically respond to all inquiries within 24 hours during business days.'
)
ON CONFLICT ("id") DO NOTHING;
