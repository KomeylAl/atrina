"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { AdminCard, AdminLoading } from "@/components/admin/AdminCard";
import { FormInput, FormTextarea } from "@/components/admin/FormField";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import ImagePicker from "@/components/admin/ImagePicker";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { updateById, updateNested } from "@/lib/admin/form-utils";

const SOCIAL_PLATFORMS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "telegram", label: "Telegram" },
  { value: "x", label: "X / Twitter" },
  { value: "github", label: "GitHub" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
];

const SETTINGS_LABELS: Record<string, string> = {
  faLogo: "لوگو (فارسی)",
  enLogo: "لوگو (انگلیسی)",
  faFooterDescription: "توضیح فوتر (فارسی)",
  enFooterDescription: "توضیح فوتر (انگلیسی)",
  faFooterCopyright: "کپی‌رایت (فارسی)",
  enFooterCopyright: "کپی‌رایت (انگلیسی)",
  faFooterLinksTitle: "عنوان لینک‌های سریع (فارسی)",
  enFooterLinksTitle: "عنوان لینک‌های سریع (انگلیسی)",
  faFooterContactTitle: "عنوان تماس فوتر (فارسی)",
  enFooterContactTitle: "عنوان تماس فوتر (انگلیسی)",
  careersEmail: "ایمیل استخدام",
};

export default function SettingsEditor() {
  const [data, setData] = useState<any>(null);

  async function reload() {
    setData(await fetch("/api/admin/settings").then((r) => r.json()));
  }

  useEffect(() => { reload(); }, []);

  async function save(section: string, sectionData: unknown) {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, data: sectionData }),
    });
    toast.success("ذخیره شد");
    await reload();
  }

  async function remove(section: string, id: string) {
    await fetch("/api/admin/settings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, id }),
    });
    await reload();
  }

  if (!data) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader title="تنظیمات سایت" />
      <Tabs defaultValue="site" dir="rtl">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="site">عمومی و فوتر</TabsTrigger>
          <TabsTrigger value="social">شبکه‌های اجتماعی</TabsTrigger>
          <TabsTrigger value="trust">نمادهای اعتماد</TabsTrigger>
          <TabsTrigger value="nav">منو</TabsTrigger>
          <TabsTrigger value="pages">متای صفحات</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <AdminCard title="تنظیمات عمومی و فوتر">
            <div className="space-y-4">
              {data.settings && Object.entries(data.settings).filter(([k]) => k !== "id" && k !== "updatedAt").map(([key, val]) => (
                String(val).length > 80 ? (
                  <FormTextarea key={key} label={SETTINGS_LABELS[key] ?? key} value={String(val)} onChange={(v) => setData({ ...data, settings: updateNested(data.settings, { [key]: v }) })} />
                ) : (
                  <FormInput key={key} label={SETTINGS_LABELS[key] ?? key} value={String(val)} onChange={(v) => setData({ ...data, settings: updateNested(data.settings, { [key]: v }) })} />
                )
              ))}
              <Button onClick={() => save("settings", data.settings)}>ذخیره</Button>
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="social" className="space-y-3">
          {(data.socialLinks ?? []).map((link: any) => (
            <AdminCard key={link.id} title={link.platform || "شبکه اجتماعی"} actions={<ConfirmDelete onConfirm={() => remove("socialLink", link.id)} />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <Label className="mb-1.5 block">پلتفرم</Label>
                  <Select
                    value={link.platform}
                    onChange={(e) => setData({ ...data, socialLinks: updateById(data.socialLinks, link.id, { platform: e.target.value }) })}
                  >
                    {SOCIAL_PLATFORMS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </Select>
                </div>
                <FormInput label="آدرس URL" value={link.url} onChange={(v) => setData({ ...data, socialLinks: updateById(data.socialLinks, link.id, { url: v }) })} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => save("socialLink", link)}>ذخیره</Button>
                </div>
              </div>
            </AdminCard>
          ))}
          <Button
            variant="outline"
            onClick={() => save("socialLink", { platform: "linkedin", url: "", order: (data.socialLinks?.length ?? 0), isActive: true })}
          >
            <Plus className="h-4 w-4 ml-2" />
            افزودن شبکه اجتماعی
          </Button>
        </TabsContent>

        <TabsContent value="trust" className="space-y-3">
          {(data.trustBadges ?? []).map((badge: any) => (
            <AdminCard key={badge.id} title={badge.faAlt || badge.enAlt || "نماد اعتماد"} actions={<ConfirmDelete onConfirm={() => remove("trustBadge", badge.id)} />}>
              <div className="space-y-3">
                <ImagePicker
                  label="تصویر نماد"
                  value={badge.image}
                  onChange={(v) => setData({ ...data, trustBadges: updateById(data.trustBadges, badge.id, { image: v }) })}
                />
                <FormInput label="لینک (اختیاری)" value={badge.link ?? ""} onChange={(v) => setData({ ...data, trustBadges: updateById(data.trustBadges, badge.id, { link: v || null }) })} />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="متن جایگزین (فارسی)" value={badge.faAlt} onChange={(v) => setData({ ...data, trustBadges: updateById(data.trustBadges, badge.id, { faAlt: v }) })} />
                  <FormInput label="متن جایگزین (انگلیسی)" value={badge.enAlt} onChange={(v) => setData({ ...data, trustBadges: updateById(data.trustBadges, badge.id, { enAlt: v }) })} />
                </div>
                <Button size="sm" onClick={() => save("trustBadge", badge)}>ذخیره</Button>
              </div>
            </AdminCard>
          ))}
          <Button
            variant="outline"
            onClick={() => save("trustBadge", { image: "", link: null, faAlt: "نماد اعتماد الکترونیک", enAlt: "E-Trust Badge", order: (data.trustBadges?.length ?? 0), isActive: true })}
          >
            <Plus className="h-4 w-4 ml-2" />
            افزودن نماد اعتماد
          </Button>
        </TabsContent>

        <TabsContent value="nav" className="space-y-3">
          {data.navLinks.map((link: any) => (
            <AdminCard key={link.id}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <FormInput label="نام فارسی" value={link.faName} onChange={(v) => setData({ ...data, navLinks: updateById(data.navLinks, link.id, { faName: v }) })} />
                <FormInput label="نام انگلیسی" value={link.enName} onChange={(v) => setData({ ...data, navLinks: updateById(data.navLinks, link.id, { enName: v }) })} />
                <FormInput label="مسیر" value={link.path} onChange={(v) => setData({ ...data, navLinks: updateById(data.navLinks, link.id, { path: v }) })} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => save("navLink", link)}>ذخیره</Button>
                  <ConfirmDelete onConfirm={() => remove("navLink", link.id)} />
                </div>
              </div>
            </AdminCard>
          ))}
          <Button variant="outline" onClick={() => save("navLink", { faName: "", enName: "", path: "/", order: data.navLinks.length })}><Plus className="h-4 w-4 ml-2" />لینک جدید</Button>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          {data.pageMeta.map((meta: any) => (
            <AdminCard key={meta.id} title={meta.id}>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="عنوان فارسی" value={meta.faTitle} onChange={(v) => setData({ ...data, pageMeta: updateById(data.pageMeta, meta.id, { faTitle: v }) })} />
                  <FormInput label="عنوان انگلیسی" value={meta.enTitle} onChange={(v) => setData({ ...data, pageMeta: updateById(data.pageMeta, meta.id, { enTitle: v }) })} />
                </div>
                <FormTextarea label="زیرعنوان / توضیح فارسی" value={meta.faDescription} onChange={(v) => setData({ ...data, pageMeta: updateById(data.pageMeta, meta.id, { faDescription: v }) })} />
                <FormTextarea label="زیرعنوان / توضیح انگلیسی" value={meta.enDescription} onChange={(v) => setData({ ...data, pageMeta: updateById(data.pageMeta, meta.id, { enDescription: v }) })} />
                <Button size="sm" onClick={() => save("pageMeta", meta)}>ذخیره</Button>
              </div>
            </AdminCard>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
