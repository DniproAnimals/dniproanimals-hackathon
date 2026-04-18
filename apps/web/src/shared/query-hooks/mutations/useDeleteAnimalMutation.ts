"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useDeleteAnimalMutation = (
  options: OmitMutationOptions<
    typeof apiClient.animals.delete,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.animals.delete,
    ...options,
  });
};
