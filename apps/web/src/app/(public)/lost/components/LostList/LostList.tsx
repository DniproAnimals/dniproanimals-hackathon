"use client";
import { useLostQuery } from "@/shared/query-hooks";
import { repeat } from "@/shared/utils";
import type { LostAnimal } from "@dniproanimals/contracts";
import { Skeleton } from "@dniproanimals/ui";
import { LostCard } from "../LostCard";

interface LostListProps {
  onView: (item: LostAnimal) => void;
}

export function LostList({ onView }: LostListProps) {
  const { data: items = [], isLoading } = useLostQuery({ type: "lost" });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repeat(6).map((_, i) => (
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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <LostCard key={item.id} item={item} onClick={() => onView(item)} />
      ))}
    </div>
  );
}
