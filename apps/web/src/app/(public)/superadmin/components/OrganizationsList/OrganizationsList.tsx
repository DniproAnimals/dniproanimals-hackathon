"use client";
import { useSuperadminOrgsQuery } from "@/shared/query-hooks";
import { OrganizationCard } from "./components/OrganizationCard";
import { OrganizationsEmpty } from "./components/OrganizationsEmpty";
import { OrganizationsLoading } from "./components/OrganizationsLoading";

export function OrganizationsList() {
  const { data: organizations = [], isLoading } = useSuperadminOrgsQuery();

  if (isLoading) {
    return <OrganizationsLoading />;
  }

  if (organizations.length === 0) {
    return <OrganizationsEmpty />;
  }

  return (
    <div className="space-y-3">
      {organizations.map((organization) => (
        <OrganizationCard key={organization.id} organization={organization} />
      ))}
    </div>
  );
}
