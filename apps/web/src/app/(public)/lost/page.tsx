"use client";
import type { LostAnimal } from "@dniproanimals/contracts";
import { useState } from "react";
import { LostDetailDialog } from "./components/LostDetailDialog";
import { LostFormDialog } from "./components/LostFormDialog";
import { LostHeader } from "./components/LostHeader";
import { LostList } from "./components/LostList";

export default function LostPage() {
  const [viewing, setViewing] = useState<LostAnimal | null>(null);
  const [editing, setEditing] = useState<LostAnimal | null>(null);
  const [creating, setCreating] = useState(false);

  const openCreate = () => setCreating(true);
  const openView = (item: LostAnimal) => setViewing(item);
  const openEdit = (item: LostAnimal) => {
    setViewing(null);
    setEditing(item);
  };
  const closeView = () => setViewing(null);
  const closeForm = () => {
    setCreating(false);
    setEditing(null);
  };

  const formOpen = creating || editing != null;

  return (
    <>
      <LostHeader onCreate={openCreate} />
      <LostList onView={openView} />

      <LostDetailDialog
        open={viewing != null}
        onOpenChange={(o) => !o && closeView()}
        item={viewing}
        onEdit={openEdit}
        onClose={closeView}
      />
      <LostFormDialog
        open={formOpen}
        onOpenChange={(o) => !o && closeForm()}
        item={editing}
        onClose={closeForm}
      />
    </>
  );
}
