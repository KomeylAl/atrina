"use client";

import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";

const RichTextEditor = dynamic(
  () => import("@/components/common/rich-text-editor"),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" /> },
);

interface BilingualRichTextProps {
  faLabel?: string;
  enLabel?: string;
  faValue: string;
  enValue: string;
  onFaChange: (v: string) => void;
  onEnChange: (v: string) => void;
}

export default function BilingualRichText({
  faLabel = "محتوای فارسی",
  enLabel = "English Content",
  faValue,
  enValue,
  onFaChange,
  onEnChange,
}: BilingualRichTextProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">{faLabel}</Label>
        <RichTextEditor content={faValue} onChange={onFaChange} />
      </div>
      <div>
        <Label className="mb-2 block">{enLabel}</Label>
        <RichTextEditor content={enValue} onChange={onEnChange} />
      </div>
    </div>
  );
}
