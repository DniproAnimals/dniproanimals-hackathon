"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import type { ListVolunteersQuery } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useVolunteersQuery = (
  params: ListVolunteersQuery = {},
  options: OmitQueryOptions<
    typeof apiClient.volunteers.list,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.volunteers.list(), params],
    queryFn: () => apiClient.volunteers.list(params),
    ...options,
  });
};
