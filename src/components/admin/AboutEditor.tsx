"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { AdminCard, AdminLoading } from "@/components/admin/AdminCard";
import { FormInput, FormTextarea } from "@/components/admin/FormField";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import ImagePicker from "@/components/admin/ImagePicker";
import BilingualRichText from "@/components/admin/BilingualRichText";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { updateById, updateNested } from "@/lib/admin/form-utils";

export default function AboutEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  async function reload() {
    setData(await fetch("/api/admin/about").then((r) => r.json()));
  }

  useEffect(() => { reload(); }, []);

  async function save(section: string, sectionData: unknown) {
    setSaving(true);
    try {
      await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: sectionData }),
      });
      toast.success("ذخیره شد");
      await reload();
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
    await reload();
  }

  if (!data) return <AdminLoading />;

  const storyKeys = ["faTitle", "enTitle", "faParagraph1", "enParagraph1", "faParagraph2", "enParagraph2", "faParagraph3", "enParagraph3"];

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
          <AdminCard title="داستان شرکت">
            <div className="space-y-4">
              {storyKeys.map((key) =>
                key.includes("Paragraph") ? (
                  <FormTextarea key={key} label={key} value={data.story[key]} onChange={(v) => setData({ ...data, story: updateNested(data.story, { [key]: v }) })} />
                ) : (
                  <FormInput key={key} label={key} value={data.story[key]} onChange={(v) => setData({ ...data, story: updateNested(data.story, { [key]: v }) })} />
                ),
              )}
              <Button onClick={() => save("story", data.story)} disabled={saving}>ذخیره</Button>
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="stats" className="space-y-3">
          {data.stats.map((s: any) => (
            <AdminCard key={s.id} title={s.value} actions={<ConfirmDelete onConfirm={() => remove("stat", s.id)} />}>
              <div className="flex flex-wrap gap-4 items-end">
                <FormInput label="value" value={s.value} onChange={(v) => setData({ ...data, stats: updateById(data.stats, s.id, { value: v }) })} />
                <FormInput label="faLabel" value={s.faLabel} onChange={(v) => setData({ ...data, stats: updateById(data.stats, s.id, { faLabel: v }) })} />
                <FormInput label="enLabel" value={s.enLabel} onChange={(v) => setData({ ...data, stats: updateById(data.stats, s.id, { enLabel: v }) })} />
                <Button size="sm" onClick={() => save("stat", s)}>ذخیره</Button>
              </div>
            </AdminCard>
          ))}
          <Button variant="outline" onClick={() => save("stat", { value: "0", faLabel: "", enLabel: "", order: data.stats.length })}><Plus className="h-4 w-4 ml-2" />آمار جدید</Button>
        </TabsContent>

        <TabsContent value="values" className="space-y-3">
          {data.values.map((v: any) => (
            <AdminCard key={v.id} title={v.faTitle || "ارزش"} actions={<ConfirmDelete onConfirm={() => remove("value", v.id)} />}>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="faTitle" value={v.faTitle} onChange={(val) => setData({ ...data, values: updateById(data.values, v.id, { faTitle: val }) })} />
                  <FormInput label="enTitle" value={v.enTitle} onChange={(val) => setData({ ...data, values: updateById(data.values, v.id, { enTitle: val }) })} />
                </div>
                <FormTextarea label="faDescription" value={v.faDescription} onChange={(val) => setData({ ...data, values: updateById(data.values, v.id, { faDescription: val }) })} />
                <Button size="sm" onClick={() => save("value", v)}>ذخیره</Button>
              </div>
            </AdminCard>
          ))}
          <Button variant="outline" onClick={() => save("value", { faTitle: "", enTitle: "", faDescription: "", enDescription: "", order: data.values.length })}><Plus className="h-4 w-4 ml-2" />ارزش جدید</Button>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          {data.teamMembers.map((m: any) => (
            <AdminCard key={m.id} title={m.name || "عضو تیم"} actions={<ConfirmDelete onConfirm={() => remove("teamMember", m.id)} />}>
              <div className="space-y-3">
                <FormInput label="name" value={m.name} onChange={(v) => setData({ ...data, teamMembers: updateById(data.teamMembers, m.id, { name: v }) })} />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="faRole" value={m.faRole} onChange={(v) => setData({ ...data, teamMembers: updateById(data.teamMembers, m.id, { faRole: v }) })} />
                  <FormInput label="enRole" value={m.enRole} onChange={(v) => setData({ ...data, teamMembers: updateById(data.teamMembers, m.id, { enRole: v }) })} />
                </div>
                <BilingualRichText faValue={m.faBio ?? ""} enValue={m.enBio ?? ""} onFaChange={(v) => setData({ ...data, teamMembers: updateById(data.teamMembers, m.id, { faBio: v }) })} onEnChange={(v) => setData({ ...data, teamMembers: updateById(data.teamMembers, m.id, { enBio: v }) })} />
                <ImagePicker value={m.image} onChange={(v) => setData({ ...data, teamMembers: updateById(data.teamMembers, m.id, { image: v }) })} />
                <div className="grid grid-cols-3 gap-3">
                  <FormInput label="linkedin" value={m.linkedin ?? ""} onChange={(v) => setData({ ...data, teamMembers: updateById(data.teamMembers, m.id, { linkedin: v }) })} />
                  <FormInput label="twitter" value={m.twitter ?? ""} onChange={(v) => setData({ ...data, teamMembers: updateById(data.teamMembers, m.id, { twitter: v }) })} />
                  <FormInput label="github" value={m.github ?? ""} onChange={(v) => setData({ ...data, teamMembers: updateById(data.teamMembers, m.id, { github: v }) })} />
                </div>
                <Button size="sm" onClick={() => save("teamMember", m)}>ذخیره</Button>
              </div>
            </AdminCard>
          ))}
          <Button variant="outline" onClick={() => save("teamMember", { name: "", faRole: "", enRole: "", isActive: true, order: data.teamMembers.length })}><Plus className="h-4 w-4 ml-2" />عضو جدید</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
