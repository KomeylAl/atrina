"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function SettingsPage() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setData);
  }, []);

  async function save(section: string, sectionData: unknown) {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: sectionData }),
      });
      toast.success("ذخیره شد");
      setData(await fetch("/api/admin/settings").then((r) => r.json()));
    } catch {
      toast.error("خطا");
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <div className="animate-pulse h-96 bg-slate-200 rounded-xl" />;

  return (
    <div>
      <AdminPageHeader title="تنظیمات سایت" />

      <Tabs defaultValue="site" dir="rtl">
        <TabsList className="mb-6">
          <TabsTrigger value="site">تنظیمات عمومی</TabsTrigger>
          <TabsTrigger value="nav">منو</TabsTrigger>
          <TabsTrigger value="pages">متای صفحات</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <Card><CardContent className="p-6 space-y-4">
            {data.settings && Object.entries(data.settings).filter(([k]) => k !== "id" && k !== "updatedAt").map(([key, val]) => (
              <div key={key}>
                <Label>{key}</Label>
                {String(val).length > 80 ? (
                  <Textarea value={val as string} onChange={(e) => setData({ ...data, settings: { ...data.settings, [key]: e.target.value } })} className="mt-1" rows={3} />
                ) : (
                  <Input value={val as string} onChange={(e) => setData({ ...data, settings: { ...data.settings, [key]: e.target.value } })} className="mt-1" />
                )}
              </div>
            ))}
            <Button onClick={() => save("settings", data.settings)} disabled={saving}>ذخیره</Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="nav">
          {data.navLinks.map((link: any) => (
            <Card key={link.id} className="mb-3"><CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
              <Input value={link.faName} placeholder="faName" onChange={(e) => { link.faName = e.target.value; setData({ ...data }); }} />
              <Input value={link.enName} placeholder="enName" onChange={(e) => { link.enName = e.target.value; setData({ ...data }); }} />
              <Input value={link.path} placeholder="path" onChange={(e) => { link.path = e.target.value; setData({ ...data }); }} />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => save("navLink", link)}>ذخیره</Button>
                <ConfirmDelete onConfirm={async () => {
                  await fetch("/api/admin/settings", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: link.id }) });
                  setData(await fetch("/api/admin/settings").then((r) => r.json()));
                }} />
              </div>
            </CardContent></Card>
          ))}
          <Button variant="outline" onClick={() => save("navLink", { faName: "", enName: "", path: "/", order: data.navLinks.length })}><Plus className="h-4 w-4 ml-2" />لینک جدید</Button>
        </TabsContent>

        <TabsContent value="pages">
          {data.pageMeta.map((meta: any) => (
            <Card key={meta.id} className="mb-4">
              <CardHeader><CardTitle className="text-base">{meta.id}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input value={meta.faTitle} placeholder="faTitle" onChange={(e) => { meta.faTitle = e.target.value; setData({ ...data }); }} />
                <Input value={meta.enTitle} placeholder="enTitle" onChange={(e) => { meta.enTitle = e.target.value; setData({ ...data }); }} />
                <Textarea value={meta.faDescription} placeholder="faDescription" onChange={(e) => { meta.faDescription = e.target.value; setData({ ...data }); }} />
                <Textarea value={meta.enDescription} placeholder="enDescription" onChange={(e) => { meta.enDescription = e.target.value; setData({ ...data }); }} />
                <Button size="sm" onClick={() => save("pageMeta", meta)}>ذخیره</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
