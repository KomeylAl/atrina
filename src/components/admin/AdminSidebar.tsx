"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Newspaper,
  FolderKanban,
  Briefcase,
  Users,
  Mail,
  ImageIcon,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Tags,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/admin/home", label: "صفحه اصلی", icon: Home },
  { href: "/admin/blog", label: "بلاگ", icon: Newspaper },
  { href: "/admin/blog/categories", label: "دسته‌بندی بلاگ", icon: Layers },
  { href: "/admin/blog/tags", label: "برچسب‌ها", icon: Tags },
  { href: "/admin/projects", label: "پروژه‌ها", icon: FolderKanban },
  { href: "/admin/work", label: "نمونه‌کارها", icon: Briefcase },
  { href: "/admin/about", label: "درباره ما", icon: Users },
  { href: "/admin/contact", label: "تماس", icon: Mail },
  { href: "/admin/media", label: "گالری رسانه", icon: ImageIcon },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-l bg-slate-950 text-slate-100 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-5">
        {!collapsed && (
          <Link href="/admin" className="font-bold text-lg">
            <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Atrina Admin
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 hover:bg-slate-800"
        >
          {collapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-red-950 hover:text-red-400"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>خروج</span>}
        </button>
      </div>
    </aside>
  );
}
