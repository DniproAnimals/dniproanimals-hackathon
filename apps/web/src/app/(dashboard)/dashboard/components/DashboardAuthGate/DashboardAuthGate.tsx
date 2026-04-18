"use client";
import { useMeQuery } from "@/shared/query-hooks";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function DashboardAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading } = useMeQuery();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/auth");
      return;
    }
    if (!user.orgId) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-medium">Завантаження...</p>
      </div>
    );
  }

  return <>{children}</>;
}
