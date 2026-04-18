"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useCreateAnimalMutation = (
  options: OmitMutationOptions<
    typeof apiClient.animals.create,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.animals.create,
    ...options,
  });
};
