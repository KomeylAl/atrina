import { Toaster } from "sonner";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
