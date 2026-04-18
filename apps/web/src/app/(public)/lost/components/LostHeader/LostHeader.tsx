"use client";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import { CreateLostButton } from "../CreateLostButton";
import { LostFormDialog } from "../LostFormDialog";

export function LostHeader() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useQueryState("editLost", parseAsInteger);

  const isOpen = createOpen || editId != null;

  const close = async () => {
    await setCreateOpen(false);
    await setEditId(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Загублені тварини</h1>
          <p className="text-sm text-gray-medium mt-1">
            Допоможіть знайти господарів
          </p>
        </div>
        <CreateLostButton />
      </div>
      <LostFormDialog
        open={isOpen}
        onOpenChange={(o) => !o && close()}
        editId={editId}
        onClose={close}
      />
    </>
  );
}
