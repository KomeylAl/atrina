"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ImagePicker from "@/components/admin/ImagePicker";
import TagsInput from "@/components/admin/TagsInput";
import BilingualRichText from "@/components/admin/BilingualRichText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { slugify } from "@/lib/admin/slug";
import { toast } from "sonner";

interface ProjectFormProps {
  projectId?: string;
}

export default function ProjectForm({ projectId }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = !!projectId;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; faName: string }>>([]);

  const [form, setForm] = useState({
    faName: "", enName: "", faSlug: "", enSlug: "",
    faDescription: "", enDescription: "",
    client: "", technologies: [] as string[],
    thumbnail: "", categoryId: "", status: "COMPLETED",
    isPublished: true, isFeatured: false, order: 0,
    completionDate: "",
  });

  useEffect(() => {
    fetch("/api/admin/project-categories").then((r) => r.json()).then(setCategories);
    if (projectId) {
      fetch(`/api/admin/projects/${projectId}`).then((r) => r.json()).then((p) => {
        setForm({
          faName: p.faName, enName: p.enName, faSlug: p.faSlug, enSlug: p.enSlug,
          faDescription: p.faDescription, enDescription: p.enDescription,
          client: p.client ?? "", technologies: p.technologies ?? [],
          thumbnail: p.thumbnail ?? "", categoryId: p.categoryId,
          status: p.status, isPublished: p.isPublished, isFeatured: p.isFeatured ?? false, order: p.order,
          completionDate: p.completionDate ? p.completionDate.split("T")[0] : "",
        });
        setLoading(false);
      });
    }
  }, [projectId]);

  function update(field: string, value: unknown) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "faName" && !isEdit) next.faSlug = slugify(value as string);
      if (field === "enName" && !isEdit) next.enSlug = slugify(value as string);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        completionDate: form.completionDate ? new Date(form.completionDate) : null,
      };
      const url = isEdit ? `/api/admin/projects/${projectId}` : "/api/admin/projects";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success("ذخیره شد");
      router.push("/admin/projects");
    } catch {
      toast.error("خطا");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="animate-pulse h-96 bg-slate-200 rounded-xl" />;

  return (
    <form onSubmit={handleSubmit}>
      <AdminPageHeader
        title={isEdit ? "ویرایش پروژه" : "پروژه جدید"}
        actions={<Button type="submit" disabled={saving}>{saving ? "..." : "ذخیره"}</Button>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card><CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>نام فارسی</Label><Input value={form.faName} onChange={(e) => update("faName", e.target.value)} required className="mt-1" /></div>
              <div><Label>English Name</Label><Input value={form.enName} onChange={(e) => update("enName", e.target.value)} required className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Slug FA</Label><Input value={form.faSlug} onChange={(e) => update("faSlug", e.target.value)} required className="mt-1" /></div>
              <div><Label>Slug EN</Label><Input value={form.enSlug} onChange={(e) => update("enSlug", e.target.value)} required className="mt-1" /></div>
            </div>
            <BilingualRichText
              faLabel="توضیحات فارسی" enLabel="English Description"
              faValue={form.faDescription} enValue={form.enDescription}
              onFaChange={(v) => update("faDescription", v)} onEnChange={(v) => update("enDescription", v)}
            />
          </CardContent></Card>
        </div>
        <div className="space-y-6">
          <Card><CardContent className="p-6 space-y-4">
            <div><Label>دسته‌بندی</Label>
              <Select value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)} required className="mt-1">
                <option value="">انتخاب...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.faName}</option>)}
              </Select>
            </div>
            <div><Label>کلاینت</Label><Input value={form.client} onChange={(e) => update("client", e.target.value)} className="mt-1" /></div>
            <div><Label>وضعیت</Label>
              <Select value={form.status} onChange={(e) => update("status", e.target.value)} className="mt-1">
                <option value="COMPLETED">تکمیل شده</option>
                <option value="IN_PROGRESS">در حال انجام</option>
                <option value="PLANNED">برنامه‌ریزی شده</option>
              </Select>
            </div>
            <div><Label>تاریخ تکمیل</Label><Input type="date" value={form.completionDate} onChange={(e) => update("completionDate", e.target.value)} className="mt-1" /></div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} />
              منتشر شده
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} />
              نمایش در صفحه اصلی
            </label>
            <TagsInput value={form.technologies} onChange={(v) => update("technologies", v)} label="تکنولوژی‌ها" />
            <ImagePicker value={form.thumbnail} onChange={(v) => update("thumbnail", v)} />
          </CardContent></Card>
        </div>
      </div>
    </form>
  );
}
