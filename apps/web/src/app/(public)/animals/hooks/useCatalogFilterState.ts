"use client";
import { parseAsString, useQueryStates } from "nuqs";

export function useCatalogFilterState() {
  return useQueryStates({
    type: parseAsString,
    sex: parseAsString,
    size: parseAsString,
    breed: parseAsString,
    color: parseAsString,
    vaccinated: parseAsString,
    sterilized: parseAsString,
    trained: parseAsString,
    q: parseAsString,
    sort: parseAsString,
  });
}
