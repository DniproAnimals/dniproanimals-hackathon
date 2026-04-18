"use client";
import { useOrganizationsQuery } from "@/shared/query-hooks";
import { OrganizationCard } from "./components/OrganizationCard";
import { OrganizationsEmpty } from "./components/OrganizationsEmpty";
import { OrganizationsLoading } from "./components/OrganizationsLoading";

export function OrganizationsList() {
  const { data: organizations = [], isLoading } = useOrganizationsQuery();

  if (isLoading) {
    return <OrganizationsLoading />;
  }

  if (organizations.length === 0) {
    return <OrganizationsEmpty />;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {organizations.map((organization, index) => (
        <OrganizationCard
          key={organization.id}
          organization={organization}
          index={index}
        />
      ))}
    </div>
  );
}
