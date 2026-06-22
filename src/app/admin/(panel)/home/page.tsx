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
import { Plus, Trash2 } from "lucide-react";

export default function HomeEditorPage() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/home").then((r) => r.json()).then(setData);
  }, []);

  async function save(section: string, sectionData: unknown) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: sectionData }),
      });
      if (!res.ok) throw new Error();
      toast.success("ذخیره شد");
      const refreshed = await fetch("/api/admin/home").then((r) => r.json());
      setData(refreshed);
    } catch {
      toast.error("خطا");
    } finally {
      setSaving(false);
    }
  }

  async function remove(section: string, id: string) {
    await fetch("/api/admin/home", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, id }),
    });
    const refreshed = await fetch("/api/admin/home").then((r) => r.json());
    setData(refreshed);
  }

  if (!data) return <div className="animate-pulse h-96 bg-slate-200 rounded-xl" />;

  const Field = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div><Label>{label}</Label><Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1" /></div>
  );

  const TextAreaField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div><Label>{label}</Label><Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-1" /></div>
  );

  return (
    <div>
      <AdminPageHeader title="مدیریت صفحه اصلی" description="Hero، ویژگی‌ها، مهارت‌ها و CTA" />

      <Tabs defaultValue="hero" dir="rtl">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="features">ویژگی‌ها</TabsTrigger>
          <TabsTrigger value="skills">مهارت‌ها</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card><CardContent className="p-6 space-y-4">
            {Object.entries(data.hero).filter(([k]) => k.startsWith("fa") || k.startsWith("en") || k.includes("Href")).map(([key, val]) => (
              key.includes("Description") ? (
                <TextAreaField key={key} label={key} value={val as string} onChange={(v) => setData({ ...data, hero: { ...data.hero, [key]: v } })} />
              ) : (
                <Field key={key} label={key} value={val as string} onChange={(v) => setData({ ...data, hero: { ...data.hero, [key]: v } })} />
              )
            ))}
            <Button onClick={() => save("hero", data.hero)} disabled={saving}>ذخیره Hero</Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="features">
          <Card className="mb-4"><CardContent className="p-6 space-y-4">
            <Field label="faTitle" value={data.featuresSection.faTitle} onChange={(v) => setData({ ...data, featuresSection: { ...data.featuresSection, faTitle: v } })} />
            <Field label="enTitle" value={data.featuresSection.enTitle} onChange={(v) => setData({ ...data, featuresSection: { ...data.featuresSection, enTitle: v } })} />
            <TextAreaField label="faDescription" value={data.featuresSection.faDescription} onChange={(v) => setData({ ...data, featuresSection: { ...data.featuresSection, faDescription: v } })} />
            <Button onClick={() => save("featuresSection", data.featuresSection)} disabled={saving}>ذخیره عنوان بخش</Button>
          </CardContent></Card>
          {data.features.map((f: any, i: number) => (
            <Card key={f.id} className="mb-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">ویژگی {i + 1}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => remove("feature", f.id)}><Trash2 className="h-3 w-3" /></Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <Field label="icon" value={f.icon} onChange={(v) => { f.icon = v; setData({ ...data }); }} />
                <Field label="faTitle" value={f.faTitle} onChange={(v) => { f.faTitle = v; setData({ ...data }); }} />
                <Field label="enTitle" value={f.enTitle} onChange={(v) => { f.enTitle = v; setData({ ...data }); }} />
                <TextAreaField label="faDescription" value={f.faDescription} onChange={(v) => { f.faDescription = v; setData({ ...data }); }} />
                <Button size="sm" onClick={() => save("feature", f)}>ذخیره</Button>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" onClick={() => save("feature", { icon: "Code", faTitle: "", enTitle: "", faDescription: "", enDescription: "", order: data.features.length })}>
            <Plus className="h-4 w-4 ml-2" />افزودن ویژگی
          </Button>
        </TabsContent>

        <TabsContent value="skills">
          <Card className="mb-4"><CardContent className="p-6 space-y-4">
            <Field label="faTitle" value={data.skillsSection.faTitle} onChange={(v) => setData({ ...data, skillsSection: { ...data.skillsSection, faTitle: v } })} />
            <Field label="enTitle" value={data.skillsSection.enTitle} onChange={(v) => setData({ ...data, skillsSection: { ...data.skillsSection, enTitle: v } })} />
            <Button onClick={() => save("skillsSection", data.skillsSection)} disabled={saving}>ذخیره</Button>
          </CardContent></Card>
          {data.skillBars.map((b: any) => (
            <Card key={b.id} className="mb-3"><CardContent className="p-4 flex gap-4 items-end">
              <Field label="faName" value={b.faName} onChange={(v) => { b.faName = v; setData({ ...data }); }} />
              <Field label="level" value={String(b.level)} onChange={(v) => { b.level = parseInt(v); setData({ ...data }); }} />
              <Button size="sm" onClick={() => save("skillBar", b)}>ذخیره</Button>
              <ConfirmDelete onConfirm={() => remove("skillBar", b.id)} />
            </CardContent></Card>
          ))}
          <Button variant="outline" className="mt-2" onClick={() => save("skillBar", { faName: "", enName: "", level: 50, order: data.skillBars.length })}><Plus className="h-4 w-4 ml-2" />مهارت جدید</Button>
        </TabsContent>

        <TabsContent value="cta">
          <Card><CardContent className="p-6 space-y-4">
            {Object.entries(data.cta).filter(([k]) => k !== "id").map(([key, val]) => (
              key.includes("Description") ? (
                <TextAreaField key={key} label={key} value={val as string} onChange={(v) => setData({ ...data, cta: { ...data.cta, [key]: v } })} />
              ) : (
                <Field key={key} label={key} value={val as string} onChange={(v) => setData({ ...data, cta: { ...data.cta, [key]: v } })} />
              )
            ))}
            <Button onClick={() => save("cta", data.cta)} disabled={saving}>ذخیره CTA</Button>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
