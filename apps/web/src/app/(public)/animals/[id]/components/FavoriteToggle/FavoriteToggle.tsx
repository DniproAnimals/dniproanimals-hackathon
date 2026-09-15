"use client";

import {
  useFavoritesQuery,
  useMeQuery,
  useToggleFavoriteMutation,
} from "@/shared/query-hooks";
import { IconHeart, IconHeartFilled } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";

export function FavoriteToggle({ animalId }: { animalId: number }) {
  const { data: user } = useMeQuery();

  const { data: favorites } = useFavoritesQuery({
    enabled: !!user,
  });

  const toggle = useToggleFavoriteMutation();

  if (!user) {
    return null;
  }

  const isFavorite = (favorites ?? []).some(
    (favorite) => favorite.id === animalId,
  );

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={() => toggle.mutate({ animalId })}
      disabled={toggle.isPending}
      className="cursor-pointer"
      aria-label={isFavorite ? "Прибрати з обраного" : "Додати до обраного"}
      aria-pressed={isFavorite}
    >
      {isFavorite ? (
        <IconHeartFilled
          size={22}
          color="#ced48c"
          className="transition-all duration-200"
        />
      ) : (
        <IconHeart
          size={22}
          color="#ccc"
          className="transition-all duration-200"
        />
      )}
    </Button>
  );
}
