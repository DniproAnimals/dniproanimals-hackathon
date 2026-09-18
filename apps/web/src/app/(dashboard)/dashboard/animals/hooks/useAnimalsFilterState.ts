"use client";
import { animalStatusSchema, animalTypeSchema } from "@dniproanimals/contracts";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export function useAnimalsFilterState() {
  return useQueryStates({
    q: parseAsString,
    type: parseAsStringEnum([...animalTypeSchema.options]),
    status: parseAsStringEnum([...animalStatusSchema.options]),
  });
}
