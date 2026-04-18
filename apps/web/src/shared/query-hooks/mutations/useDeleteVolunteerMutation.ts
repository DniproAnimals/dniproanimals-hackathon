"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useDeleteVolunteerMutation = (
  options: OmitMutationOptions<
    typeof apiClient.volunteers.delete,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.volunteers.delete,
    ...options,
  });
};
