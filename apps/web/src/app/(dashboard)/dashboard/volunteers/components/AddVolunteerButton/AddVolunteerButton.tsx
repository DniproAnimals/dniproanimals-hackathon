"use client";
import { useCurrentOrg } from "@/shared/query-hooks";
import { IconPlus } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import { parseAsBoolean, useQueryState } from "nuqs";

export function AddVolunteerButton({ size = "md" }: { size?: "sm" | "md" }) {
  const { isOwner } = useCurrentOrg();
  const [, setCreateOpen] = useQueryState(
    "createVolunteer",
    parseAsBoolean.withDefault(false),
  );

  if (!isOwner) return null;

  return (
    <Button variant="primary" size={size} onClick={() => setCreateOpen(true)}>
      <IconPlus size={size === "sm" ? 14 : 16} /> Додати
    </Button>
  );
}
