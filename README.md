# Atrina Dev — Dynamic CMS Backend

پروژهٔ وب‌سایت Atrina Dev با **Next.js App Router**، **Prisma ORM** و **PostgreSQL** به‌صورت داینامیک پیاده‌سازی شده است. تمام محتوای صفحات (صفحهٔ اصلی، بلاگ، پروژه‌ها، نمونه‌کارها، دربارهٔ ما، تماس و تنظیمات سایت) از دیتابیس خوانده می‌شود.

> **نکته:** این README برای توسعهٔ **پنل ادمین** در فاز بعدی طراحی شده است.

---

## Tech Stack

| لایه | تکنولوژی |
|------|----------|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | Next.js API Routes (App Router) |
| ORM | Prisma 6 |
| Database | PostgreSQL |
| i18n | fa / en (فیلدهای دو زبانه در دیتابیس) |

---

## Quick Start

### 1. پیش‌نیازها

- Node.js 20+
- PostgreSQL در حال اجرا

### 2. تنظیم محیط

فایل `.env` در ریشهٔ پروژه:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/atrina_db?schema=public"
```

### 3. نصب و راه‌اندازی

```bash
npm install
npx prisma generate
npx prisma db push      # یا: npm run db:migrate
npm run db:seed         # دادهٔ اولیه از en.json / fa.json
npm run dev
```

سایت: `http://localhost:3000/fa` یا `http://localhost:3000/en`

---

## Architecture

```
src/
├── app/
│   ├── [locale]/          # صفحات (SSR با Prisma مستقیم)
│   └── api/               # REST API Routes
├── lib/
│   ├── prisma.ts          # Singleton Prisma Client
│   ├── db/                # لایهٔ دسترسی به داده (queries)
│   ├── locale.ts          # helper انتخاب fa/en
│   └── api-response.ts    # پاسخ استاندارد JSON
├── types/
│   └── database.ts        # TypeScript types برای frontend
└── components/            # UI Components

prisma/
├── schema.prisma          # مدل‌های دیتابیس
└── seed.ts                # دادهٔ اولیه
```

### الگوی دسترسی به داده

- **Server Components** → مستقیماً از `src/lib/db/*` استفاده می‌کنند (سریع‌تر)
- **API Routes** → همان functions را expose می‌کنند (برای پنل ادمین و client-side)
- **Client Components** → فقط برای فرم تماس از `POST /api/contact` استفاده می‌کنند

---

## Database Schema

### کاربران و احراز هویت (آماده برای پنل ادمین)

| Model | توضیح |
|-------|-------|
| `User` | ادمین / نویسنده — `role`: ADMIN \| WRITER |

### بلاگ

| Model | توضیح |
|-------|-------|
| `Categories` | دسته‌بندی بلاگ (fa/en) |
| `Tags` | برچسب‌ها (fa/en) |
| `Post` | مقالات — `status`: DRAFT \| PUBLISHED \| ARCHIVED |
| `PostTag` | رابطهٔ many-to-many |

### پروژه‌ها

| Model | توضیح |
|-------|-------|
| `ProjectCategory` | دسته‌بندی (web, mobile, ai_ml, ...) |
| `Project` | پروژه‌ها با technologies[] |

### نمونه‌کارها (Case Studies)

| Model | توضیح |
|-------|-------|
| `WorkCategory` | دسته‌بندی (ui_ux, development, ...) |
| `Work` | challenge / solution / results + galleryImages[] |

### صفحهٔ اصلی

| Model | توضیح |
|-------|-------|
| `HomeHero` | بخش Hero (singleton) |
| `HomeFeaturesSection` + `HomeFeature` | ویژگی‌ها |
| `HomeSkillsSection` + `HomeSkillBar` + `HomeSkillItem` | مهارت‌ها |
| `HomeCta` | Call-to-Action |

### دربارهٔ ما

| Model | توضیح |
|-------|-------|
| `AboutStory` | داستان شرکت |
| `AboutStat` | آمار (50+ Projects, ...) |
| `AboutValue` | ارزش‌ها |
| `AboutTeamSection` | عنوان بخش تیم |
| `TeamMember` | اعضای تیم |
| `AboutCta` | CTA استخدام |

### تماس و تنظیمات

| Model | توضیح |
|-------|-------|
| `ContactMethod` | email, phone, whatsapp, telegram |
| `ContactSubmission` | پیام‌های فرم تماس |
| `SiteSettings` | لوگو، footer، copyright |
| `NavLink` | لینک‌های header/footer |
| `PageMeta` | عنوان و توضیح صفحات |

---

## API Routes

همهٔ endpointها پارامتر `locale=fa|en` می‌پذیرند.

| Method | Endpoint | توضیح |
|--------|----------|-------|
| GET | `/api/home?locale=fa` | محتوای صفحهٔ اصلی |
| GET | `/api/site?locale=fa` | تنظیمات سایت + nav |
| GET | `/api/blog?locale=fa&category=&q=` | لیست پست‌ها |
| GET | `/api/blog/[slug]?locale=fa` | جزئیات پست |
| GET | `/api/projects?locale=fa&category=` | لیست پروژه‌ها |
| GET | `/api/projects/[slug]?locale=fa` | جزئیات پروژه |
| GET | `/api/work?locale=fa&category=` | لیست نمونه‌کارها |
| GET | `/api/work/[slug]?locale=fa` | جزئیات نمونه‌کار |
| GET | `/api/about?locale=fa` | صفحهٔ درباره |
| GET | `/api/contact?locale=fa` | اطلاعات تماس |
| POST | `/api/contact` | ارسال فرم `{ name, email, subject?, message }` |

### نمونهٔ پاسخ

```json
// GET /api/home?locale=fa
{
  "hero": { "badge": "...", "titleTop": "...", ... },
  "features": { "title": "...", "items": [...] },
  "skills": { "bars": [...], "items": [...] },
  "cta": { ... }
}
```

---

## Bilingual Pattern

تمام محتوای قابل ویرایش فیلدهای جفت دارد:

```
faTitle / enTitle
faDescription / enDescription
faSlug / enSlug
```

Helper در `src/lib/locale.ts`:

```typescript
import { pickLocalized, localizedField } from "@/lib/locale";

// pickLocalized("fa", faValue, enValue)
// localizedField(record, "fa", "Title") → record.faTitle
```

---

## Admin Panel

پنل مدیریت در مسیر `/admin` در دسترس است.

### ورود

```
URL:      http://localhost:3000/admin/login
Email:    admin@atrina.com
Password: changeme
```

### متغیر محیطی

```env
AUTH_SECRET="your-random-secret-key-here"
```

### صفحات پنل

| مسیر | توضیح |
|------|-------|
| `/admin` | داشبورد + آمار |
| `/admin/home` | Hero، Features، Skills، CTA |
| `/admin/blog` | مدیریت مقالات + Rich Text Editor |
| `/admin/blog/categories` | دسته‌بندی بلاگ |
| `/admin/blog/tags` | برچسب‌ها |
| `/admin/projects` | پروژه‌ها |
| `/admin/work` | نمونه‌کارها + گالری |
| `/admin/about` | داستان، آمار، ارزش‌ها، تیم |
| `/admin/contact` | روش‌های تماس + صندوق پیام |
| `/admin/media` | گالری رسانه + آپلود |
| `/admin/settings` | تنظیمات سایت، منو، متای صفحات |

### API های Admin

همه endpointها نیاز به session cookie دارند (به‌جز `/api/admin/auth/login`).

```
POST   /api/admin/auth/login
POST   /api/admin/auth/logout
GET    /api/admin/auth/me
GET    /api/admin/dashboard
GET/POST /api/admin/media
DELETE /api/admin/media/[id]
GET/PUT/DELETE /api/admin/home
GET/POST /api/admin/posts
GET/PUT/DELETE /api/admin/posts/[id]
... و سایر resourceها
```

---

## Admin Panel — Roadmap (Completed ✓)

برای پنل ادمین پیشنهاد می‌شود:

### 1. Authentication
- NextAuth.js یا JWT با model `User`
- Role-based access: ADMIN (full), WRITER (blog only)

### 2. Admin Routes (پیشنهادی)
```
/admin/login
/admin/dashboard
/admin/home          → CRUD HomeHero, Features, Skills, CTA
/admin/blog          → CRUD Posts, Categories, Tags
/admin/projects      → CRUD Projects, Categories
/admin/work          → CRUD Works, Categories
/admin/about         → CRUD Story, Stats, Values, Team
/admin/contact       → ContactMethods + ContactSubmissions inbox
/admin/settings      → SiteSettings, NavLinks
/admin/media         → آپلود تصاویر (thumbnail, gallery)
```

### 3. API Extensions برای Admin
هر resource نیاز به endpointهای CRUD دارد:

```
POST   /api/admin/posts
PUT    /api/admin/posts/[id]
DELETE /api/admin/posts/[id]
PATCH  /api/admin/posts/[id]/status   → DRAFT → PUBLISHED
```

### 4. پیشنهادات فنی
- **React Hook Form + Zod** برای validation
- **TanStack Query** (already installed) برای data fetching در admin
- **Rich Text Editor** (Tiptap / Lexical) برای faContent / enContent
- **Upload**: Cloudinary / S3 برای thumbnail و galleryImages
- **Middleware** برای محافظت routeهای `/admin/*`

### 5. Seed Admin User

```
Email: admin@atrina.com
Password: changeme   ← حتماً در production تغییر دهید
Role: ADMIN
```

---

## NPM Scripts

```bash
npm run dev          # سرور توسعه
npm run build        # build تولید
npm run db:generate  # prisma generate
npm run db:push      # sync schema بدون migration
npm run db:migrate   # migration با history
npm run db:seed      # seed دادهٔ اولیه
npm run db:studio    # Prisma Studio (GUI)
```

---

## Removed: Base44

اتصال به **Base44 SDK** به‌طور کامل حذف شده:
- `@base44/sdk` از dependencies
- `src/app/api/base44client/route.ts`

---

## Migration Notes

- فایل‌های `src/locales/en.json` و `fa.json` فقط برای **seed اولیه** استفاده می‌شوند
- UI labels ثابت (مثل «Quick Links») هنوز inline هستند — در پنل ادمین می‌توان به DB منتقل کرد
- `ContactInfo` (آدرس، ساعات کاری) فعلاً hardcoded است — model پیشنهادی: `ContactPageInfo`

---

## License

Private — Atrina Dev © 2024
