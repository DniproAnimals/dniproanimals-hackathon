"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useNotificationsQuery = (
  options: OmitQueryOptions<
    typeof apiClient.notifications.list,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.notifications.list()],
    queryFn: () => apiClient.notifications.list(),
    ...options,
  });
};
