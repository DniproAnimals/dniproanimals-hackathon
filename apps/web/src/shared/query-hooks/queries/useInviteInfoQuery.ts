"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useQuery } from "@tanstack/react-query";

export function useInviteInfoQuery(token: string | null | undefined) {
  return useQuery({
    queryKey: token ? queryKeys.volunteers.invite(token) : ["invite", "none"],
    queryFn: () => apiClient.volunteers.inviteInfo({ token: token as string }),
    enabled: !!token,
    retry: false,
  });
}
