import { AddSpeciesDialog } from "../AddSpeciesDialog";
import { AnimalsCount } from "./components/AnimalsCount";
import { AnimalsSearchField } from "./components/AnimalsSearchField";
import { AnimalStatusFilter } from "./components/AnimalStatusFilter";
import { AnimalTypeFilter } from "./components/AnimalTypeFilter";

export function AnimalsFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <AnimalsSearchField />
      <AddSpeciesDialog />
      <AnimalTypeFilter />
      <AnimalStatusFilter />
      <AnimalsCount />
    </div>
  );
}
