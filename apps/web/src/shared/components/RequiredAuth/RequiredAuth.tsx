"use client";
import { useMeQuery } from "@/shared/query-hooks";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

interface RequiredAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function RequiredAuth({
  children,
  fallback,
  redirectTo = "/auth/signin",
}: RequiredAuthProps) {
  const router = useRouter();
  const { data: user, isLoading } = useMeQuery();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace(redirectTo);
  }, [user, isLoading, router, redirectTo]);

  if (isLoading || !user) {
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
