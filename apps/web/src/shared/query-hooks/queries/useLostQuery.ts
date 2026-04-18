"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import type { ListLostQuery } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useLostQuery = (
  query: ListLostQuery = {},
  options: OmitQueryOptions<
    typeof apiClient.lost.list,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.lost.list(), query],
    queryFn: () => apiClient.lost.list(query),
    ...options,
  });
};
