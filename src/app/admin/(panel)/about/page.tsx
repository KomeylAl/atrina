"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import ImagePicker from "@/components/admin/ImagePicker";
import BilingualRichText from "@/components/admin/BilingualRichText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function AboutEditorPage() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/about").then((r) => r.json()).then(setData);
  }, []);

  async function save(section: string, sectionData: unknown) {
    setSaving(true);
    try {
      await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: sectionData }),
      });
      toast.success("ذخیره شد");
      setData(await fetch("/api/admin/about").then((r) => r.json()));
    } catch {
      toast.error("خطا");
    } finally {
      setSaving(false);
    }
  }

  async function remove(section: string, id: string) {
    await fetch("/api/admin/about", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, id }),
    });
    setData(await fetch("/api/admin/about").then((r) => r.json()));
  }

  if (!data) return <div className="animate-pulse h-96 bg-slate-200 rounded-xl" />;

  return (
    <div>
      <AdminPageHeader title="مدیریت درباره ما" />

      <Tabs defaultValue="story" dir="rtl">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="story">داستان</TabsTrigger>
          <TabsTrigger value="stats">آمار</TabsTrigger>
          <TabsTrigger value="values">ارزش‌ها</TabsTrigger>
          <TabsTrigger value="team">تیم</TabsTrigger>
        </TabsList>

        <TabsContent value="story">
          <Card><CardContent className="p-6 space-y-4">
            {["faTitle", "enTitle", "faParagraph1", "enParagraph1", "faParagraph2", "enParagraph2", "faParagraph3", "enParagraph3"].map((key) => (
              <div key={key}>
                <Label>{key}</Label>
                {key.includes("Paragraph") ? (
                  <Textarea value={data.story[key]} onChange={(e) => setData({ ...data, story: { ...data.story, [key]: e.target.value } })} className="mt-1" rows={3} />
                ) : (
                  <Input value={data.story[key]} onChange={(e) => setData({ ...data, story: { ...data.story, [key]: e.target.value } })} className="mt-1" />
                )}
              </div>
            ))}
            <Button onClick={() => save("story", data.story)} disabled={saving}>ذخیره</Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="stats">
          {data.stats.map((s: any) => (
            <Card key={s.id} className="mb-3"><CardContent className="p-4 flex gap-4 items-end flex-wrap">
              <div><Label>value</Label><Input value={s.value} onChange={(e) => { s.value = e.target.value; setData({ ...data }); }} className="mt-1 w-24" /></div>
              <div><Label>faLabel</Label><Input value={s.faLabel} onChange={(e) => { s.faLabel = e.target.value; setData({ ...data }); }} className="mt-1" /></div>
              <div><Label>enLabel</Label><Input value={s.enLabel} onChange={(e) => { s.enLabel = e.target.value; setData({ ...data }); }} className="mt-1" /></div>
              <Button size="sm" onClick={() => save("stat", s)}>ذخیره</Button>
              <ConfirmDelete onConfirm={() => remove("stat", s.id)} />
            </CardContent></Card>
          ))}
          <Button variant="outline" onClick={() => save("stat", { value: "0", faLabel: "", enLabel: "", order: data.stats.length })}><Plus className="h-4 w-4 ml-2" />آمار جدید</Button>
        </TabsContent>

        <TabsContent value="values">
          {data.values.map((v: any) => (
            <Card key={v.id} className="mb-3"><CardContent className="p-4 space-y-3">
              <Input value={v.faTitle} placeholder="faTitle" onChange={(e) => { v.faTitle = e.target.value; setData({ ...data }); }} />
              <Input value={v.enTitle} placeholder="enTitle" onChange={(e) => { v.enTitle = e.target.value; setData({ ...data }); }} />
              <Textarea value={v.faDescription} placeholder="faDescription" onChange={(e) => { v.faDescription = e.target.value; setData({ ...data }); }} />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => save("value", v)}>ذخیره</Button>
                <ConfirmDelete onConfirm={() => remove("value", v.id)} />
              </div>
            </CardContent></Card>
          ))}
          <Button variant="outline" onClick={() => save("value", { faTitle: "", enTitle: "", faDescription: "", enDescription: "", order: data.values.length })}><Plus className="h-4 w-4 ml-2" />ارزش جدید</Button>
        </TabsContent>

        <TabsContent value="team">
          <Card className="mb-4"><CardContent className="p-6 space-y-3">
            <Input value={data.teamSection.faTitle} placeholder="faTitle" onChange={(e) => setData({ ...data, teamSection: { ...data.teamSection, faTitle: e.target.value } })} />
            <Input value={data.teamSection.enTitle} placeholder="enTitle" onChange={(e) => setData({ ...data, teamSection: { ...data.teamSection, enTitle: e.target.value } })} />
            <Button onClick={() => save("teamSection", data.teamSection)}>ذخیره عنوان بخش</Button>
          </CardContent></Card>
          {data.teamMembers.map((m: any) => (
            <Card key={m.id} className="mb-4">
              <CardHeader><CardTitle className="text-base">{m.name || "عضو جدید"}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input value={m.name} placeholder="name" onChange={(e) => { m.name = e.target.value; setData({ ...data }); }} />
                <div className="grid grid-cols-2 gap-3">
                  <Input value={m.faRole} placeholder="faRole" onChange={(e) => { m.faRole = e.target.value; setData({ ...data }); }} />
                  <Input value={m.enRole} placeholder="enRole" onChange={(e) => { m.enRole = e.target.value; setData({ ...data }); }} />
                </div>
                <BilingualRichText faLabel="bio FA" enLabel="bio EN" faValue={m.faBio ?? ""} enValue={m.enBio ?? ""} onFaChange={(v) => { m.faBio = v; setData({ ...data }); }} onEnChange={(v) => { m.enBio = v; setData({ ...data }); }} />
                <ImagePicker value={m.image} onChange={(v) => { m.image = v; setData({ ...data }); }} />
                <div className="grid grid-cols-3 gap-3">
                  <Input value={m.linkedin ?? ""} placeholder="linkedin" onChange={(e) => { m.linkedin = e.target.value; setData({ ...data }); }} />
                  <Input value={m.twitter ?? ""} placeholder="twitter" onChange={(e) => { m.twitter = e.target.value; setData({ ...data }); }} />
                  <Input value={m.github ?? ""} placeholder="github" onChange={(e) => { m.github = e.target.value; setData({ ...data }); }} />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={m.isActive} onChange={(e) => { m.isActive = e.target.checked; setData({ ...data }); }} />
                  فعال
                </label>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => save("teamMember", m)}>ذخیره</Button>
                  <ConfirmDelete onConfirm={() => remove("teamMember", m.id)} />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" onClick={() => save("teamMember", { name: "", faRole: "", enRole: "", isActive: true, order: data.teamMembers.length })}><Plus className="h-4 w-4 ml-2" />عضو جدید</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
