import { ORG_STATUS_BADGE_VARIANT, ORG_STATUS_LABEL } from "@/shared/constants";
import type { Organization } from "@dniproanimals/contracts";
import { Badge, Card } from "@dniproanimals/ui";
import Link from "next/link";
import { OrganizationCardActions } from "./components/OrganizationCardActions";

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <Link
          href={`/organizations/${organization.id}`}
          target="_blank"
          className="flex-1 min-w-0 hover:opacity-75 transition-opacity"
        >
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">
              {organization.name}
            </h3>
            <Badge
              variant={ORG_STATUS_BADGE_VARIANT[organization.status]}
              size="sm"
            >
              {ORG_STATUS_LABEL[organization.status]}
            </Badge>
          </div>
          {organization.description && (
            <p className="text-sm text-gray-medium line-clamp-2 mb-2">
              {organization.description}
            </p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-gray-medium">
            {organization.location && <span>{organization.location}</span>}
            {organization.email && <span>{organization.email}</span>}
            {organization.phone && <span>{organization.phone}</span>}
            {organization.website && <span>{organization.website}</span>}
            <span>
              {new Date(organization.createdAt).toLocaleDateString("uk-UA")}
            </span>
          </div>
        </Link>
        <OrganizationCardActions organization={organization} />
      </div>
    </Card>
  );
}
