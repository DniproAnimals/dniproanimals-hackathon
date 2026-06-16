"use client";
import { useMeQuery } from "@/shared/query-hooks";

export function DashboardOverviewHeader() {
  const { data: user } = useMeQuery();

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Вітаємо, {user?.name}! 👋
        </h1>
      </div>
      <p className="text-sm text-gray-medium mt-1">
        Ось що відбувається сьогодні
      </p>
    </div>
  );
}
