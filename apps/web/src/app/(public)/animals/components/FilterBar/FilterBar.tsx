"use client";
import { FilterActiveChips } from "./components/FilterActiveChips";
import { FilterBarHeader } from "./components/FilterBarHeader";
import { FilterBarSearchField } from "./components/FilterBarSearchField";
import { FilterBreedField } from "./components/FilterBreedField";
import { FilterColorField } from "./components/FilterColorField";
import { FilterSexField } from "./components/FilterSexField";
import { FilterSizeField } from "./components/FilterSizeField";
import { FilterTypeField } from "./components/FilterTypeField";

export function FilterBar() {
  return (
    <div className="space-y-2.5">
      <FilterBarSearchField />
      <FilterBarHeader />
      <FilterTypeField />
      <FilterBreedField />
      <FilterSexField />
      <FilterSizeField />
      <FilterColorField />
      <FilterActiveChips />
    </div>
  );
}
