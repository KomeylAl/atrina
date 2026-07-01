"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { AdminCard, AdminLoading } from "@/components/admin/AdminCard";
import { FormInput } from "@/components/admin/FormField";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { getRoleLabel } from "@/lib/auth/permissions";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { Role } from "@prisma/client";

interface AdminUser {
  id: string;
  name: string;
  displayName: string | null;
  email: string;
  role: Role;
}

const emptyForm = {
  name: "",
  displayName: "",
  email: "",
  password: "",
  role: "WRITER" as Role,
};

export default function UsersManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [editing, setEditing] = useState<(typeof emptyForm & { id?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    const data = await fetch("/api/admin/users").then((r) => r.json());
    setUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  async function save() {
    if (!editing) return;

    const isNew = !editing.id;
    const url = isNew ? "/api/admin/users" : `/api/admin/users/${editing.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const result = await res.json();

    if (!res.ok) {
      toast.error(result.error || "خطا در ذخیره");
      return;
    }

    toast.success(isNew ? "کاربر ایجاد شد" : "کاربر به‌روزرسانی شد");
    setEditing(null);
    reload();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (!res.ok) {
      toast.error(result.error || "خطا در حذف");
      return;
    }
    toast.success("کاربر حذف شد");
    reload();
  }

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="مدیریت کاربران"
        description="افزودن ویرایشگر محتوا یا مدیر کل"
        actions={
          <Button onClick={() => setEditing({ ...emptyForm })}>
            <Plus className="h-4 w-4 ml-2" />
            کاربر جدید
          </Button>
        }
      />

      <div className="space-y-4">
        {users.map((user) => (
          <AdminCard
            key={user.id}
            title={user.displayName || user.name}
            actions={
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setEditing({
                      id: user.id,
                      name: user.name,
                      displayName: user.displayName || "",
                      email: user.email,
                      password: "",
                      role: user.role,
                    })
                  }
                >
                  ویرایش
                </Button>
                <ConfirmDelete onConfirm={() => remove(user.id)} />
              </div>
            }
          >
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span>{user.email}</span>
              <Badge variant="secondary">{getRoleLabel(user.role)}</Badge>
            </div>
          </AdminCard>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <AdminCard
            title={editing.id ? "ویرایش کاربر" : "کاربر جدید"}
            className="w-full max-w-md"
          >
            <div className="space-y-4">
              <FormInput
                label="نام"
                value={editing.name}
                onChange={(v) => setEditing({ ...editing, name: v })}
              />
              <FormInput
                label="نام نمایشی"
                value={editing.displayName}
                onChange={(v) => setEditing({ ...editing, displayName: v })}
              />
              <FormInput
                label="ایمیل"
                value={editing.email}
                onChange={(v) => setEditing({ ...editing, email: v })}
              />
              <FormInput
                label={editing.id ? "رمز عبور جدید (اختیاری)" : "رمز عبور"}
                type="password"
                value={editing.password}
                onChange={(v) => setEditing({ ...editing, password: v })}
              />
              <div>
                <label className="text-sm font-medium">نقش</label>
                <Select
                  value={editing.role}
                  onChange={(e) =>
                    setEditing({ ...editing, role: e.target.value as Role })
                  }
                  className="mt-1.5"
                >
                  <option value="WRITER">ویرایشگر محتوا</option>
                  <option value="ADMIN">مدیر کل</option>
                </Select>
                <p className="text-xs text-slate-500 mt-1">
                  ویرایشگر محتوا به تنظیمات سایت و مدیریت کاربران دسترسی ندارد.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={save}>ذخیره</Button>
                <Button variant="outline" onClick={() => setEditing(null)}>
                  انصراف
                </Button>
              </div>
            </div>
          </AdminCard>
        </div>
      )}
    </div>
  );
}
