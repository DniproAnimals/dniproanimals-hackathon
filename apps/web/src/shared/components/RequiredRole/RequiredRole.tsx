"use client";
import { useMeQuery } from "@/shared/query-hooks";
import type { UserRole } from "@dniproanimals/contracts";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

interface RequiredRoleProps {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
  authRedirectTo?: string;
  forbiddenRedirectTo?: string;
}

export function RequiredRole({
  roles,
  children,
  fallback,
  authRedirectTo = "/auth/signin",
  forbiddenRedirectTo = "/",
}: RequiredRoleProps) {
  const router = useRouter();
  const { data: user, isLoading } = useMeQuery();
  const allowed = !!user && roles.includes(user.role);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(authRedirectTo);
      return;
    }
    if (!roles.includes(user.role)) {
      router.replace(forbiddenRedirectTo);
    }
  }, [user, isLoading, roles, router, authRedirectTo, forbiddenRedirectTo]);

  if (isLoading || !allowed) {
    return (
      <>
        {fallback ?? (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-medium">Завантаження...</p>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
