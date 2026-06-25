"use client";
import {
  useAdoptionStatsQuery,
  useAnimalsStatsQuery,
} from "@/shared/query-hooks";
import {
  IconCircleCheckFilled,
  IconFileTextFilled,
  IconPawFilled,
} from "@dniproanimals/icons";
import { OverviewStatCard } from "./components/OverviewStatCard";

export function OverviewStats() {
  const { data: animals } = useAnimalsStatsQuery();
  const { data: requests } = useAdoptionStatsQuery();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <OverviewStatCard
        href="/dashboard/animals"
        icon={<IconPawFilled size={20} className="text-green-secondary" />}
        iconCls="bg-primary/20"
        value={animals?.total ?? 0}
        label="Тварин всього"
        subLabel={`${animals?.available ?? 0} шукають дім`}
        subLabelCls="text-green-secondary"
      />
      <OverviewStatCard
        href="/dashboard/requests"
        icon={<IconFileTextFilled size={20} className="text-orange-500" />}
        iconCls="bg-orange-50"
        value={requests?.total ?? 0}
        label="Анкет всього"
        subLabel={
          (requests?.pending ?? 0) > 0
            ? `${requests?.pending} очікують розгляду`
            : ""
        }
        subLabelCls="text-orange-500 font-medium"
      />

      <OverviewStatCard
        icon={<IconCircleCheckFilled size={20} className="text-green-500" />}
        iconCls="bg-green-50"
        value={requests?.approved ?? 0}
        label="Успішних усиновлень"
      />
    </div>
  );
}
