"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/projects").then((r) => r.json()).then(setProjects);
  }, []);

  async function handleDelete(id: string) {
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <AdminPageHeader
        title="مدیریت پروژه‌ها"
        actions={
          <Link href="/admin/projects/new"><Button><Plus className="h-4 w-4 ml-2" />پروژه جدید</Button></Link>
        }
      />
      <div className="rounded-xl border bg-white dark:bg-slate-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>دسته</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.faName}</TableCell>
                <TableCell>{p.category?.faName}</TableCell>
                <TableCell><Badge>{p.isPublished ? "منتشر" : "پیش‌نویس"}</Badge></TableCell>
                <TableCell className="flex gap-2">
                  <Link href={`/admin/projects/${p.id}`}><Button variant="outline" size="sm"><Pencil className="h-3 w-3" /></Button></Link>
                  <ConfirmDelete onConfirm={() => handleDelete(p.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
