"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Newspaper,
  FolderKanban,
  Briefcase,
  Mail,
  Users,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface DashboardData {
  stats: {
    posts: number;
    projects: number;
    works: number;
    submissions: number;
    teamMembers: number;
    mediaCount: number;
    unreadSubmissions: number;
  };
  recentPosts: Array<{
    id: string;
    faTitle: string;
    status: string;
    updatedAt: string;
  }>;
  recentSubmissions: Array<{
    id: string;
    name: string;
    email: string;
    subject: string | null;
    isRead: boolean;
    createdAt: string;
  }>;
}

const statCards = [
  { key: "posts", label: "مقالات", icon: Newspaper, href: "/admin/blog", color: "text-blue-500" },
  { key: "projects", label: "پروژه‌ها", icon: FolderKanban, href: "/admin/projects", color: "text-purple-500" },
  { key: "works", label: "نمونه‌کارها", icon: Briefcase, href: "/admin/work", color: "text-cyan-500" },
  { key: "submissions", label: "پیام‌ها", icon: Mail, href: "/admin/contact", color: "text-green-500" },
  { key: "teamMembers", label: "اعضای تیم", icon: Users, href: "/admin/about", color: "text-orange-500" },
  { key: "mediaCount", label: "رسانه‌ها", icon: ImageIcon, href: "/admin/media", color: "text-pink-500" },
] as const;

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="داشبورد"
        description="خلاصه وضعیت سایت و فعالیت‌های اخیر"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map(({ key, label, icon: Icon, href, color }) => (
          <Link key={key} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <Icon className={`h-5 w-5 ${color} mb-2`} />
                <p className="text-2xl font-bold">
                  {data?.stats[key as keyof DashboardData["stats"]] ?? "—"}
                </p>
                <p className="text-xs text-slate-500">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {data && data.stats.unreadSubmissions > 0 && (
        <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-amber-800 text-sm">
          {data.stats.unreadSubmissions} پیام خوانده‌نشده دارید.{" "}
          <Link href="/admin/contact" className="underline font-medium">
            مشاهده
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>آخرین مقالات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/blog/${post.id}`}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <span className="text-sm font-medium truncate">{post.faTitle}</span>
                  <span className="text-xs text-slate-500 shrink-0 mr-2">
                    {post.status}
                  </span>
                </Link>
              )) ?? (
                <p className="text-sm text-slate-500">در حال بارگذاری...</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آخرین پیام‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.recentSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className={`rounded-lg p-3 ${!sub.isRead ? "bg-indigo-50 dark:bg-indigo-950/30" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{sub.name}</span>
                    <span className="text-xs text-slate-500">
                      {format(new Date(sub.createdAt), "MMM d")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{sub.email}</p>
                  {sub.subject && (
                    <p className="text-xs mt-1 truncate">{sub.subject}</p>
                  )}
                </div>
              )) ?? (
                <p className="text-sm text-slate-500">در حال بارگذاری...</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
