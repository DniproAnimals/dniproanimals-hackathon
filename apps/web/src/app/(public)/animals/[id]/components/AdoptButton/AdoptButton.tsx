"use client";
import { Button } from "@dniproanimals/ui";
import { parseAsBoolean, useQueryState } from "nuqs";

export function AdoptButton() {
  const [, setAdopt] = useQueryState(
    "adopt",
    parseAsBoolean.withDefault(false),
  );
  return (
    <Button variant="primary" size="md" onClick={() => setAdopt(true)}>
      Забрати додому
    </Button>
  );
}
