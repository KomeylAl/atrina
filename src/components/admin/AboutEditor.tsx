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
  const valuesSection = data.valuesSection ?? { faTitle: "ارزش‌های ما", enTitle: "Our Values" };
  const teamSection = data.teamSection ?? { faTitle: "", enTitle: "", faSubtitle: "", enSubtitle: "" };
  const cta = data.cta ?? { faTitle: "", enTitle: "", faDescription: "", enDescription: "", faEmailLabel: "", enEmailLabel: "" };

  return (
    <div>
      <AdminPageHeader title="مدیریت درباره ما" />
      <Tabs defaultValue="story" dir="rtl">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="story">داستان</TabsTrigger>
          <TabsTrigger value="stats">آمار</TabsTrigger>
          <TabsTrigger value="values">ارزش‌ها</TabsTrigger>
          <TabsTrigger value="team">تیم</TabsTrigger>
          <TabsTrigger value="cta">دعوت به تیم</TabsTrigger>
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

        <TabsContent value="values" className="space-y-4">
          <AdminCard title="عنوان بخش ارزش‌ها">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="عنوان فارسی"
                  value={valuesSection.faTitle}
                  onChange={(v) => setData({ ...data, valuesSection: updateNested(valuesSection, { faTitle: v }) })}
                />
                <FormInput
                  label="عنوان انگلیسی"
                  value={valuesSection.enTitle}
                  onChange={(v) => setData({ ...data, valuesSection: updateNested(valuesSection, { enTitle: v }) })}
                />
              </div>
              <Button size="sm" onClick={() => save("valuesSection", data.valuesSection ?? valuesSection)} disabled={saving}>ذخیره عنوان</Button>
            </div>
          </AdminCard>

          {data.values.map((v: any) => (
            <AdminCard key={v.id} title={v.faTitle || "ارزش"} actions={<ConfirmDelete onConfirm={() => remove("value", v.id)} />}>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="faTitle" value={v.faTitle} onChange={(val) => setData({ ...data, values: updateById(data.values, v.id, { faTitle: val }) })} />
                  <FormInput label="enTitle" value={v.enTitle} onChange={(val) => setData({ ...data, values: updateById(data.values, v.id, { enTitle: val }) })} />
                </div>
                <FormTextarea label="faDescription" value={v.faDescription} onChange={(val) => setData({ ...data, values: updateById(data.values, v.id, { faDescription: val }) })} />
                <FormTextarea label="enDescription" value={v.enDescription} onChange={(val) => setData({ ...data, values: updateById(data.values, v.id, { enDescription: val }) })} />
                <Button size="sm" onClick={() => save("value", v)}>ذخیره</Button>
              </div>
            </AdminCard>
          ))}
          <Button variant="outline" onClick={() => save("value", { faTitle: "", enTitle: "", faDescription: "", enDescription: "", order: data.values.length })}><Plus className="h-4 w-4 ml-2" />ارزش جدید</Button>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <AdminCard title="عنوان و زیرعنوان بخش تیم">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="عنوان فارسی"
                  value={teamSection.faTitle}
                  onChange={(v) => setData({ ...data, teamSection: updateNested(teamSection, { faTitle: v }) })}
                />
                <FormInput
                  label="عنوان انگلیسی"
                  value={teamSection.enTitle}
                  onChange={(v) => setData({ ...data, teamSection: updateNested(teamSection, { enTitle: v }) })}
                />
              </div>
              <FormTextarea
                label="زیرعنوان فارسی"
                value={teamSection.faSubtitle}
                onChange={(v) => setData({ ...data, teamSection: updateNested(teamSection, { faSubtitle: v }) })}
              />
              <FormTextarea
                label="زیرعنوان انگلیسی"
                value={teamSection.enSubtitle}
                onChange={(v) => setData({ ...data, teamSection: updateNested(teamSection, { enSubtitle: v }) })}
              />
              <Button size="sm" onClick={() => save("teamSection", data.teamSection ?? teamSection)} disabled={saving}>ذخیره عنوان بخش</Button>
            </div>
          </AdminCard>

          {data.teamMembers.map((m: any) => (
            <AdminCard key={m.id} title={m.faName || m.enName || "عضو تیم"} actions={<ConfirmDelete onConfirm={() => remove("teamMember", m.id)} />}>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="نام فارسی" value={m.faName ?? ""} onChange={(v) => setData({ ...data, teamMembers: updateById(data.teamMembers, m.id, { faName: v }) })} />
                  <FormInput label="نام انگلیسی" value={m.enName ?? ""} onChange={(v) => setData({ ...data, teamMembers: updateById(data.teamMembers, m.id, { enName: v }) })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="سمت فارسی" value={m.faRole} onChange={(v) => setData({ ...data, teamMembers: updateById(data.teamMembers, m.id, { faRole: v }) })} />
                  <FormInput label="سمت انگلیسی" value={m.enRole} onChange={(v) => setData({ ...data, teamMembers: updateById(data.teamMembers, m.id, { enRole: v }) })} />
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
          <Button variant="outline" onClick={() => save("teamMember", { faName: "", enName: "", faRole: "", enRole: "", isActive: true, order: data.teamMembers.length })}><Plus className="h-4 w-4 ml-2" />عضو جدید</Button>
        </TabsContent>

        <TabsContent value="cta">
          <AdminCard title="بخش دعوت به تیم">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="عنوان فارسی"
                  value={cta.faTitle}
                  onChange={(v) => setData({ ...data, cta: updateNested(cta, { faTitle: v }) })}
                />
                <FormInput
                  label="عنوان انگلیسی"
                  value={cta.enTitle}
                  onChange={(v) => setData({ ...data, cta: updateNested(cta, { enTitle: v }) })}
                />
              </div>
              <FormTextarea
                label="توضیح فارسی"
                value={cta.faDescription}
                onChange={(v) => setData({ ...data, cta: updateNested(cta, { faDescription: v }) })}
              />
              <FormTextarea
                label="توضیح انگلیسی"
                value={cta.enDescription}
                onChange={(v) => setData({ ...data, cta: updateNested(cta, { enDescription: v }) })}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="متن دکمه / ایمیل (فارسی)"
                  value={cta.faEmailLabel}
                  onChange={(v) => setData({ ...data, cta: updateNested(cta, { faEmailLabel: v }) })}
                />
                <FormInput
                  label="متن دکمه / ایمیل (انگلیسی)"
                  value={cta.enEmailLabel}
                  onChange={(v) => setData({ ...data, cta: updateNested(cta, { enEmailLabel: v }) })}
                />
              </div>
              <p className="text-sm text-slate-500">آدرس ایمیل استخدام از تنظیمات سایت (careersEmail) خوانده می‌شود.</p>
              <Button onClick={() => save("cta", data.cta ?? cta)} disabled={saving}>ذخیره</Button>
            </div>
          </AdminCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
