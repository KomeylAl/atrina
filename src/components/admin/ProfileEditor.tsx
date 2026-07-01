"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { AdminCard, AdminLoading } from "@/components/admin/AdminCard";
import { FormInput } from "@/components/admin/FormField";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRoleLabel } from "@/lib/auth/permissions";
import { toast } from "sonner";
import type { Role } from "@prisma/client";

interface ProfileData {
  name: string;
  displayName: string;
  email: string;
  role: Role;
}

export default function ProfileEditor() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((user) =>
        setData({
          name: user.name,
          displayName: user.displayName || "",
          email: user.email,
          role: user.role,
        }),
      );
  }, []);

  async function save() {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          displayName: data.displayName,
          email: data.email,
          ...(newPassword && { currentPassword, newPassword }),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا");
      toast.success("پروفایل ذخیره شد");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="پروفایل من"
        description="ویرایش اطلاعات شخصی و رمز عبور"
      />

      <AdminCard title="اطلاعات حساب">
        <div className="space-y-4 max-w-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-slate-500">نقش:</span>
            <Badge>{getRoleLabel(data.role)}</Badge>
          </div>
          <FormInput
            label="نام"
            value={data.name}
            onChange={(v) => setData({ ...data, name: v })}
          />
          <FormInput
            label="نام نمایشی در سایت"
            value={data.displayName}
            onChange={(v) => setData({ ...data, displayName: v })}
            placeholder="مثلاً: تیم آترینا"
          />
          <FormInput
            label="ایمیل"
            value={data.email}
            onChange={(v) => setData({ ...data, email: v })}
          />
        </div>
      </AdminCard>

      <AdminCard title="تغییر رمز عبور" className="mt-6">
        <div className="space-y-4 max-w-lg">
          <FormInput
            label="رمز عبور فعلی"
            type="password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <FormInput
            label="رمز عبور جدید"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
          />
        </div>
      </AdminCard>

      <Button className="mt-6" onClick={save} disabled={saving}>
        {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </Button>
    </div>
  );
}
