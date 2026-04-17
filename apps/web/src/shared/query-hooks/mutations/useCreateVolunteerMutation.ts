"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateVolunteerMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.volunteers.create,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.volunteers.list }),
  });
}
