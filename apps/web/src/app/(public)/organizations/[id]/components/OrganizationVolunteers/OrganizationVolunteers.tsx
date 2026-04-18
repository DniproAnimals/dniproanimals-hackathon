"use client";
import { useOrganizationVolunteersQuery } from "@/shared/query-hooks";
import { IconUsersGroup } from "@dniproanimals/icons";
import { VolunteerCard } from "./components/VolunteerCard";

interface OrganizationVolunteersProps {
  orgId: number;
}

export function OrganizationVolunteers({ orgId }: OrganizationVolunteersProps) {
  const { data: volunteers = [] } = useOrganizationVolunteersQuery(orgId);

  if (volunteers.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <IconUsersGroup size={20} className="text-primary" />
        <h2 className="text-xl font-bold">Команда</h2>
        <span className="text-sm text-gray-medium">({volunteers.length})</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {volunteers.map((volunteer, index) => (
          <VolunteerCard
            key={volunteer.id}
            volunteer={volunteer}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
