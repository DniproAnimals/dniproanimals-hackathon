"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useCreateAdoptionMutation = (
  options: OmitMutationOptions<
    typeof apiClient.adoption.create,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.adoption.create,
    ...options,
  });
};
