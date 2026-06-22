import { getSession } from "@/lib/auth/session";
import { jsonError } from "@/lib/api-response";
import type { Role } from "@prisma/client";

export async function requireAdmin(roles?: Role[]) {
  const session = await getSession();
  if (!session) {
    return { session: null, error: jsonError("Unauthorized", 401) };
  }

  if (roles && !roles.includes(session.role)) {
    return { session: null, error: jsonError("Forbidden", 403) };
  }

  return { session, error: null };
}
