import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return jsonError("Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return jsonError("Invalid credentials", 401);
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return jsonError("Invalid credentials", 401);
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return jsonOk({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("[POST /api/admin/auth/login]", error);
    return jsonError("Login failed", 500);
  }
}
