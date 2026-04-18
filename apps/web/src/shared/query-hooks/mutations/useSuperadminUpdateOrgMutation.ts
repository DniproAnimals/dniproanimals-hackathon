"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useSuperadminUpdateOrgMutation = (
  options: OmitMutationOptions<
    typeof apiClient.superadmin.updateOrg,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.superadmin.updateOrg,
    ...options,
  });
};
