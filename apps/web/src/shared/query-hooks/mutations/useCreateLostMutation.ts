"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useCreateLostMutation = (
  options: OmitMutationOptions<typeof apiClient.lost.create, "mutationFn"> = {},
) => {
  return useMutation({
    mutationFn: apiClient.lost.create,
    ...options,
  });
};
