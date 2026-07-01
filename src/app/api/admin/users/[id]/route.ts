import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { hashPassword } from "@/lib/auth/password";
import { jsonOk, jsonError } from "@/lib/api-response";
import type { Role } from "@prisma/client";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const { session, error } = await requireAdmin({ permission: "users" });
  if (error) return error;

  const { id } = await context.params;

  try {
    const { name, displayName, email, password, role } = await request.json();

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) return jsonError("کاربر یافت نشد", 404);

    if (email && email !== target.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return jsonError("این ایمیل قبلاً ثبت شده است");
    }

    if (role === "WRITER" && target.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        return jsonError("حداقل یک مدیر کل باید در سیستم باقی بماند");
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(displayName !== undefined && { displayName: displayName || null }),
        ...(email !== undefined && { email }),
        ...(role !== undefined && { role: role as Role }),
        ...(password && { password: await hashPassword(password) }),
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (session.userId === id) {
      // Session refresh handled client-side via profile endpoint if needed
    }

    return jsonOk(user);
  } catch (err) {
    console.error("[PUT /api/admin/users/[id]]", err);
    return jsonError("به‌روزرسانی کاربر ناموفق بود", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { session, error } = await requireAdmin({ permission: "users" });
  if (error) return error;

  const { id } = await context.params;

  if (session.userId === id) {
    return jsonError("نمی‌توانید حساب خود را حذف کنید");
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return jsonError("کاربر یافت نشد", 404);

  if (target.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return jsonError("حداقل یک مدیر کل باید در سیستم باقی بماند");
    }
  }

  await prisma.user.delete({ where: { id } });
  return jsonOk({ success: true });
}
