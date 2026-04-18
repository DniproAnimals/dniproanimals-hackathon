"use client";
import { ORG_STATUS_BADGE_VARIANT, ORG_STATUS_LABEL } from "@/shared/constants";
import {
  useSuperadminDeleteOrgMutation,
  useSuperadminUpdateOrgMutation,
} from "@/shared/query-hooks";
import type { Organization } from "@dniproanimals/contracts";
import { Badge, Button, Card } from "@dniproanimals/ui";

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const updateMutation = useSuperadminUpdateOrgMutation();
  const deleteMutation = useSuperadminDeleteOrgMutation();

  const updateStatus = (status: "approved" | "rejected") => {
    updateMutation.mutate({ id: organization.id, status });
  };

  const deleteOrg = () => {
    if (
      !confirm(
        "Видалити організацію? Це видалить всіх волонтерів та скине роль власника.",
      )
    )
      return;
    deleteMutation.mutate({ id: organization.id });
  };

  return (
    <Card className="bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{organization.name}</h3>
            <Badge
              variant={ORG_STATUS_BADGE_VARIANT[organization.status]}
              size="sm"
            >
              {ORG_STATUS_LABEL[organization.status]}
            </Badge>
          </div>
          {organization.location && (
            <p className="text-xs text-gray-medium mb-1">
              📍 {organization.location}
            </p>
          )}
          {organization.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {organization.description}
            </p>
          )}
          <p className="text-[10px] text-gray-400 mt-1">
            {new Date(organization.createdAt).toLocaleDateString("uk-UA")}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {organization.status !== "approved" && (
            <Button
              size="sm"
              variant="success"
              shape="square"
              onClick={() => updateStatus("approved")}
              disabled={updateMutation.isPending}
            >
              Схвалити
            </Button>
          )}
          {organization.status !== "rejected" && (
            <Button
              size="sm"
              variant="destructive"
              shape="square"
              onClick={() => updateStatus("rejected")}
              disabled={updateMutation.isPending}
            >
              Відхилити
            </Button>
          )}
          <Button
            size="sm"
            variant="subtle"
            shape="square"
            onClick={deleteOrg}
            disabled={deleteMutation.isPending}
          >
            Видалити
          </Button>
        </div>
      </div>
    </Card>
  );
}
