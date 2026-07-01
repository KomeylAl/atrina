import { getSession } from "@/lib/auth/session";
import { jsonError } from "@/lib/api-response";
import type { Role } from "@prisma/client";
import {
  canAccess,
  type AdminPermission,
} from "@/lib/auth/permissions";

export async function requireAdmin(options?: {
  roles?: Role[];
  permission?: AdminPermission;
}) {
  const session = await getSession();
  if (!session) {
    return { session: null, error: jsonError("Unauthorized", 401) };
  }

  if (options?.roles && !options.roles.includes(session.role)) {
    return { session: null, error: jsonError("Forbidden", 403) };
  }

  if (options?.permission && !canAccess(session.role, options.permission)) {
    return { session: null, error: jsonError("Forbidden", 403) };
  }

  return { session, error: null };
}
