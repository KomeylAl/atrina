"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import BilingualRichText from "@/components/admin/BilingualRichText";
import ImagePicker from "@/components/admin/ImagePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { slugify } from "@/lib/admin/slug";
import { toast } from "sonner";

interface BlogPostFormProps {
  postId?: string;
}

export default function BlogPostForm({ postId }: BlogPostFormProps) {
  const router = useRouter();
  const isEdit = !!postId;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; faName: string }>>([]);
  const [tags, setTags] = useState<Array<{ id: string; faName: string }>>([]);

  const [form, setForm] = useState({
    faTitle: "",
    enTitle: "",
    faSlug: "",
    enSlug: "",
    faExcerpt: "",
    enExcerpt: "",
    faContent: "",
    enContent: "",
    thumbnail: "",
    categoryId: "",
    status: "DRAFT",
    readTime: 5,
    tagIds: [] as string[],
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/blog-taxonomy?type=categories").then((r) => r.json()),
      fetch("/api/admin/blog-taxonomy?type=tags").then((r) => r.json()),
    ]).then(([cats, tgs]) => {
      setCategories(cats);
      setTags(tgs);
    });

    if (postId) {
      fetch(`/api/admin/posts/${postId}`)
        .then((r) => r.json())
        .then((post) => {
          setForm({
            faTitle: post.faTitle,
            enTitle: post.enTitle,
            faSlug: post.faSlug,
            enSlug: post.enSlug,
            faExcerpt: post.faExcerpt,
            enExcerpt: post.enExcerpt,
            faContent: post.faContent,
            enContent: post.enContent,
            thumbnail: post.thumbnail,
            categoryId: post.categoryId,
            status: post.status,
            readTime: post.readTime ?? 5,
            tagIds: post.tags?.map((t: { tagId: string }) => t.tagId) ?? [],
          });
          setLoading(false);
        });
    }
  }, [postId]);

  function updateField(field: string, value: string | number | string[]) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "faTitle" && !isEdit) {
        next.faSlug = slugify(value as string);
      }
      if (field === "enTitle" && !isEdit) {
        next.enSlug = slugify(value as string);
      }
      return next;
    });
  }

  function toggleTag(tagId: string) {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEdit ? `/api/admin/posts/${postId}` : "/api/admin/posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Save failed");
      toast.success(isEdit ? "مقاله به‌روز شد" : "مقاله ایجاد شد");
      router.push("/admin/blog");
      router.refresh();
    } catch {
      toast.error("خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse h-96 bg-slate-200 dark:bg-slate-800 rounded-xl" />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <AdminPageHeader
        title={isEdit ? "ویرایش مقاله" : "مقاله جدید"}
        actions={
          <Button type="submit" disabled={saving}>
            {saving ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>عنوان فارسی</Label>
                  <Input
                    value={form.faTitle}
                    onChange={(e) => updateField("faTitle", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>English Title</Label>
                  <Input
                    value={form.enTitle}
                    onChange={(e) => updateField("enTitle", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slug فارسی</Label>
                  <Input
                    value={form.faSlug}
                    onChange={(e) => updateField("faSlug", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>English Slug</Label>
                  <Input
                    value={form.enSlug}
                    onChange={(e) => updateField("enSlug", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>خلاصه فارسی</Label>
                  <Input
                    value={form.faExcerpt}
                    onChange={(e) => updateField("faExcerpt", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>English Excerpt</Label>
                  <Input
                    value={form.enExcerpt}
                    onChange={(e) => updateField("enExcerpt", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <BilingualRichText
                faValue={form.faContent}
                enValue={form.enContent}
                onFaChange={(v) => updateField("faContent", v)}
                onEnChange={(v) => updateField("enContent", v)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label>وضعیت</Label>
                <Select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="mt-1"
                >
                  <option value="DRAFT">پیش‌نویس</option>
                  <option value="PUBLISHED">منتشر شده</option>
                  <option value="ARCHIVED">آرشیو</option>
                </Select>
              </div>
              <div>
                <Label>دسته‌بندی</Label>
                <Select
                  value={form.categoryId}
                  onChange={(e) => updateField("categoryId", e.target.value)}
                  required
                  className="mt-1"
                >
                  <option value="">انتخاب...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.faName}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>زمان مطالعه (دقیقه)</Label>
                <Input
                  type="number"
                  value={form.readTime}
                  onChange={(e) => updateField("readTime", parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              <ImagePicker
                value={form.thumbnail}
                onChange={(url) => updateField("thumbnail", url)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Label className="mb-3 block">برچسب‌ها</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      form.tagIds.includes(tag.id)
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-slate-300 hover:border-indigo-400"
                    }`}
                  >
                    {tag.faName}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
