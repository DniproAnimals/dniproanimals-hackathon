"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useSuperadminDeleteOrgMutation = (
  options: OmitMutationOptions<
    typeof apiClient.superadmin.deleteOrg,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.superadmin.deleteOrg,
    ...options,
  });
};
