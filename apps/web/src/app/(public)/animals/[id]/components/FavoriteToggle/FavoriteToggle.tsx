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
  const { data: favorites } = useFavoritesQuery({ enabled: !!user });
  const toggle = useToggleFavoriteMutation();

  if (!user) return null;

  const isFav = (favorites ?? []).some((f) => f.id === animalId);

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => toggle.mutate({ animalId })}
      aria-label={isFav ? "Прибрати з обраного" : "Додати до обраного"}
    >
      {isFav ? (
        <IconHeartFilled size={22} color="#ced48c" />
      ) : (
        <IconHeart size={22} color="#ccc" />
      )}
    </Button>
  );
}
