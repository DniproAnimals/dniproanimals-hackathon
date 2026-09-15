"use client";

import { AnimalCard } from "@/shared/components/AnimalCard";
import { Animal } from "@dniproanimals/contracts";
import { FavouritesEmpty } from "./components/FavouritesEmpty";
import { FavouritesLoading } from "./components/FavouritesLoading";

interface FavouritesListProps {
  animals: Animal[];
  isLoading: boolean;
}

export function FavouritesList({ isLoading, animals }: FavouritesListProps) {
  if (isLoading) {
    return <FavouritesLoading />;
  }

  if (animals.length === 0) {
    return <FavouritesEmpty />;
  }

  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
      {animals.map((animal, index) => (
        <AnimalCard key={animal.id} animal={animal} index={index} />
      ))}
    </div>
  );
}
