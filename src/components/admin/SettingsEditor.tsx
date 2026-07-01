"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { AdminCard, AdminLoading } from "@/components/admin/AdminCard";
import { FormInput, FormTextarea } from "@/components/admin/FormField";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { updateById, updateNested } from "@/lib/admin/form-utils";

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

  if (!data) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader title="تنظیمات سایت" />
      <Tabs defaultValue="site" dir="rtl">
        <TabsList className="mb-6">
          <TabsTrigger value="site">عمومی</TabsTrigger>
          <TabsTrigger value="nav">منو</TabsTrigger>
          <TabsTrigger value="pages">متای صفحات</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <AdminCard title="تنظیمات عمومی">
            <div className="space-y-4">
              {data.settings && Object.entries(data.settings).filter(([k]) => k !== "id" && k !== "updatedAt").map(([key, val]) => (
                String(val).length > 80 ? (
                  <FormTextarea key={key} label={key} value={String(val)} onChange={(v) => setData({ ...data, settings: updateNested(data.settings, { [key]: v }) })} />
                ) : (
                  <FormInput key={key} label={key} value={String(val)} onChange={(v) => setData({ ...data, settings: updateNested(data.settings, { [key]: v }) })} />
                )
              ))}
              <Button onClick={() => save("settings", data.settings)}>ذخیره</Button>
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="nav" className="space-y-3">
          {data.navLinks.map((link: any) => (
            <AdminCard key={link.id}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <FormInput label="faName" value={link.faName} onChange={(v) => setData({ ...data, navLinks: updateById(data.navLinks, link.id, { faName: v }) })} />
                <FormInput label="enName" value={link.enName} onChange={(v) => setData({ ...data, navLinks: updateById(data.navLinks, link.id, { enName: v }) })} />
                <FormInput label="path" value={link.path} onChange={(v) => setData({ ...data, navLinks: updateById(data.navLinks, link.id, { path: v }) })} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => save("navLink", link)}>ذخیره</Button>
                  <ConfirmDelete onConfirm={async () => {
                    await fetch("/api/admin/settings", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: link.id }) });
                    await reload();
                  }} />
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
                  <FormInput label="faTitle" value={meta.faTitle} onChange={(v) => setData({ ...data, pageMeta: updateById(data.pageMeta, meta.id, { faTitle: v }) })} />
                  <FormInput label="enTitle" value={meta.enTitle} onChange={(v) => setData({ ...data, pageMeta: updateById(data.pageMeta, meta.id, { enTitle: v }) })} />
                </div>
                <FormTextarea label="faDescription" value={meta.faDescription} onChange={(v) => setData({ ...data, pageMeta: updateById(data.pageMeta, meta.id, { faDescription: v }) })} />
                <Button size="sm" onClick={() => save("pageMeta", meta)}>ذخیره</Button>
              </div>
            </AdminCard>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
