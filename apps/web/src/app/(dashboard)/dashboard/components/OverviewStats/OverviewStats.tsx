"use client";
import {
  useAdoptionStatsQuery,
  useAnimalsStatsQuery,
  useCurrentOrg,
  useVolunteersStatsQuery,
} from "@/shared/query-hooks";
import {
  IconCircleCheckFilled,
  IconFileTextFilled,
  IconPawFilled,
  IconUsersGroup,
} from "@dniproanimals/icons";
import { OverviewStatCard } from "./components/OverviewStatCard";

export function OverviewStats() {
  const { org } = useCurrentOrg();
  const enabled = !!org?.id;
  const { data: animals } = useAnimalsStatsQuery({ enabled });
  const { data: requests } = useAdoptionStatsQuery({ enabled });
  const { data: volunteers } = useVolunteersStatsQuery({ enabled });

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
        href="/dashboard/volunteers"
        icon={<IconUsersGroup size={20} className="text-blue-500" />}
        iconCls="bg-blue-50"
        value={volunteers?.total ?? 0}
        label="Волонтерів"
        subLabel={`${volunteers?.active ?? 0} активних`}
        subLabelCls="text-blue-500"
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
