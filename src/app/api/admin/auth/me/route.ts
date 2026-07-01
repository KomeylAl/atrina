import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { getRolePermissions } from "@/lib/auth/permissions";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET() {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      displayName: true,
      email: true,
      role: true,
    },
  });

  if (!user) return jsonError("Unauthorized", 401);

  return jsonOk({
    ...user,
    permissions: getRolePermissions(user.role),
  });
}
