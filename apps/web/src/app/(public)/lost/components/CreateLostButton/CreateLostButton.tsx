"use client";
import { IconSearch } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import { parseAsBoolean, useQueryState } from "nuqs";

export function CreateLostButton() {
  const [, setCreateOpen] = useQueryState(
    "createLost",
    parseAsBoolean.withDefault(false),
  );

  return (
    <Button variant="destructive" size="md" onClick={() => setCreateOpen(true)}>
      <IconSearch size={14} />
      Загубив тварину
    </Button>
  );
}
