// TODO: labels may move to server-side (i18n / admin-editable).
// See AGENTS.md §7.2: editable business data belongs on the server.

import type { OrgStatus } from "@dniproanimals/contracts";

export const ORG_STATUS_LABEL: Record<OrgStatus, string> = {
  pending: "На модерації",
  approved: "Схвалено",
  rejected: "Відхилено",
};

export type OrgStatusBadgeVariant = "warning" | "success" | "danger";

export const ORG_STATUS_BADGE_VARIANT: Record<
  OrgStatus,
  OrgStatusBadgeVariant
> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};
