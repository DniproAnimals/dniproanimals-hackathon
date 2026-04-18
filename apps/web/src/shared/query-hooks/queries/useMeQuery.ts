"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useMeQuery = (
  options: OmitQueryOptions<
    typeof apiClient.auth.me,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.auth.me()],
    queryFn: () => apiClient.auth.me(),
    retry: false,
    ...options,
  });
};
