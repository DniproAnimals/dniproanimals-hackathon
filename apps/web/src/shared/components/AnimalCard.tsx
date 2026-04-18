"use client";
import ImageFallback from "@/shared/components/ImageFallback";
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
import { useCallback, useEffect, useRef, useState } from "react";

function getAgeLabel(months: number | null): string {
  if (!months) return "Невідомо";
  if (months < 12) return `${months} міс.`;
  const years = Math.floor(months / 12);
  const yWord = years === 1 ? "рік" : years < 5 ? "роки" : "років";
  return `${years} ${yWord}`;
}

function getSizeLabel(size: string | null): string {
  if (size === "small") return "Малий";
  if (size === "medium") return "Середній";
  if (size === "large") return "Великий";
  return "—";
}

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

export default function AnimalCard({
  animal,
  index = 0,
}: {
  animal: Animal;
  index?: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { data: user } = useMeQuery();
  const { data: favorites } = useFavoritesQuery({ enabled: !!user });
  const toggleFavMut = useToggleFavoriteMutation();
  const isFav = (favorites ?? []).some((f) => f.id === animal.id);
  const photos: string[] = animal.photos ?? [];
  const tint = tintColors[index % tintColors.length];

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFlipped(!flipped);
  };

  // Auto-slide photos on hover
  const startSlideshow = useCallback(() => {
    if (photos.length <= 1 || flipped) return;
    intervalRef.current = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % photos.length);
    }, 1200);
  }, [photos.length, flipped]);

  const clearSlideshow = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (hovered && !flipped) {
      startSlideshow();
    }
    return clearSlideshow;
  }, [hovered, flipped, startSlideshow, clearSlideshow]);

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setCurrentPhoto(0);
      }}
    >
      <div className="relative aspect-square perspective-midrange mb-2.5">
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-500 transform-3d",
            flipped && "transform-[rotateY(180deg)]",
          )}
        >
          <Link
            href={`/animals/${animal.id}`}
            className="absolute inset-0 backface-hidden"
          >
            <div
              className={cn(
                "relative w-full h-full rounded-2xl overflow-hidden",
                tint,
              )}
            >
              {/* All photos stacked, only currentPhoto visible */}
              {photos.length > 0 ? (
                photos.map((photo, i) => (
                  <ImageFallback
                    key={i}
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
                <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-light">
                  {animal.type === "dog"
                    ? "🐕"
                    : animal.type === "cat"
                      ? "🐈"
                      : "🐾"}
                </div>
              )}

              {/* Photo dots */}
              {photos.length > 1 && hovered && !flipped && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                  {photos.map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "rounded-full transition-all",
                        i === currentPhoto
                          ? "w-4 h-1.5 bg-white"
                          : "w-1.5 h-1.5 bg-white/50",
                      )}
                    />
                  ))}
                </div>
              )}

              {animal.status === "reserved" && (
                <Badge
                  variant="reserved"
                  size="sm"
                  className="absolute top-2.5 left-2.5"
                >
                  Зарезервовано
                </Badge>
              )}
              {animal.status === "adopted" && (
                <Badge
                  variant="adopted"
                  size="sm"
                  className="absolute top-2.5 left-2.5"
                >
                  Знайшов дім!
                </Badge>
              )}
            </div>
          </Link>

          <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)]">
            <div className="w-full h-full rounded-2xl bg-primary p-3.5 flex flex-col">
              <p className="text-sm font-bold text-foreground mb-2">
                {animal.name}
              </p>

              <div className="flex-1 flex flex-col justify-center divide-y divide-foreground/10">
                <div className="flex items-center gap-2 py-1.5">
                  <IconMapPinFilled
                    width={14}
                    height={14}
                    className="text-foreground/60 shrink-0"
                  />
                  <span className="text-[11px] font-semibold text-foreground">
                    Місце
                  </span>
                  <span className="text-[11px] text-foreground/70 ml-auto truncate max-w-[45%] text-right">
                    {animal.contactLocation || "Дніпро"}
                  </span>
                </div>
                <div className="flex items-center gap-2 py-1.5">
                  <IconRuler
                    width={14}
                    height={14}
                    className="text-foreground/60 shrink-0"
                  />
                  <span className="text-[11px] font-semibold text-foreground">
                    Розмір
                  </span>
                  <span className="text-[11px] text-foreground/70 ml-auto">
                    {getSizeLabel(animal.size)}
                    {animal.weightKg ? ` · ${animal.weightKg} кг` : ""}
                  </span>
                </div>
                {animal.color && (
                  <div className="flex items-center gap-2 py-1.5">
                    <IconPalette
                      width={14}
                      height={14}
                      className="text-foreground/60 shrink-0"
                    />
                    <span className="text-[11px] font-semibold text-foreground">
                      Колір
                    </span>
                    <span className="text-[11px] text-foreground/70 ml-auto">
                      {animal.color}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 py-1.5">
                  <IconCircleCheckFilled
                    width={14}
                    height={14}
                    className="text-foreground/60 shrink-0"
                  />
                  <span className="text-[11px] font-semibold text-foreground">
                    Вакцинація
                  </span>
                  <span className="text-[11px] text-foreground/70 ml-auto">
                    {animal.vaccinated ? "Так" : "Ні"}
                  </span>
                </div>
                <div className="flex items-center gap-2 py-1.5">
                  <IconCircleX
                    width={14}
                    height={14}
                    className="text-foreground/60 shrink-0"
                  />
                  <span className="text-[11px] font-semibold text-foreground">
                    Стерилізація
                  </span>
                  <span className="text-[11px] text-foreground/70 ml-auto">
                    {animal.sterilized ? "Так" : "Ні"}
                  </span>
                </div>
                <div className="flex items-center gap-2 py-1.5">
                  <IconBook
                    width={14}
                    height={14}
                    className="text-foreground/60 shrink-0"
                  />
                  <span className="text-[11px] font-semibold text-foreground">
                    Навчено
                  </span>
                  <span className="text-[11px] text-foreground/70 ml-auto">
                    {animal.trained ? "Так" : "Ні"}
                  </span>
                </div>
              </div>

              <Link
                href={`/animals/${animal.id}`}
                className="block mt-2 text-center bg-foreground/10 text-foreground text-[11px] font-semibold py-1.5 rounded-lg hover:bg-foreground/20 transition-colors"
              >
                Детальніше →
              </Link>
            </div>
          </div>
        </div>

        {user && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavMut.mutate({ animalId: animal.id });
            }}
            className={cn(
              "absolute top-2.5 right-2.5 z-10 size-8 rounded-full backdrop-blur-sm shadow-md flex items-center justify-center transition-all hover:bg-white",
              isFav
                ? "bg-white opacity-100 text-primary"
                : "bg-white/90 opacity-0 group-hover:opacity-100 text-foreground",
            )}
            aria-label={isFav ? "Прибрати з обраного" : "Додати до обраного"}
          >
            <IconPawFilled
              className={cn(
                "size-4",
                isFav ? "text-primary" : "text-foreground",
              )}
            />
          </button>
        )}

        <button
          onClick={handleFlip}
          className={cn(
            "absolute bottom-2.5 right-2.5 z-10 size-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-all hover:bg-white",
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

      {/* Name + info below card */}
      <div className="px-1">
        <div className="flex items-center gap-1.5">
          <Link
            href={`/animals/${animal.id}`}
            className="font-semibold text-[15px] text-foreground hover:underline"
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
        <p className="text-xs text-gray-medium mt-0.5">
          {getAgeLabel(animal.ageMonths)} | {animal.breed || "Мікс"}
        </p>
      </div>
    </div>
  );
}
