"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useSpeciesQuery = (
  options: OmitQueryOptions<
    typeof apiClient.animals.listSpecies,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.animals.listSpecies()],
    queryFn: () => apiClient.animals.listSpecies(),
    ...options,
  });
};
