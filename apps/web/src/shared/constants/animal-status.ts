// TODO: labels may move to server-side (i18n / admin-editable).
// See AGENTS.md §7.2: editable business data belongs on the server.

import type { AnimalStatus } from "@dniproanimals/contracts";

export const ANIMAL_STATUS_LABEL: Record<AnimalStatus, string> = {
  available: "Шукає дім",
  reserved: "Заброньовано",
  adopted: "Усиновлено",
};

export type AnimalStatusBadgeVariant = "success" | "info" | "warning";

export const ANIMAL_STATUS_BADGE_VARIANT: Record<
  AnimalStatus,
  AnimalStatusBadgeVariant
> = {
  available: "success",
  reserved: "warning",
  adopted: "info",
};
