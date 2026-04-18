"use client";
import { useMeQuery } from "./useMeQuery";
import { useOrganizationQuery } from "./useOrganizationQuery";

export const useCurrentOrg = () => {
  const { data: user, isLoading: userLoading } = useMeQuery();
  const orgId = user?.orgId ?? 0;
  const {
    data: org,
    isLoading: orgLoading,
    refetch,
  } = useOrganizationQuery(orgId, { enabled: !!orgId });

  const isOwner = !!(user && org && org.ownerId === user.id);

  return {
    user: user ?? null,
    org: org ?? null,
    isOwner,
    isLoading: userLoading || (!!orgId && orgLoading),
    refetch: () => void refetch(),
  };
};
