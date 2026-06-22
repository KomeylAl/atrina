"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  faTitle: string;
  enTitle: string;
  status: string;
  category: { faName: string };
  updatedAt: string;
}

export default function BlogListPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/admin/posts")
      .then((r) => r.json())
      .then(setPosts);
  }, []);

  async function handleDelete(id: string) {
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="مدیریت بلاگ"
        description="لیست مقالات و مدیریت محتوا"
        actions={
          <Link href="/admin/blog/new">
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              مقاله جدید
            </Button>
          </Link>
        }
      />

      <div className="rounded-xl border bg-white dark:bg-slate-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>عنوان</TableHead>
              <TableHead>دسته‌بندی</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>آخرین ویرایش</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.faTitle}</TableCell>
                <TableCell>{post.category?.faName}</TableCell>
                <TableCell>
                  <Badge variant={post.status === "PUBLISHED" ? "default" : "outline"}>
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-500">
                  {format(new Date(post.updatedAt), "yyyy/MM/dd")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/blog/${post.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </Link>
                    <ConfirmDelete onConfirm={() => handleDelete(post.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
