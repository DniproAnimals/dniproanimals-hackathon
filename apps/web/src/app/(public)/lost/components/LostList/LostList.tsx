"use client";
import { useLostQuery } from "@/shared/query-hooks";
import { Skeleton } from "@dniproanimals/ui";
import { parseAsInteger, useQueryState } from "nuqs";
import { LostCard } from "../LostCard";
import { LostDetailDialog } from "../LostDetailDialog";

export function LostList() {
  const { data: items = [], isLoading } = useLostQuery({ type: "lost" });
  const [viewId, setViewId] = useQueryState("viewLost", parseAsInteger);
  const [, setEditId] = useQueryState("editLost", parseAsInteger);

  const selected =
    viewId != null ? (items.find((i) => i.id === viewId) ?? null) : null;

  const closeView = () => setViewId(null);
  const handleEdit = async (id: number) => {
    await setViewId(null);
    await setEditId(id);
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="rounded-2xl h-48" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold">Оголошень поки немає</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <LostCard
            key={item.id}
            item={item}
            onClick={() => setViewId(item.id)}
          />
        ))}
      </div>
      <LostDetailDialog
        open={selected != null}
        onOpenChange={(o) => !o && closeView()}
        item={selected}
        onEdit={handleEdit}
        onClose={closeView}
      />
    </>
  );
}
