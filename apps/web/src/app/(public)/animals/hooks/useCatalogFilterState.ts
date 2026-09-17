"use client";
import {
  animalSexSchema,
  animalSizeSchema,
  animalTypeSchema,
  listAnimalsSortSchema,
} from "@dniproanimals/contracts";
import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";

export function useCatalogFilterState() {
  return useQueryStates({
    type: parseAsStringLiteral(animalTypeSchema.options),
    sex: parseAsStringLiteral(animalSexSchema.options),
    size: parseAsStringLiteral(animalSizeSchema.options),
    breed: parseAsArrayOf(parseAsString).withDefault([]),
    color: parseAsArrayOf(parseAsString).withDefault([]),
    q: parseAsString,
    sort: parseAsStringLiteral(listAnimalsSortSchema.options).withDefault(
      "newest",
    ),
  });
}

export const CATALOG_FILTER_RESET = {
  type: null,
  sex: null,
  size: null,
  breed: null,
  color: null,
  vaccinated: null,
  sterilized: null,
  trained: null,
  q: null,
  sort: null,
} as const;

export function useCatalogActiveFilterCount() {
  const [f] = useCatalogFilterState();
  let n = 0;
  if (f.type) n++;
  if (f.sex) n++;
  if (f.size) n++;
  n += f.breed.length;
  n += f.color.length;
  return n;
}
