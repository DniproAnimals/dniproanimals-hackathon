"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useInviteInfoQuery = (
  token: string,
  options: OmitQueryOptions<
    typeof apiClient.volunteers.inviteInfo,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.volunteers.invite(), token],
    queryFn: () => apiClient.volunteers.inviteInfo({ token }),
    retry: false,
    ...options,
  });
};
