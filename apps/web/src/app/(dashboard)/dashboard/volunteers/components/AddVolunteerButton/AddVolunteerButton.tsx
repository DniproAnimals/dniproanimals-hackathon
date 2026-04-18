"use client";
import { useCurrentOrg } from "@/shared/query-hooks";
import { IconPlus } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";

interface AddVolunteerButtonProps {
  onClick: () => void;
  size?: "sm" | "md";
}

export function AddVolunteerButton({
  onClick,
  size = "md",
}: AddVolunteerButtonProps) {
  const { isOwner } = useCurrentOrg();

  if (!isOwner) return null;

  return (
    <Button variant="primary" size={size} onClick={onClick}>
      <IconPlus size={size === "sm" ? 14 : 16} /> Додати
    </Button>
  );
}
