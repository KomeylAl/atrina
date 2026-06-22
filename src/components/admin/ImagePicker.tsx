"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageIcon, Upload, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  alt?: string | null;
  mimeType: string;
}

interface ImagePickerProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  multiple?: false;
}

interface GalleryPickerProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  multiple: true;
}

type Props = (ImagePickerProps | GalleryPickerProps) & {
  className?: string;
};

export default function ImagePicker(props: Props) {
  const { label = "تصویر", className } = props;
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isMultiple = props.multiple === true;
  const selectedUrls = isMultiple
    ? (props.value ?? [])
    : props.value
      ? [props.value]
      : [];

  async function loadMedia() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      setMedia(data);
    } catch {
      toast.error("خطا در بارگذاری رسانه‌ها");
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setOpen(true);
    loadMedia();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("upload failed");
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

  function selectImage(url: string) {
    if (isMultiple) {
      const current = props.value ?? [];
      if (current.includes(url)) {
        props.onChange(current.filter((u) => u !== url));
      } else {
        props.onChange([...current, url]);
      }
    } else {
      props.onChange(url);
      setOpen(false);
    }
  }

  function removeImage(url: string) {
    if (isMultiple) {
      props.onChange((props.value ?? []).filter((u) => u !== url));
    } else {
      props.onChange("");
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}

      <div className="flex flex-wrap gap-3">
        {selectedUrls.map((url) => (
          <div
            key={url}
            className="relative h-24 w-24 overflow-hidden rounded-lg border"
          >
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-1 left-1 rounded-full bg-red-500 p-0.5 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleOpen}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700"
        >
          <ImageIcon className="h-6 w-6" />
          <span className="text-xs">انتخاب</span>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>گالری رسانه</DialogTitle>
          </DialogHeader>

          <div className="mb-4">
            <Label htmlFor="media-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 hover:bg-slate-50 dark:hover:bg-slate-800">
                <Upload className="h-5 w-5" />
                <span>{uploading ? "در حال آپلود..." : "آپلود فایل جدید"}</span>
              </div>
              <Input
                id="media-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </Label>
          </div>

          {loading ? (
            <div className="grid grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {media.map((item) => {
                const selected = selectedUrls.includes(item.url);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectImage(item.url)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                      selected
                        ? "border-indigo-500 ring-2 ring-indigo-500/30"
                        : "border-transparent hover:border-slate-300",
                    )}
                  >
                    <img
                      src={item.url}
                      alt={item.alt ?? item.filename}
                      className="h-full w-full object-cover"
                    />
                    {selected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/30">
                        <Check className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {isMultiple && (
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setOpen(false)}>تأیید انتخاب</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
