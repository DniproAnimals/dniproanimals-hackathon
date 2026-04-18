"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import type { ListAnimalsQuery } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useAnimalsQuery = (
  query: ListAnimalsQuery = {},
  options: OmitQueryOptions<
    typeof apiClient.animals.list,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.animals.list(), query],
    queryFn: () => apiClient.animals.list(query),
    ...options,
  });
};
