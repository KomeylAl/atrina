"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

interface WorkFormProps {
  workId?: string;
}

export default function WorkForm({ workId }: WorkFormProps) {
  const router = useRouter();
  const isEdit = !!workId;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; faName: string }>>([]);

  const [form, setForm] = useState({
    faTitle: "", enTitle: "", faSlug: "", enSlug: "",
    faDescription: "", enDescription: "",
    faChallenge: "", enChallenge: "",
    faSolution: "", enSolution: "",
    faResults: "", enResults: "",
    thumbnail: "", galleryImages: [] as string[],
    technologies: [] as string[], categoryId: "",
    isPublished: true, order: 0,
  });

  useEffect(() => {
    fetch("/api/admin/work-categories").then((r) => r.json()).then(setCategories);
    if (workId) {
      fetch(`/api/admin/works/${workId}`).then((r) => r.json()).then((w) => {
        setForm({
          faTitle: w.faTitle, enTitle: w.enTitle, faSlug: w.faSlug, enSlug: w.enSlug,
          faDescription: w.faDescription, enDescription: w.enDescription,
          faChallenge: w.faChallenge ?? "", enChallenge: w.enChallenge ?? "",
          faSolution: w.faSolution ?? "", enSolution: w.enSolution ?? "",
          faResults: w.faResults ?? "", enResults: w.enResults ?? "",
          thumbnail: w.thumbnail ?? "", galleryImages: w.galleryImages ?? [],
          technologies: w.technologies ?? [], categoryId: w.categoryId,
          isPublished: w.isPublished, order: w.order,
        });
        setLoading(false);
      });
    }
  }, [workId]);

  function update(field: string, value: unknown) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "faTitle" && !isEdit) next.faSlug = slugify(value as string);
      if (field === "enTitle" && !isEdit) next.enSlug = slugify(value as string);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/works/${workId}` : "/api/admin/works";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("ذخیره شد");
      router.push("/admin/work");
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
        title={isEdit ? "ویرایش نمونه‌کار" : "نمونه‌کار جدید"}
        actions={<Button type="submit" disabled={saving}>{saving ? "..." : "ذخیره"}</Button>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card><CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>عنوان فارسی</Label><Input value={form.faTitle} onChange={(e) => update("faTitle", e.target.value)} required className="mt-1" /></div>
              <div><Label>English Title</Label><Input value={form.enTitle} onChange={(e) => update("enTitle", e.target.value)} required className="mt-1" /></div>
            </div>
            <BilingualRichText faLabel="توضیحات" enLabel="Description" faValue={form.faDescription} enValue={form.enDescription} onFaChange={(v) => update("faDescription", v)} onEnChange={(v) => update("enDescription", v)} />
            <BilingualRichText faLabel="چالش" enLabel="Challenge" faValue={form.faChallenge} enValue={form.enChallenge} onFaChange={(v) => update("faChallenge", v)} onEnChange={(v) => update("enChallenge", v)} />
            <BilingualRichText faLabel="راه‌حل" enLabel="Solution" faValue={form.faSolution} enValue={form.enSolution} onFaChange={(v) => update("faSolution", v)} onEnChange={(v) => update("enSolution", v)} />
            <BilingualRichText faLabel="نتایج" enLabel="Results" faValue={form.faResults} enValue={form.enResults} onFaChange={(v) => update("faResults", v)} onEnChange={(v) => update("enResults", v)} />
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
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} />
              منتشر شده
            </label>
            <TagsInput value={form.technologies} onChange={(v) => update("technologies", v)} />
            <ImagePicker value={form.thumbnail} onChange={(v) => update("thumbnail", v)} label="تصویر شاخص" />
            <ImagePicker multiple value={form.galleryImages} onChange={(v) => update("galleryImages", v)} label="گالری تصاویر" />
          </CardContent></Card>
        </div>
      </div>
    </form>
  );
}
