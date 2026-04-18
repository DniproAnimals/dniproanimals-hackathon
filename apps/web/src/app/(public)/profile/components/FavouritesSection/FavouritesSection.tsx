"use client";
import { useFavoritesQuery } from "@/shared/query-hooks";
import { FavouritesList } from "./components/FavouritesList";

export function FavouritesSection() {
  const { data: favorites = [], isLoading } = useFavoritesQuery();
  const count = favorites.length ?? 0;

  return (
    <>
      <h2 className="text-xl font-bold mb-4">
        Обрані тварини
        {count > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-medium">
            {count}
          </span>
        )}
      </h2>
      <FavouritesList isLoading={isLoading} animals={favorites} />
    </>
  );
}
