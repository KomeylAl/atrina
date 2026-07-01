import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
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

  if (!user) return jsonError("کاربر یافت نشد", 404);
  return jsonOk(user);
}

export async function PUT(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { name, displayName, email, currentPassword, newPassword } =
      await request.json();

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return jsonError("کاربر یافت نشد", 404);

    if (email && email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return jsonError("این ایمیل قبلاً ثبت شده است");
    }

    if (newPassword) {
      if (!currentPassword) {
        return jsonError("رمز عبور فعلی الزامی است");
      }
      const valid = await verifyPassword(currentPassword, user.password);
      if (!valid) return jsonError("رمز عبور فعلی نادرست است");
    }

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(displayName !== undefined && { displayName: displayName || null }),
        ...(email !== undefined && { email }),
        ...(newPassword && { password: await hashPassword(newPassword) }),
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

    await setSessionCookie({
      userId: updated.id,
      email: updated.email,
      name: updated.name,
      displayName: updated.displayName,
      role: updated.role,
    });

    return jsonOk(updated);
  } catch (err) {
    console.error("[PUT /api/admin/profile]", err);
    return jsonError("به‌روزرسانی پروفایل ناموفق بود", 500);
  }
}
