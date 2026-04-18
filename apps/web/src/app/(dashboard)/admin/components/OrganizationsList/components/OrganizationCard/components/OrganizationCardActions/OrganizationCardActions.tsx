"use client";
import {
  useSuperadminDeleteOrgMutation,
  useSuperadminUpdateOrgMutation,
} from "@/shared/query-hooks";
import type { Organization } from "@dniproanimals/contracts";
import { Button } from "@dniproanimals/ui";

interface OrganizationCardActionsProps {
  organization: Organization;
}

export function OrganizationCardActions({
  organization,
}: OrganizationCardActionsProps) {
  const updateMutation = useSuperadminUpdateOrgMutation();
  const deleteMutation = useSuperadminDeleteOrgMutation();

  const updateStatus = (status: "approved" | "rejected") => {
    updateMutation.mutate({ id: organization.id, status });
  };

  const deleteOrg = () => {
    if (
      !confirm(
        "Видалити організацію? Акаунти власника та волонтерів буде скинуто.",
      )
    )
      return;
    deleteMutation.mutate({ id: organization.id });
  };

  return (
    <div className="flex gap-2 shrink-0">
      {organization.status === "pending" && (
        <Button
          variant="success"
          size="sm"
          onClick={() => updateStatus("approved")}
          disabled={updateMutation.isPending}
        >
          Схвалити
        </Button>
      )}
      {organization.status === "approved" && (
        <Button
          variant="primary"
          size="sm"
          onClick={() => updateStatus("rejected")}
          disabled={updateMutation.isPending}
          className="bg-yellow-500 text-white hover:bg-yellow-600"
        >
          Заблокувати
        </Button>
      )}
      {organization.status === "rejected" && (
        <Button
          variant="success"
          size="sm"
          onClick={() => updateStatus("approved")}
          disabled={updateMutation.isPending}
        >
          Схвалити
        </Button>
      )}
      <Button
        variant="destructive"
        size="sm"
        onClick={deleteOrg}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? "..." : "Видалити"}
      </Button>
    </div>
  );
}
