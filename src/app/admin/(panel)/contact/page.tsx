"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { format } from "date-fns";

export default function ContactAdminPage() {
  const [data, setData] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/contact").then((r) => r.json()).then((payload) => {
      setData(payload);
      setInfo(
        payload.info ?? {
          faOfficeTitle: "آدرس دفتر",
          enOfficeTitle: "Office Location",
          faOfficeAddress: "",
          enOfficeAddress: "",
          faBusinessHoursTitle: "ساعات کاری",
          enBusinessHoursTitle: "Business Hours",
          faBusinessHours: "",
          enBusinessHours: "",
          faResponseTimeTitle: "زمان پاسخ‌گویی",
          enResponseTimeTitle: "Response Time",
          faResponseTime: "",
          enResponseTime: "",
        },
      );
    });
  }, []);

  async function saveMethod() {
    await fetch("/api/admin/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "method", data: editing }),
    });
    toast.success("ذخیره شد");
    setData(await fetch("/api/admin/contact").then((r) => r.json()));
    setEditing(null);
  }

  async function markRead(id: string) {
    await fetch("/api/admin/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "markRead", data: { id } }),
    });
    setData(await fetch("/api/admin/contact").then((r) => r.json()));
  }

  async function saveInfo() {
    await fetch("/api/admin/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "info", data: info }),
    });
    toast.success("اطلاعات تماس ذخیره شد");
    const payload = await fetch("/api/admin/contact").then((r) => r.json());
    setData(payload);
    setInfo(payload.info);
  }

  if (!data) return <div className="animate-pulse h-96 bg-slate-200 rounded-xl" />;

  return (
    <div>
      <AdminPageHeader title="مدیریت تماس" />

      <Tabs defaultValue="methods" dir="rtl">
        <TabsList className="mb-6">
          <TabsTrigger value="info">اطلاعات ثابت تماس</TabsTrigger>
          <TabsTrigger value="methods">روش‌های تماس</TabsTrigger>
          <TabsTrigger value="inbox">صندوق پیام ({data.submissions.filter((s: any) => !s.isRead).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          {info && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input value={info.faOfficeTitle} placeholder="عنوان آدرس فارسی" onChange={(e) => setInfo({ ...info, faOfficeTitle: e.target.value })} />
                  <Input value={info.enOfficeTitle} placeholder="Office title" onChange={(e) => setInfo({ ...info, enOfficeTitle: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Textarea value={info.faOfficeAddress} placeholder="آدرس دفتر فارسی" onChange={(e) => setInfo({ ...info, faOfficeAddress: e.target.value })} />
                  <Textarea value={info.enOfficeAddress} placeholder="Office address" onChange={(e) => setInfo({ ...info, enOfficeAddress: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input value={info.faBusinessHoursTitle} placeholder="عنوان ساعات کاری فارسی" onChange={(e) => setInfo({ ...info, faBusinessHoursTitle: e.target.value })} />
                  <Input value={info.enBusinessHoursTitle} placeholder="Business hours title" onChange={(e) => setInfo({ ...info, enBusinessHoursTitle: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Textarea value={info.faBusinessHours} placeholder="ساعات کاری فارسی" onChange={(e) => setInfo({ ...info, faBusinessHours: e.target.value })} />
                  <Textarea value={info.enBusinessHours} placeholder="Business hours" onChange={(e) => setInfo({ ...info, enBusinessHours: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input value={info.faResponseTimeTitle} placeholder="عنوان زمان پاسخ‌گویی فارسی" onChange={(e) => setInfo({ ...info, faResponseTimeTitle: e.target.value })} />
                  <Input value={info.enResponseTimeTitle} placeholder="Response time title" onChange={(e) => setInfo({ ...info, enResponseTimeTitle: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Textarea value={info.faResponseTime} placeholder="زمان پاسخ‌گویی فارسی" onChange={(e) => setInfo({ ...info, faResponseTime: e.target.value })} />
                  <Textarea value={info.enResponseTime} placeholder="Response time" onChange={(e) => setInfo({ ...info, enResponseTime: e.target.value })} />
                </div>
                <Button onClick={saveInfo}>ذخیره</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="methods">
          <Button className="mb-4" onClick={() => setEditing({ type: "EMAIL", faLabel: "", enLabel: "", value: "", link: "", colorFrom: "from-blue-500", colorTo: "to-cyan-500", order: data.methods.length })}>
            <Plus className="h-4 w-4 ml-2" />افزودن
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {data.methods.map((m: any) => (
              <Card key={m.id}><CardContent className="p-4 flex justify-between items-center">
                <div><p className="font-medium">{m.faLabel}</p><p className="text-sm text-slate-500">{m.value}</p></div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing(m)}>ویرایش</Button>
                  <ConfirmDelete onConfirm={async () => {
                    await fetch("/api/admin/contact", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: "method", id: m.id }) });
                    setData(await fetch("/api/admin/contact").then((r) => r.json()));
                  }} />
                </div>
              </CardContent></Card>
            ))}
          </div>
          {editing && (
            <Card><CardContent className="p-6 space-y-4">
              <div><Label>type</Label>
                <Select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })} className="mt-1">
                  <option value="EMAIL">EMAIL</option><option value="PHONE">PHONE</option>
                  <option value="WHATSAPP">WHATSAPP</option><option value="TELEGRAM">TELEGRAM</option>
                </Select>
              </div>
              <Input value={editing.faLabel} placeholder="faLabel" onChange={(e) => setEditing({ ...editing, faLabel: e.target.value })} />
              <Input value={editing.enLabel} placeholder="enLabel" onChange={(e) => setEditing({ ...editing, enLabel: e.target.value })} />
              <Input value={editing.value} placeholder="value" onChange={(e) => setEditing({ ...editing, value: e.target.value })} />
              <Input value={editing.link} placeholder="link" onChange={(e) => setEditing({ ...editing, link: e.target.value })} />
              <div className="flex gap-2">
                <Button onClick={saveMethod}>ذخیره</Button>
                <Button variant="outline" onClick={() => setEditing(null)}>انصراف</Button>
              </div>
            </CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="inbox">
          <div className="space-y-4">
            {data.submissions.map((s: any) => (
              <Card key={s.id} className={!s.isRead ? "border-indigo-300" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{s.name}</span>
                      {!s.isRead && <Badge>جدید</Badge>}
                    </div>
                    <span className="text-xs text-slate-500">{format(new Date(s.createdAt), "yyyy/MM/dd HH:mm")}</span>
                  </div>
                  <p className="text-sm text-slate-500">{s.email}</p>
                  {s.subject && <p className="text-sm font-medium mt-1">{s.subject}</p>}
                  <p className="text-sm mt-2 whitespace-pre-wrap">{s.message}</p>
                  <div className="flex gap-2 mt-3">
                    {!s.isRead && <Button size="sm" variant="outline" onClick={() => markRead(s.id)}>علامت خوانده‌شده</Button>}
                    <ConfirmDelete onConfirm={async () => {
                      await fetch("/api/admin/contact", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: "submission", id: s.id }) });
                      setData(await fetch("/api/admin/contact").then((r) => r.json()));
                    }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
