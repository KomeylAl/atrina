import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAccessGuard from "@/components/admin/AdminAccessGuard";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50/80 dark:bg-slate-950 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <AdminAccessGuard>{children}</AdminAccessGuard>
        </div>
      </main>
    </div>
  );
}
