"use client";
import {
  useVolunteersQuery,
  useVolunteersStatsQuery,
} from "@/shared/query-hooks";
import { IconUsersGroup } from "@dniproanimals/icons";
import { Card, EmptyState } from "@dniproanimals/ui";
import { parseAsInteger, useQueryState } from "nuqs";
import { useVolunteersFilterState } from "../../hooks/useVolunteersFilterState";
import { AddVolunteerButton } from "../AddVolunteerButton";
import { VolunteerCard } from "../VolunteerCard";
import { VolunteerDetailDialog } from "../VolunteerDetailDialog";

export function VolunteersList() {
  const [params] = useVolunteersFilterState();
  const { data: volunteers = [] } = useVolunteersQuery({
    q: params.vq ?? undefined,
    status: params.vstatus ?? undefined,
  });
  const { data: stats } = useVolunteersStatsQuery();
  const { data: allVolunteers = [] } = useVolunteersQuery();

  const [viewId, setViewId] = useQueryState("volunteer", parseAsInteger);
  const [, setEditId] = useQueryState("editVolunteer", parseAsInteger);

  const selected =
    viewId != null
      ? (allVolunteers.find((v) => v.id === viewId) ?? null)
      : null;

  const closeView = () => setViewId(null);
  const handleEdit = async (id: number) => {
    await setViewId(null);
    await setEditId(id);
  };

  if (volunteers.length === 0) {
    const noneAtAll = (stats?.total ?? 0) === 0;
    return (
      <Card>
        <EmptyState
          icon={<IconUsersGroup />}
          title={noneAtAll ? "Ще немає волонтерів" : "Нікого не знайдено"}
          action={noneAtAll ? <AddVolunteerButton size="sm" /> : undefined}
        />
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {volunteers.map((vol) => (
          <VolunteerCard
            key={vol.id}
            volunteer={vol}
            onClick={() => setViewId(vol.id)}
          />
        ))}
      </div>
      <VolunteerDetailDialog
        open={selected != null}
        onOpenChange={(o) => !o && closeView()}
        volunteer={selected}
        onEdit={handleEdit}
        onClose={closeView}
      />
    </>
  );
}
