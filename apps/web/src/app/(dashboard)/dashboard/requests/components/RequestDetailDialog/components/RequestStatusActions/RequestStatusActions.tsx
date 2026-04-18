"use client";
import {
  ADOPTION_STATUS_BADGE_VARIANT,
  ADOPTION_STATUS_LABEL,
} from "@/shared/constants";
import { useUpdateAdoptionStatusMutation } from "@/shared/query-hooks";
import type {
  AdoptionRequestWithAnimal,
  AdoptionStatus,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { IconBan, IconCheck } from "@dniproanimals/icons";
import { Badge, Button } from "@dniproanimals/ui";
import { useQueryClient } from "@tanstack/react-query";

interface RequestStatusActionsProps {
  request: AdoptionRequestWithAnimal;
  onStatusChange?: (status: AdoptionStatus) => void;
}

export function RequestStatusActions({
  request,
  onStatusChange,
}: RequestStatusActionsProps) {
  const queryClient = useQueryClient();
  const mutation = useUpdateAdoptionStatusMutation({
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [endpoints.adoption.list()] });
      queryClient.invalidateQueries({ queryKey: [endpoints.adoption.stats()] });
      queryClient.invalidateQueries({ queryKey: [endpoints.animals.list()] });
      queryClient.invalidateQueries({ queryKey: [endpoints.animals.stats()] });
      onStatusChange?.(variables.status);
    },
  });

  if (request.status !== "pending") {
    return (
      <Badge
        variant={ADOPTION_STATUS_BADGE_VARIANT[request.status]}
        size="lg"
        className="w-full justify-center py-3"
      >
        {ADOPTION_STATUS_LABEL[request.status]}
      </Badge>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="success"
        size="lg"
        onClick={() => mutation.mutate({ id: request.id, status: "approved" })}
        disabled={mutation.isPending}
        className="flex-1"
      >
        <IconCheck size={18} />
        Схвалити
      </Button>
      <Button
        variant="destructive"
        size="lg"
        onClick={() => mutation.mutate({ id: request.id, status: "rejected" })}
        disabled={mutation.isPending}
        className="flex-1"
      >
        <IconBan size={18} />
        Відхилити
      </Button>
    </div>
  );
}
