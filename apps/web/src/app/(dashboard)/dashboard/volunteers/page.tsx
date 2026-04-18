"use client";
import type { Volunteer } from "@dniproanimals/contracts";
import { useState } from "react";
import { VolunteerDetailDialog } from "./components/VolunteerDetailDialog";
import { VolunteerFormDialog } from "./components/VolunteerFormDialog";
import { VolunteersFilters } from "./components/VolunteersFilters";
import { VolunteersHeader } from "./components/VolunteersHeader";
import { VolunteersList } from "./components/VolunteersList";
import { VolunteersStats } from "./components/VolunteersStats";

export default function VolunteersPage() {
  const [viewing, setViewing] = useState<Volunteer | null>(null);
  const [editing, setEditing] = useState<Volunteer | null>(null);
  const [creating, setCreating] = useState(false);

  const openCreate = () => setCreating(true);
  const openView = (v: Volunteer) => setViewing(v);
  const openEdit = (v: Volunteer) => {
    setViewing(null);
    setEditing(v);
  };
  const closeView = () => setViewing(null);
  const closeForm = () => {
    setCreating(false);
    setEditing(null);
  };

  const formOpen = creating || editing != null;

  return (
    <div className="max-w-5xl space-y-6">
      <VolunteersHeader onAdd={openCreate} />
      <VolunteersStats />
      <VolunteersFilters />
      <VolunteersList onView={openView} onAdd={openCreate} />

      <VolunteerDetailDialog
        open={viewing != null}
        onOpenChange={(o) => !o && closeView()}
        volunteer={viewing}
        onEdit={openEdit}
        onClose={closeView}
      />
      <VolunteerFormDialog
        open={formOpen}
        onOpenChange={(o) => !o && closeForm()}
        volunteer={editing}
        onClose={closeForm}
      />
    </div>
  );
}
