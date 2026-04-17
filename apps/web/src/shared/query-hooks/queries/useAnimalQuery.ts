"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useQuery } from "@tanstack/react-query";

export function useAnimalQuery(id: number | null | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.animals.detail(id) : ["animals", "none"],
    queryFn: () => apiClient.animals.get(id as number),
    enabled: !!id,
  });
}
