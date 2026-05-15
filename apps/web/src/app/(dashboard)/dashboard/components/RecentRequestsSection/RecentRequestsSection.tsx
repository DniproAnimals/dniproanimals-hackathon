"use client";
import { useAdoptionQuery } from "@/shared/query-hooks";
import { Card } from "@dniproanimals/ui";
import Link from "next/link";
import { RecentRequestRow } from "./components/RecentRequestRow";

export function RecentRequestsSection() {
  const { data: requests = [] } = useAdoptionQuery({ limit: 5 });

  return (
    <Card>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-border/60">
        <h2 className="text-sm font-semibold text-foreground">
          Останні анкети
        </h2>
        <Link
          href="/dashboard/requests"
          className="text-xs text-gray-medium hover:text-foreground"
        >
          Всі →
        </Link>
      </div>
      {requests.length === 0 ? (
        <div className="p-8 text-center text-gray-medium text-sm">
          Ще немає анкет
        </div>
      ) : (
        <div className="divide-y divide-gray-border/40">
          {requests.map((r) => (
            <RecentRequestRow key={r.id} request={r} />
          ))}
        </div>
      )}
    </Card>
  );
}
