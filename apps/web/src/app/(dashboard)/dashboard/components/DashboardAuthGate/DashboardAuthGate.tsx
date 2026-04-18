"use client";
import { RequiredAuth } from "@/shared/components/RequiredAuth";
import { useMeQuery } from "@/shared/query-hooks";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function DashboardAuthGate({ children }: { children: ReactNode }) {
  return (
    <RequiredAuth>
      <OrgGate>{children}</OrgGate>
    </RequiredAuth>
  );
}

function OrgGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user } = useMeQuery();

  useEffect(() => {
    if (user && !user.orgId) router.replace("/");
  }, [user, router]);

  if (!user || !user.orgId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-medium">Завантаження...</p>
      </div>
    );
  }

  return <>{children}</>;
}
