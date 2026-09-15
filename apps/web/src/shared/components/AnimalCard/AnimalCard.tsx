"use client";

import { ImageFallback } from "@/shared/components/ImageFallback";
import { getAnimalAgeLabel, getAnimalSizeLabel } from "@/shared/constants";
import {
  useFavoritesQuery,
  useMeQuery,
  useToggleFavoriteMutation,
} from "@/shared/query-hooks";
import type { Animal } from "@dniproanimals/contracts";
import {
  IconBook,
  IconCircleCheckFilled,
  IconCircleX,
  IconMapPinFilled,
  IconPalette,
  IconPawFilled,
  IconRefresh,
  IconRuler,
} from "@dniproanimals/icons";
import { Badge, cn } from "@dniproanimals/ui";
import Link from "next/link";
import { useEffect, useState } from "react";

const tintColors = [
  "bg-green-50",
  "bg-emerald-50",
  "bg-teal-50",
  "bg-lime-50",
  "bg-amber-50",
  "bg-sky-50",
  "bg-rose-50",
  "bg-violet-50",
];

export function AnimalCard({
  animal,
  index = 0,
}: {
  animal: Animal;
  index?: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [hovered, setHovered] = useState(false);

  const { data: user } = useMeQuery();

  const { data: favorites } = useFavoritesQuery({
    enabled: !!user,
  });

  const toggleFavMut = useToggleFavoriteMutation();

  const photos: string[] = animal.photos ?? [];
  const tint = tintColors[index % tintColors.length];

  const isFav = (favorites ?? []).some((favorite) => favorite.id === animal.id);

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setFlipped((previous) => !previous);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (toggleFavMut.isPending) {
      return;
    }

    toggleFavMut.mutate({
      animalId: animal.id,
    });
  };

  useEffect(() => {
    if (!hovered || flipped || photos.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentPhoto((previous) => (previous + 1) % photos.length);
    }, 1200);

    return () => {
      window.clearInterval(interval);
    };
  }, [hovered, flipped, photos.length]);

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setCurrentPhoto(0);
      }}
    >
      <div className="relative mb-2.5 aspect-square perspective-midrange">
        <div
          className={cn(
            "relative h-full w-full transform-3d transition-transform duration-500",
            flipped && "transform-[rotateY(180deg)]",
          )}
        >
          {/* FRONT */}
          <Link
            href={`/animals/${animal.id}`}
            className="absolute inset-0 backface-hidden"
          >
            <div
              className={cn(
                "relative h-full w-full overflow-hidden rounded-2xl",
                tint,
              )}
            >
              {/* Photos */}
              {photos.length > 0 ? (
                photos.map((photo, i) => (
                  <ImageFallback
                    key={photo}
                    src={photo}
                    alt={animal.name}
                    fill
                    className={cn(
                      "object-cover transition-all duration-700",
                      i === currentPhoto ? "opacity-100" : "opacity-0",
                      hovered && !flipped ? "scale-110" : "scale-100",
                    )}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={i === 0}
                  />
                ))
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-light text-4xl">
                  {animal.type === "dog"
                    ? "🐕"
                    : animal.type === "cat"
                      ? "🐈"
                      : "🐾"}
                </div>
              )}

              {/* Photo dots */}
              {photos.length > 1 && hovered && !flipped && (
                <div className="absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 gap-1">
                  {photos.map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "rounded-full transition-all",
                        i === currentPhoto
                          ? "h-1.5 w-4 bg-white"
                          : "h-1.5 w-1.5 bg-white/50",
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Status */}
              {animal.status === "reserved" && (
                <Badge
                  variant="reserved"
                  size="sm"
                  className="absolute left-2.5 top-2.5"
                >
                  Зарезервовано
                </Badge>
              )}

              {animal.status === "adopted" && (
                <Badge
                  variant="adopted"
                  size="sm"
                  className="absolute left-2.5 top-2.5"
                >
                  Знайшов дім!
                </Badge>
              )}
            </div>
          </Link>

          {/* BACK */}
          <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)]">
            <div className="flex h-full w-full flex-col rounded-2xl bg-primary p-3.5">
              <p className="mb-2 text-sm font-bold text-foreground">
                {animal.name}
              </p>

              <div className="flex flex-1 flex-col justify-center divide-y divide-foreground/10">
                <div className="flex items-center gap-2 py-1.5">
                  <IconMapPinFilled
                    width={14}
                    height={14}
                    className="shrink-0 text-foreground/60"
                  />

                  <span className="text-[11px] font-semibold text-foreground">
                    Місце
                  </span>

                  <span className="ml-auto max-w-[45%] truncate text-right text-[11px] text-foreground/70">
                    {animal.contactLocation || "Дніпро"}
                  </span>
                </div>

                <div className="flex items-center gap-2 py-1.5">
                  <IconRuler
                    width={14}
                    height={14}
                    className="shrink-0 text-foreground/60"
                  />

                  <span className="text-[11px] font-semibold text-foreground">
                    Розмір
                  </span>

                  <span className="ml-auto text-[11px] text-foreground/70">
                    {getAnimalSizeLabel(animal.size)}
                    {animal.weightKg ? ` · ${animal.weightKg} кг` : ""}
                  </span>
                </div>

                {animal.color && (
                  <div className="flex items-center gap-2 py-1.5">
                    <IconPalette
                      width={14}
                      height={14}
                      className="shrink-0 text-foreground/60"
                    />

                    <span className="text-[11px] font-semibold text-foreground">
                      Колір
                    </span>

                    <span className="ml-auto text-[11px] text-foreground/70">
                      {animal.color}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 py-1.5">
                  <IconCircleCheckFilled
                    width={14}
                    height={14}
                    className="shrink-0 text-foreground/60"
                  />

                  <span className="text-[11px] font-semibold text-foreground">
                    Вакцинація
                  </span>

                  <span className="ml-auto text-[11px] text-foreground/70">
                    {animal.vaccinated ? "Так" : "Ні"}
                  </span>
                </div>

                <div className="flex items-center gap-2 py-1.5">
                  <IconCircleX
                    width={14}
                    height={14}
                    className="shrink-0 text-foreground/60"
                  />

                  <span className="text-[11px] font-semibold text-foreground">
                    Стерилізація
                  </span>

                  <span className="ml-auto text-[11px] text-foreground/70">
                    {animal.sterilized ? "Так" : "Ні"}
                  </span>
                </div>

                <div className="flex items-center gap-2 py-1.5">
                  <IconBook
                    width={14}
                    height={14}
                    className="shrink-0 text-foreground/60"
                  />

                  <span className="text-[11px] font-semibold text-foreground">
                    Навчено
                  </span>

                  <span className="ml-auto text-[11px] text-foreground/70">
                    {animal.trained ? "Так" : "Ні"}
                  </span>
                </div>
              </div>

              <Link
                href={`/animals/${animal.id}`}
                className="mt-2 block rounded-lg bg-foreground/10 py-1.5 text-center text-[11px] font-semibold text-foreground transition-colors hover:bg-foreground/20"
              >
                Детальніше →
              </Link>
            </div>
          </div>
        </div>

        {/* FAVORITE */}
        {user && (
          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={toggleFavMut.isPending}
            className={cn(
              "absolute right-2.5 top-2.5 z-20 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white active:scale-90",
              "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
              isFav && "opacity-100",
              toggleFavMut.isPending && "cursor-wait opacity-70",
            )}
            aria-label={isFav ? "Прибрати з обраного" : "Додати до обраного"}
            aria-pressed={isFav}
          >
            <IconPawFilled
              className={cn(
                "size-4 transition-all duration-200",
                isFav ? "text-primary" : "text-foreground",
                toggleFavMut.isPending && "scale-90",
              )}
            />
          </button>
        )}

        {/* FLIP */}
        <button
          type="button"
          onClick={handleFlip}
          className={cn(
            "absolute bottom-2.5 right-2.5 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-white active:scale-90",
            flipped ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          aria-label={flipped ? "Показати фото" : "Показати факти"}
        >
          <IconRefresh
            className={cn(
              "size-4 transition-transform duration-300",
              flipped && "rotate-180",
            )}
          />
        </button>
      </div>

      {/* Name + info */}
      <div className="px-1">
        <div className="flex items-center gap-1.5">
          <Link
            href={`/animals/${animal.id}`}
            className="text-[15px] font-semibold text-foreground hover:underline"
          >
            {animal.name}
          </Link>

          <span
            className={cn(
              "text-sm",
              animal.sex === "male" ? "text-blue-400" : "text-pink-400",
            )}
          >
            {animal.sex === "male" ? "♂" : "♀"}
          </span>
        </div>

        <p className="mt-0.5 text-xs text-gray-medium">
          {getAnimalAgeLabel(animal.ageMonths)} | {animal.breed || "Мікс"}
        </p>
      </div>
    </div>
  );
}
