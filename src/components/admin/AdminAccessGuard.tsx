"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { canAccess, getPermissionForPath } from "@/lib/auth/permissions";
import { AdminLoading } from "@/components/admin/AdminCard";
import type { Role } from "@prisma/client";

export default function AdminAccessGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/auth/me")
      .then((r) => r.json())
      .then((user) => {
        if (cancelled) return;
        const permission = getPermissionForPath(pathname);
        if (permission && !canAccess(user.role as Role, permission)) {
          router.replace("/admin");
          return;
        }
        setAllowed(true);
      })
      .catch(() => router.replace("/admin/login"));

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!allowed) return <AdminLoading />;
  return <>{children}</>;
}
