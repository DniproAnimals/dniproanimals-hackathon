"use client";
import { useMeQuery } from "@/shared/query-hooks";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

interface OnlyUnauthorizedProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function OnlyUnauthorized({
  children,
  fallback,
}: OnlyUnauthorizedProps) {
  const router = useRouter();
  const { data: user } = useMeQuery();

  useEffect(() => {
    if (!user) return;
    if (user.role === "superadmin") router.replace("/profile");
    else if (user.role === "admin" || user.role === "volunteer")
      router.replace("/dashboard");
    else router.replace("/profile");
  }, [user, router]);

  if (user) return <>{fallback ?? null}</>;

  return <>{children}</>;
}
