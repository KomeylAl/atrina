"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";

export default function WorkListPage() {
  const [works, setWorks] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/works").then((r) => r.json()).then(setWorks);
  }, []);

  async function handleDelete(id: string) {
    await fetch(`/api/admin/works/${id}`, { method: "DELETE" });
    setWorks((prev) => prev.filter((w) => w.id !== id));
  }

  return (
    <div>
      <AdminPageHeader
        title="مدیریت نمونه‌کارها"
        actions={<Link href="/admin/work/new"><Button><Plus className="h-4 w-4 ml-2" />نمونه‌کار جدید</Button></Link>}
      />
      <div className="rounded-xl border bg-white dark:bg-slate-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>عنوان</TableHead>
              <TableHead>دسته</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {works.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-medium">{w.faTitle}</TableCell>
                <TableCell>{w.category?.faName}</TableCell>
                <TableCell className="flex gap-2">
                  <Link href={`/admin/work/${w.id}`}><Button variant="outline" size="sm"><Pencil className="h-3 w-3" /></Button></Link>
                  <ConfirmDelete onConfirm={() => handleDelete(w.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
