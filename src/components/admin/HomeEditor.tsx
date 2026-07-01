"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { AdminCard, AdminLoading } from "@/components/admin/AdminCard";
import { FormInput, FormTextarea } from "@/components/admin/FormField";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import ImagePicker from "@/components/admin/ImagePicker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { updateById, updateNested } from "@/lib/admin/form-utils";

type HomeData = {
  heroSlides: any[];
  featuresSection: any;
  features: any[];
  skillsSection: any;
  skillBars: any[];
  skillItems: any[];
  cta: any;
  postsSection: any;
  projectsSection: any;
};

const SLIDE_FIELDS = [
  ["faBadge", "enBadge"],
  ["faTitleTop", "enTitleTop"],
  ["faTitleBottom", "enTitleBottom"],
  ["faDescription", "enDescription"],
  ["faLinkOneText", "enLinkOneText"],
  ["faLinkTwoText", "enLinkTwoText"],
  ["linkOneHref", "linkTwoHref"],
] as const;

export default function HomeEditor() {
  const [data, setData] = useState<HomeData | null>(null);
  const [saving, setSaving] = useState(false);

  async function reload() {
    const res = await fetch("/api/admin/home");
    setData(await res.json());
  }

  useEffect(() => {
    reload();
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
      await reload();
    } catch {
      toast.error("خطا در ذخیره");
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
    await reload();
  }

  if (!data) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader title="مدیریت صفحه اصلی" description="اسلایدر Hero، ویژگی‌ها، مهارت‌ها و بخش‌های ویترین" />

      <Tabs defaultValue="slides" dir="rtl">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="slides">اسلایدر Hero</TabsTrigger>
          <TabsTrigger value="features">ویژگی‌ها</TabsTrigger>
          <TabsTrigger value="skills">مهارت‌ها</TabsTrigger>
          <TabsTrigger value="showcase">ویترین</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
        </TabsList>

        <TabsContent value="slides" className="space-y-4">
          {data.heroSlides.map((slide, i) => (
            <AdminCard key={slide.id} title={`اسلاید ${i + 1}`} actions={
              <ConfirmDelete onConfirm={() => remove("heroSlide", slide.id)} />
            }>
              <div className="space-y-4">
                {SLIDE_FIELDS.map(([fa, en]) =>
                  fa.includes("Description") ? (
                    <div key={fa} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormTextarea label={fa} value={slide[fa] ?? ""} onChange={(v) => setData({ ...data, heroSlides: updateById(data.heroSlides, slide.id, { [fa]: v }) })} />
                      <FormTextarea label={en} value={slide[en] ?? ""} onChange={(v) => setData({ ...data, heroSlides: updateById(data.heroSlides, slide.id, { [en]: v }) })} />
                    </div>
                  ) : (
                    <div key={fa} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput label={fa} value={slide[fa] ?? ""} onChange={(v) => setData({ ...data, heroSlides: updateById(data.heroSlides, slide.id, { [fa]: v }) })} />
                      <FormInput label={en} value={slide[en] ?? ""} onChange={(v) => setData({ ...data, heroSlides: updateById(data.heroSlides, slide.id, { [en]: v }) })} />
                    </div>
                  ),
                )}
                <ImagePicker value={slide.image} onChange={(v) => setData({ ...data, heroSlides: updateById(data.heroSlides, slide.id, { image: v }) })} label="تصویر اسلاید" />
                <Button size="sm" onClick={() => save("heroSlide", slide)} disabled={saving}>ذخیره اسلاید</Button>
              </div>
            </AdminCard>
          ))}
          <Button variant="outline" onClick={() => save("heroSlide", {
            faBadge: "", enBadge: "", faTitleTop: "", enTitleTop: "",
            faTitleBottom: "", enTitleBottom: "", faDescription: "", enDescription: "",
            faLinkOneText: "مشاهده", enLinkOneText: "View", faLinkTwoText: "درباره", enLinkTwoText: "About",
            linkOneHref: "/projects", linkTwoHref: "/about", order: data.heroSlides.length, isActive: true,
          })}>
            <Plus className="h-4 w-4 ml-2" />اسلاید جدید
          </Button>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <AdminCard title="عنوان بخش">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="faTitle" value={data.featuresSection.faTitle} onChange={(v) => setData({ ...data, featuresSection: updateNested(data.featuresSection, { faTitle: v }) })} />
                <FormInput label="enTitle" value={data.featuresSection.enTitle} onChange={(v) => setData({ ...data, featuresSection: updateNested(data.featuresSection, { enTitle: v }) })} />
              </div>
              <Button size="sm" onClick={() => save("featuresSection", data.featuresSection)} disabled={saving}>ذخیره</Button>
            </div>
          </AdminCard>
          {data.features.map((f, i) => (
            <AdminCard key={f.id} title={`ویژگی ${i + 1}`} actions={<ConfirmDelete onConfirm={() => remove("feature", f.id)} />}>
              <div className="space-y-3">
                <FormInput label="icon" value={f.icon} onChange={(v) => setData({ ...data, features: updateById(data.features, f.id, { icon: v }) })} />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="faTitle" value={f.faTitle} onChange={(v) => setData({ ...data, features: updateById(data.features, f.id, { faTitle: v }) })} />
                  <FormInput label="enTitle" value={f.enTitle} onChange={(v) => setData({ ...data, features: updateById(data.features, f.id, { enTitle: v }) })} />
                </div>
                <Button size="sm" onClick={() => save("feature", f)}>ذخیره</Button>
              </div>
            </AdminCard>
          ))}
          <Button variant="outline" onClick={() => save("feature", { icon: "Code", faTitle: "", enTitle: "", faDescription: "", enDescription: "", order: data.features.length })}>
            <Plus className="h-4 w-4 ml-2" />ویژگی جدید
          </Button>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <AdminCard title="عنوان بخش مهارت‌ها">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormInput label="faTitle" value={data.skillsSection.faTitle} onChange={(v) => setData({ ...data, skillsSection: updateNested(data.skillsSection, { faTitle: v }) })} />
              <FormInput label="enTitle" value={data.skillsSection.enTitle} onChange={(v) => setData({ ...data, skillsSection: updateNested(data.skillsSection, { enTitle: v }) })} />
            </div>
            <Button size="sm" onClick={() => save("skillsSection", data.skillsSection)}>ذخیره</Button>
          </AdminCard>
          {data.skillBars.map((b) => (
            <AdminCard key={b.id} title={b.faName || "مهارت"} actions={<ConfirmDelete onConfirm={() => remove("skillBar", b.id)} />}>
              <div className="flex flex-wrap gap-4 items-end">
                <FormInput label="faName" value={b.faName} onChange={(v) => setData({ ...data, skillBars: updateById(data.skillBars, b.id, { faName: v }) })} />
                <FormInput label="level" value={String(b.level)} onChange={(v) => setData({ ...data, skillBars: updateById(data.skillBars, b.id, { level: parseInt(v) || 0 }) })} />
                <Button size="sm" onClick={() => save("skillBar", b)}>ذخیره</Button>
              </div>
            </AdminCard>
          ))}
        </TabsContent>

        <TabsContent value="showcase" className="space-y-4">
          <AdminCard title="بخش آخرین مقالات">
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="faTitle" value={data.postsSection?.faTitle ?? ""} onChange={(v) => setData({ ...data, postsSection: updateNested(data.postsSection ?? { id: "default" }, { faTitle: v }) })} />
              <FormInput label="enTitle" value={data.postsSection?.enTitle ?? ""} onChange={(v) => setData({ ...data, postsSection: updateNested(data.postsSection ?? { id: "default" }, { enTitle: v }) })} />
            </div>
            <Button className="mt-4" size="sm" onClick={() => save("postsSection", data.postsSection)}>ذخیره</Button>
          </AdminCard>
          <AdminCard title="بخش پروژه‌های برجسته">
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="faTitle" value={data.projectsSection?.faTitle ?? ""} onChange={(v) => setData({ ...data, projectsSection: updateNested(data.projectsSection ?? { id: "default" }, { faTitle: v }) })} />
              <FormInput label="enTitle" value={data.projectsSection?.enTitle ?? ""} onChange={(v) => setData({ ...data, projectsSection: updateNested(data.projectsSection ?? { id: "default" }, { enTitle: v }) })} />
            </div>
            <Button className="mt-4" size="sm" onClick={() => save("projectsSection", data.projectsSection)}>ذخیره</Button>
          </AdminCard>
        </TabsContent>

        <TabsContent value="cta">
          <AdminCard title="Call to Action">
            <div className="space-y-4">
              {Object.keys(data.cta).filter((k) => k !== "id").map((key) => (
                <FormInput key={key} label={key} value={String(data.cta[key] ?? "")} onChange={(v) => setData({ ...data, cta: updateNested(data.cta, { [key]: v }) })} />
              ))}
              <Button onClick={() => save("cta", data.cta)} disabled={saving}>ذخیره CTA</Button>
            </div>
          </AdminCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
