"use client";
import { volunteerStatuses } from "@dniproanimals/contracts";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export function useVolunteersFilterState() {
  return useQueryStates({
    vq: parseAsString,
    vstatus: parseAsStringEnum([...volunteerStatuses]),
  });
}
