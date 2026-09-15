"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import type { ListBreedsQuery } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useBreedsQuery = (
  query?: ListBreedsQuery,
  options: OmitQueryOptions<
    typeof apiClient.animals.listBreeds,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.animals.listBreeds(), query],
    queryFn: () => apiClient.animals.listBreeds(query),
    ...options,
  });
};
