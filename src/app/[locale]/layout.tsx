import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/db/site";

export const metadata: Metadata = {
  title: "Atrina Dev",
  description: "Building exceptional software solutions",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const lang = locale as "fa" | "en";
  const dir = locale === "fa" ? "rtl" : "ltr";
  const siteSettings = await getSiteSettings(lang);

  return (
    <html lang={locale} dir={dir}>
      <body>
        <Header
          lang={lang}
          logo={siteSettings.logo}
          navLinks={siteSettings.navLinks}
        />
        {children}
        <Footer lang={lang} />
      </body>
    </html>
  );
}
