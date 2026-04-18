"use client";
import { orgStatuses } from "@dniproanimals/contracts";
import { parseAsStringEnum, useQueryStates } from "nuqs";

export function useOrgsFilterState() {
  return useQueryStates({
    status: parseAsStringEnum([...orgStatuses]),
  });
}
