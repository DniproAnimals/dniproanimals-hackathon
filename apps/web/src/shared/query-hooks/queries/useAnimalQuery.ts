"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useAnimalQuery = (
  id: number,
  options: OmitQueryOptions<
    typeof apiClient.animals.get,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.animals.get({ id })],
    queryFn: () => apiClient.animals.get(id),
    ...options,
  });
};
