"use client";
import { useCurrentOrg } from "@/shared/query-hooks";

export function DashboardOverviewHeader() {
  const { user } = useCurrentOrg();
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">
        Вітаємо{user?.name ? `, ${user.name}` : ""}!
      </h1>
      <p className="text-sm text-gray-medium mt-1">
        Ось що відбувається у вашій організації
      </p>
    </div>
  );
}
