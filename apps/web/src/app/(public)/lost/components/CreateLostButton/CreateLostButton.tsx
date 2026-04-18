"use client";
import { IconSearch } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";

interface CreateLostButtonProps {
  onClick: () => void;
}

export function CreateLostButton({ onClick }: CreateLostButtonProps) {
  return (
    <Button variant="destructive" size="md" onClick={onClick}>
      <IconSearch size={14} />
      Загубив тварину
    </Button>
  );
}
