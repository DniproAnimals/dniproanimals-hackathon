import { ORG_STATUS_BADGE_VARIANT, ORG_STATUS_LABEL } from "@/shared/constants";
import type { Organization } from "@dniproanimals/contracts";
import { Badge } from "@dniproanimals/ui";

export function SidebarOrgInfo({ org }: { org: Organization }) {
  return (
    <div className="px-4 py-3 border-b border-gray-border/60">
      <p className="text-sm font-medium text-foreground truncate">{org.name}</p>
      <Badge
        variant={ORG_STATUS_BADGE_VARIANT[org.status]}
        size="sm"
        className="mt-1"
      >
        {ORG_STATUS_LABEL[org.status]}
      </Badge>
    </div>
  );
}
