"use client";
import { useSuperadminOrgsQuery } from "@/shared/query-hooks";
import { Card, EmptyState } from "@dniproanimals/ui";
import { useOrgsFilterState } from "../../hooks/useOrgsFilterState";
import { OrganizationCard } from "./components/OrganizationCard";

export function OrganizationsList() {
  const [params] = useOrgsFilterState();
  const { data: orgs = [] } = useSuperadminOrgsQuery(params);

  if (orgs.length === 0) {
    return (
      <Card className="p-10">
        <EmptyState title="Немає організацій" />
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {orgs.map((org) => (
        <OrganizationCard key={org.id} organization={org} />
      ))}
    </div>
  );
}
