"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useQuery } from "@tanstack/react-query";

export function useNotificationsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.notifications.list,
    queryFn: () => apiClient.notifications.list(),
    enabled,
  });
}
