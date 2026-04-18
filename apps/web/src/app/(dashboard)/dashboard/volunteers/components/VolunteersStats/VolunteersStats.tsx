"use client";
import { useVolunteersStatsQuery } from "@/shared/query-hooks";
import {
  IconCircleCheckFilled,
  IconClockFilled,
  IconUsersGroup,
} from "@dniproanimals/icons";
import { StatCard } from "./components/StatCard";

export function VolunteersStats() {
  const { data: stats } = useVolunteersStatsQuery();

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        icon={<IconUsersGroup size={20} />}
        colorCls="bg-blue-50 text-blue-500"
        value={stats?.total ?? 0}
        label="Всього"
      />
      <StatCard
        icon={<IconCircleCheckFilled size={20} />}
        colorCls="bg-green-50 text-green-500"
        value={stats?.active ?? 0}
        label="Активних"
      />
      <StatCard
        icon={<IconClockFilled size={20} />}
        colorCls="bg-yellow-50 text-yellow-500"
        value={stats?.pending ?? 0}
        label="Очікують"
      />
    </div>
  );
}
