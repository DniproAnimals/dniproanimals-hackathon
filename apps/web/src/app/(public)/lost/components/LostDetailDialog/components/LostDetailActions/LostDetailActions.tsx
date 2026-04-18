"use client";
import { useUpdateLostMutation } from "@/shared/query-hooks";
import type { LostAnimal } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { IconCheck, IconEdit } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import { useQueryClient } from "@tanstack/react-query";

interface LostDetailActionsProps {
  item: LostAnimal;
  onEdit: (item: LostAnimal) => void;
  onClose: () => void;
}

export function LostDetailActions({
  item,
  onEdit,
  onClose,
}: LostDetailActionsProps) {
  const queryClient = useQueryClient();
  const updateMutation = useUpdateLostMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoints.lost.list()] });
      onClose();
    },
  });

  const markFound = () => {
    updateMutation.mutate({ id: item.id, body: { type: "found" } });
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
        <IconEdit size={15} />
        Редагувати
      </Button>
      {item.type === "lost" && (
        <Button variant="success" size="sm" onClick={markFound}>
          <IconCheck size={15} />
          Знайдено
        </Button>
      )}
    </div>
  );
}
