"use client";
import { useVolunteersStatsQuery } from "@/shared/query-hooks";
import type { VolunteerStatusFilter } from "@dniproanimals/contracts";
import { Tabs, TabsList, TabsTrigger } from "@dniproanimals/ui";
import { useVolunteersFilterState } from "../../../../hooks/useVolunteersFilterState";

export function VolunteerStatusTabs() {
  const [params, setParams] = useVolunteersFilterState();
  const { data: stats } = useVolunteersStatsQuery();
  const total = stats?.total ?? 0;
  const active = stats?.active ?? 0;
  const pending = stats?.pending ?? 0;

  return (
    <Tabs
      value={params.vstatus ?? "all"}
      onValueChange={(v) =>
        setParams({
          vstatus: v === "all" ? null : (v as VolunteerStatusFilter),
        })
      }
    >
      <TabsList>
        <TabsTrigger value="all">Усі ({total})</TabsTrigger>
        <TabsTrigger value="active">Активні ({active})</TabsTrigger>
        <TabsTrigger value="pending">Очікують ({pending})</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
