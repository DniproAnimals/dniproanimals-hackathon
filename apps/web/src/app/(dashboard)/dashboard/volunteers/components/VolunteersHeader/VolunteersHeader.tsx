"use client";
import { useVolunteersStatsQuery } from "@/shared/query-hooks";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import { AddVolunteerButton } from "../AddVolunteerButton";
import { VolunteerFormDialog } from "../VolunteerFormDialog";

export function VolunteersHeader() {
  const { data: stats } = useVolunteersStatsQuery();
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useQueryState("editVolunteer", parseAsInteger);

  const isOpen = createOpen || editId != null;
  const close = async () => {
    await setCreateOpen(false);
    await setEditId(null);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Волонтери</h1>
          <p className="text-sm text-gray-medium mt-0.5">
            {stats?.total ?? 0} у команді
          </p>
        </div>
        <AddVolunteerButton />
      </div>
      <VolunteerFormDialog
        open={isOpen}
        onOpenChange={(o) => !o && close()}
        editId={editId}
        onClose={close}
      />
    </>
  );
}
