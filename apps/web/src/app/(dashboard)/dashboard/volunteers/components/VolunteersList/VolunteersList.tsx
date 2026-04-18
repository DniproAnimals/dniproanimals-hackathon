"use client";
import {
  useVolunteersQuery,
  useVolunteersStatsQuery,
} from "@/shared/query-hooks";
import type { Volunteer } from "@dniproanimals/contracts";
import { IconUsersGroup } from "@dniproanimals/icons";
import { Card, EmptyState } from "@dniproanimals/ui";
import { useVolunteersFilterState } from "../../hooks/useVolunteersFilterState";
import { AddVolunteerButton } from "../AddVolunteerButton";
import { VolunteerCard } from "../VolunteerCard";

interface VolunteersListProps {
  onView: (volunteer: Volunteer) => void;
  onAdd: () => void;
}

export function VolunteersList({ onView, onAdd }: VolunteersListProps) {
  const [params] = useVolunteersFilterState();
  const { data: volunteers = [] } = useVolunteersQuery({
    q: params.vq ?? undefined,
    status: params.vstatus ?? undefined,
  });
  const { data: stats } = useVolunteersStatsQuery();

  if (volunteers.length === 0) {
    const noneAtAll = (stats?.total ?? 0) === 0;
    return (
      <Card>
        <EmptyState
          icon={<IconUsersGroup />}
          title={noneAtAll ? "Ще немає волонтерів" : "Нікого не знайдено"}
          action={
            noneAtAll ? (
              <AddVolunteerButton size="sm" onClick={onAdd} />
            ) : undefined
          }
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {volunteers.map((vol) => (
        <VolunteerCard
          key={vol.id}
          volunteer={vol}
          onClick={() => onView(vol)}
        />
      ))}
    </div>
  );
}
