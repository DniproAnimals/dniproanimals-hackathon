"use client";
import { animalStatusSchema } from "@dniproanimals/contracts";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export function useAnimalsFilterState() {
  return useQueryStates({
    q: parseAsString,
    type: parseAsString,
    status: parseAsStringEnum([...animalStatusSchema.options]),
  });
}
