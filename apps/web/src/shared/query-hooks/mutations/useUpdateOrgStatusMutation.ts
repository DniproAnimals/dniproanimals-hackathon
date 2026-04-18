"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useUpdateOrgStatusMutation = (
  options: OmitMutationOptions<
    typeof apiClient.organizations.updateStatus,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.organizations.updateStatus,
    ...options,
  });
};
