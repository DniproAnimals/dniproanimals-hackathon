"use client";
import { useAdoptionQuery, useAdoptionStatsQuery } from "@/shared/query-hooks";
import type {
  AdoptionRequestWithAnimal,
  AdoptionStatus,
} from "@dniproanimals/contracts";
import { Card, EmptyState } from "@dniproanimals/ui";
import { useState } from "react";
import { useRequestsFilterState } from "../../hooks/useRequestsFilterState";
import { RequestDetailDialog } from "../RequestDetailDialog";
import { RequestRow } from "./components/RequestRow";

export function RequestsList() {
  const [filters] = useRequestsFilterState();

  const { data: requests = [] } = useAdoptionQuery({
    q: filters.q ?? undefined,
    status: filters.status ?? undefined,
  });
  const { data: stats } = useAdoptionStatsQuery();

  const [selected, setSelected] = useState<AdoptionRequestWithAnimal | null>(
    null,
  );

  const handleStatusChange = (status: AdoptionStatus) => {
    setSelected((prev) => (prev ? { ...prev, status } : null));
  };

  if (requests.length === 0) {
    return (
      <Card>
        <EmptyState
          title={stats?.total === 0 ? "Ще немає анкет" : "Нічого не знайдено"}
        />
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {requests.map((r) => (
          <RequestRow key={r.id} request={r} onClick={() => setSelected(r)} />
        ))}
      </div>
      <RequestDetailDialog
        open={selected != null}
        onOpenChange={(o) => !o && setSelected(null)}
        request={selected}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
