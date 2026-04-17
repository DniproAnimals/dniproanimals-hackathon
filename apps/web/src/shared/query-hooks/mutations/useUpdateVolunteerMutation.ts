"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateVolunteerMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.volunteers.update,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.volunteers.list }),
  });
}
