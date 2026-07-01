import type { Role } from "@prisma/client";

export type AdminPermission =
  | "dashboard"
  | "home"
  | "blog"
  | "projects"
  | "work"
  | "about"
  | "contact"
  | "media"
  | "settings"
  | "users";

const CONTENT_PERMISSIONS: AdminPermission[] = [
  "dashboard",
  "home",
  "blog",
  "projects",
  "work",
  "about",
  "contact",
  "media",
];

const ADMIN_PERMISSIONS: AdminPermission[] = [
  ...CONTENT_PERMISSIONS,
  "settings",
  "users",
];

export function getRolePermissions(role: Role): AdminPermission[] {
  return role === "ADMIN" ? ADMIN_PERMISSIONS : CONTENT_PERMISSIONS;
}

export function canAccess(role: Role, permission: AdminPermission): boolean {
  return getRolePermissions(role).includes(permission);
}

export function getRoleLabel(role: Role): string {
  return role === "ADMIN" ? "مدیر کل" : "ویرایشگر محتوا";
}

export const ADMIN_ROUTE_PERMISSIONS: Record<string, AdminPermission> = {
  "/admin": "dashboard",
  "/admin/home": "home",
  "/admin/blog": "blog",
  "/admin/projects": "projects",
  "/admin/work": "work",
  "/admin/about": "about",
  "/admin/contact": "contact",
  "/admin/media": "media",
  "/admin/settings": "settings",
  "/admin/users": "users",
  "/admin/profile": "dashboard",
};

export function getPermissionForPath(pathname: string): AdminPermission | null {
  if (ADMIN_ROUTE_PERMISSIONS[pathname]) {
    return ADMIN_ROUTE_PERMISSIONS[pathname];
  }

  if (pathname.startsWith("/admin/blog")) return "blog";
  if (pathname.startsWith("/admin/projects")) return "projects";
  if (pathname.startsWith("/admin/work")) return "work";

  return null;
}
