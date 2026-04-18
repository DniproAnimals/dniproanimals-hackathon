"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import type { ListAdoptionQuery } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const adoptionQueryOptions = (query: ListAdoptionQuery = {}) =>
  queryOptions({
    queryKey: [endpoints.adoption.list(), query],
    queryFn: () => apiClient.adoption.list(query),
  });

export const useAdoptionQuery = (
  query: ListAdoptionQuery = {},
  options: OmitQueryOptions<
    typeof apiClient.adoption.list,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.adoption.list(), query],
    queryFn: () => apiClient.adoption.list(query),
    ...options,
  });
};
