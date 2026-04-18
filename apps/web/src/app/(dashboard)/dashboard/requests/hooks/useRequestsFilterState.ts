"use client";
import { adoptionStatusSchema } from "@dniproanimals/contracts";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export function useRequestsFilterState() {
  return useQueryStates({
    q: parseAsString,
    status: parseAsStringEnum([...adoptionStatusSchema.options]),
  });
}
