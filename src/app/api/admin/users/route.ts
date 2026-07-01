import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/require-admin";
import { hashPassword } from "@/lib/auth/password";
import { jsonOk, jsonError } from "@/lib/api-response";
import type { Role } from "@prisma/client";

export async function GET() {
  const { error } = await requireAdmin({ permission: "users" });
  if (error) return error;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      displayName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return jsonOk(users);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin({ permission: "users" });
  if (error) return error;

  try {
    const { name, displayName, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return jsonError("نام، ایمیل و رمز عبور الزامی است");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return jsonError("این ایمیل قبلاً ثبت شده است");
    }

    const user = await prisma.user.create({
      data: {
        name,
        displayName: displayName || null,
        email,
        password: await hashPassword(password),
        role: (role as Role) || "WRITER",
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

    return jsonOk(user, 201);
  } catch (err) {
    console.error("[POST /api/admin/users]", err);
    return jsonError("ایجاد کاربر ناموفق بود", 500);
  }
}
