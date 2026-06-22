"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import BilingualRichText from "@/components/admin/BilingualRichText";
import ImagePicker from "@/components/admin/ImagePicker";
import { slugify } from "@/lib/admin/slug";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface TaxonomyEditorProps {
  type: "categories" | "tags";
  title: string;
}

export default function TaxonomyEditor({ type, title }: TaxonomyEditorProps) {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const empty = {
    faName: "",
    enName: "",
    faSlug: "",
    enSlug: "",
    faExcerpt: "",
    enExcerpt: "",
    faContent: "",
    enContent: "",
    thumbnail: "/images/blog/default.jpg",
  };

  useEffect(() => {
    fetch(`/api/admin/blog-taxonomy?type=${type}`)
      .then((r) => r.json())
      .then(setItems);
  }, [type]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    try {
      const isNew = !editing.id;
      const url = isNew
        ? `/api/admin/blog-taxonomy?type=${type}`
        : `/api/admin/blog-taxonomy/${editing.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isNew ? editing : { type, ...editing }),
      });

      if (!res.ok) throw new Error();
      toast.success("ذخیره شد");
      const list = await fetch(`/api/admin/blog-taxonomy?type=${type}`).then((r) => r.json());
      setItems(list);
      setEditing(null);
    } catch {
      toast.error("خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/blog-taxonomy/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateField(field: string, value: string) {
    setEditing((prev: any) => {
      const next = { ...prev, [field]: value };
      if (field === "faName" && !prev?.id) next.faSlug = slugify(value);
      if (field === "enName" && !prev?.id) next.enSlug = slugify(value);
      return next;
    });
  }

  return (
    <div>
      <AdminPageHeader
        title={title}
        actions={
          <Button onClick={() => setEditing({ ...empty })}>
            <Plus className="h-4 w-4 ml-2" />
            افزودن
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{item.faName}</p>
                <p className="text-xs text-slate-500">{item.enName}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(item)}>
                  ویرایش
                </Button>
                <ConfirmDelete onConfirm={() => handleDelete(item.id)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editing && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>نام فارسی</Label>
                  <Input value={editing.faName} onChange={(e) => updateField("faName", e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label>English Name</Label>
                  <Input value={editing.enName} onChange={(e) => updateField("enName", e.target.value)} required className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slug FA</Label>
                  <Input value={editing.faSlug} onChange={(e) => updateField("faSlug", e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label>Slug EN</Label>
                  <Input value={editing.enSlug} onChange={(e) => updateField("enSlug", e.target.value)} required className="mt-1" />
                </div>
              </div>
              <BilingualRichText
                faValue={editing.faContent}
                enValue={editing.enContent}
                onFaChange={(v) => updateField("faContent", v)}
                onEnChange={(v) => updateField("enContent", v)}
              />
              <ImagePicker value={editing.thumbnail} onChange={(v) => updateField("thumbnail", v)} />
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? "..." : "ذخیره"}</Button>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>انصراف</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
