"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteVolunteerMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.volunteers.delete,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.volunteers.list }),
  });
}
