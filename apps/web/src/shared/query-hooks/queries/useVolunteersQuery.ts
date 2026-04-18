"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useVolunteersQuery = (
  options: OmitQueryOptions<
    typeof apiClient.volunteers.list,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.volunteers.list()],
    queryFn: () => apiClient.volunteers.list(),
    ...options,
  });
};
