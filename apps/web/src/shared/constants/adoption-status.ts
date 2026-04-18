// TODO: labels may move to server-side (i18n / admin-editable).
// See AGENTS.md §7.2: editable business data belongs on the server.

import type { AdoptionStatus } from "@dniproanimals/contracts";

export const ADOPTION_STATUS_LABEL: Record<AdoptionStatus, string> = {
  pending: "Очікує",
  approved: "Схвалено",
  rejected: "Відхилено",
};

export type AdoptionStatusBadgeVariant = "warning" | "success" | "danger";

export const ADOPTION_STATUS_BADGE_VARIANT: Record<
  AdoptionStatus,
  AdoptionStatusBadgeVariant
> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};
