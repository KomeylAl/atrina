"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Trash2 } from "lucide-react";
import type { MediaItem } from "@/components/admin/ImagePicker";

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);

  async function loadMedia() {
    const data = await fetch("/api/admin/media").then((r) => r.json());
    setMedia(data);
  }

  useEffect(() => { loadMedia(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        await fetch("/api/admin/media", { method: "POST", body: formData });
      }
      toast.success("آپلود موفق");
      await loadMedia();
    } catch {
      toast.error("خطا در آپلود");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    setMedia((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div>
      <AdminPageHeader
        title="گالری رسانه"
        description="مدیریت و آپلود تصاویر"
        actions={
          <Label htmlFor="media-upload-btn" className="cursor-pointer">
            <div className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
              <Upload className="h-4 w-4" />
              {uploading ? "در حال آپلود..." : "آپلود"}
            </div>
            <Input id="media-upload-btn" type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
          </Label>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.map((item) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl border bg-white dark:bg-slate-900">
            <img src={item.url} alt={item.alt ?? item.filename} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3">
              <div className="flex w-full items-center justify-between">
                <span className="text-xs text-white truncate">{item.filename}</span>
                <button type="button" onClick={() => handleDelete(item.id)} className="rounded-full bg-red-500 p-1.5 text-white">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {media.length === 0 && (
        <div className="text-center py-20 text-slate-500">هنوز رسانه‌ای آپلود نشده</div>
      )}
    </div>
  );
}
