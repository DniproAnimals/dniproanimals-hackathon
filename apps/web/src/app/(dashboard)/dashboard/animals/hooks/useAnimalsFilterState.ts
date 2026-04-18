"use client";
import { animalStatusSchema } from "@dniproanimals/contracts";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

const ANIMAL_TYPES = ["dog", "cat", "other"] as const;

export function useAnimalsFilterState() {
  return useQueryStates({
    q: parseAsString,
    type: parseAsStringEnum([...ANIMAL_TYPES]),
    status: parseAsStringEnum([...animalStatusSchema.options]),
  });
}
