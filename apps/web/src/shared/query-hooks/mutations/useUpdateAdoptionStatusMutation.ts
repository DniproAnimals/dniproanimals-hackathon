"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useUpdateAdoptionStatusMutation = (
  options: OmitMutationOptions<
    typeof apiClient.adoption.updateStatus,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.adoption.updateStatus,
    ...options,
  });
};
