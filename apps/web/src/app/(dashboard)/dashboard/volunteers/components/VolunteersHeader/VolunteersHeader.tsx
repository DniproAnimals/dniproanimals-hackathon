"use client";
import { useVolunteersStatsQuery } from "@/shared/query-hooks";
import { AddVolunteerButton } from "../AddVolunteerButton";

interface VolunteersHeaderProps {
  onAdd: () => void;
}

export function VolunteersHeader({ onAdd }: VolunteersHeaderProps) {
  const { data: stats } = useVolunteersStatsQuery();
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Волонтери</h1>
        <p className="text-sm text-gray-medium mt-0.5">
          {stats?.total ?? 0} у команді
        </p>
      </div>
      <AddVolunteerButton onClick={onAdd} />
    </div>
  );
}
