"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/lib/UserContext";
import type { Animal } from "@/lib/db";
import {
  IconMapPinFilled,
  IconRuler,
  IconPalette,
  IconCircleCheckFilled,
  IconForbidFilled,
  IconBookFilled,
  IconPawFilled,
  IconPaw,
  IconRefresh,
} from "@tabler/icons-react";

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

export default function AnimalCard({ animal, index = 0 }: { animal: Animal; index?: number }) {
  const [flipped, setFlipped] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { user, favoriteIds, toggleFavorite } = useUser();
  const isFav = favoriteIds.includes(animal.id);
  const photos: string[] = JSON.parse(animal.photos || "[]");
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

  const stopSlideshow = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentPhoto(0);
  }, []);

  useEffect(() => {
    if (hovered && !flipped) {
      startSlideshow();
    } else {
      stopSlideshow();
    }
    return stopSlideshow;
  }, [hovered, flipped, startSlideshow, stopSlideshow]);

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card container with perspective */}
      <div className="relative aspect-square [perspective:800px] mb-2.5">
        <div
          className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front — photo with zoom + slideshow */}
          <Link
            href={`/animals/${animal.id}`}
            className="absolute inset-0 [backface-visibility:hidden]"
          >
            <div className={`relative w-full h-full rounded-2xl overflow-hidden ${tint}`}>
              {/* All photos stacked, only currentPhoto visible */}
              {photos.length > 0 ? (
                photos.map((photo, i) => (
                  <Image
                    key={i}
                    src={photo}
                    alt={animal.name}
                    fill
                    className={`object-cover transition-all duration-700 ${
                      i === currentPhoto ? "opacity-100" : "opacity-0"
                    } ${hovered && !flipped ? "scale-110" : "scale-100"}`}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={i === 0}
                  />
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-light">
                  {animal.type === "dog" ? "🐕" : animal.type === "cat" ? "🐈" : "🐾"}
                </div>
              )}

              {/* Photo dots */}
              {photos.length > 1 && hovered && !flipped && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                  {photos.map((_, i) => (
                    <span
                      key={i}
                      className={`rounded-full transition-all ${
                        i === currentPhoto
                          ? "w-4 h-1.5 bg-white"
                          : "w-1.5 h-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}

              {animal.status === "reserved" && (
                <span className="absolute top-2.5 left-2.5 bg-yellow-500/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                  Зарезервовано
                </span>
              )}
              {animal.status === "adopted" && (
                <span className="absolute top-2.5 left-2.5 bg-green-accent/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                  Знайшов дім!
                </span>
              )}
            </div>
          </Link>

          {/* Back — Fast Facts */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="w-full h-full rounded-2xl bg-[#ced48c] p-3.5 flex flex-col">
              <p className="text-sm font-bold text-foreground mb-2">
                {animal.name}
              </p>

              <div className="flex-1 flex flex-col justify-center divide-y divide-foreground/10">
                <div className="flex items-center gap-2 py-1.5">
                  <IconMapPinFilled width={14} height={14} className="text-foreground/60 flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-foreground">Місце</span>
                  <span className="text-[11px] text-foreground/70 ml-auto truncate max-w-[45%] text-right">{animal.contact_location || "Дніпро"}</span>
                </div>
                <div className="flex items-center gap-2 py-1.5">
                  <IconRuler width={14} height={14} className="text-foreground/60 flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-foreground">Розмір</span>
                  <span className="text-[11px] text-foreground/70 ml-auto">{getSizeLabel(animal.size)}{animal.weight_kg ? ` · ${animal.weight_kg} кг` : ""}</span>
                </div>
                {animal.color && (
                  <div className="flex items-center gap-2 py-1.5">
                    <IconPalette width={14} height={14} className="text-foreground/60 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-foreground">Колір</span>
                    <span className="text-[11px] text-foreground/70 ml-auto">{animal.color}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 py-1.5">
                  <IconCircleCheckFilled width={14} height={14} className="text-foreground/60 flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-foreground">Вакцинація</span>
                  <span className="text-[11px] text-foreground/70 ml-auto">{animal.vaccinated ? "Так" : "Ні"}</span>
                </div>
                <div className="flex items-center gap-2 py-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                  <span className="text-[11px] font-semibold text-foreground">Стерилізація</span>
                  <span className="text-[11px] text-foreground/70 ml-auto">{animal.sterilized ? "Так" : "Ні"}</span>
                </div>
                <div className="flex items-center gap-2 py-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60 flex-shrink-0"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                  <span className="text-[11px] font-semibold text-foreground">Навчено</span>
                  <span className="text-[11px] text-foreground/70 ml-auto">{animal.trained ? "Так" : "Ні"}</span>
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

        {/* Favorite paw button — top right */}
        {user && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(animal.id); }}
            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full backdrop-blur-sm shadow-md flex items-center justify-center transition-all hover:bg-white ${
              isFav ? "bg-white opacity-100" : "bg-white/90 opacity-0 group-hover:opacity-100"
            }`}
            aria-label={isFav ? "Прибрати з обраного" : "Додати до обраного"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? "#ced48c" : "none"} stroke={isFav ? "#ced48c" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21c-1.5 0-5-2.5-7.5-6C2 11 2 7.5 4 5.5S9 3 12 6c3-3 6-2.5 8-0.5s2 5.5-.5 9.5C17 19 13.5 21 12 21z"/>
              <circle cx="7.5" cy="7" r="1.5"/><circle cx="16.5" cy="7" r="1.5"/><circle cx="10" cy="4.5" r="1.5"/><circle cx="14" cy="4.5" r="1.5"/>
            </svg>
          </button>
        )}

        {/* Flip button — bottom right */}
        <button
          onClick={handleFlip}
          className={`absolute bottom-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-all hover:bg-white ${
            flipped ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          aria-label={flipped ? "Показати фото" : "Показати факти"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${flipped ? "rotate-180" : ""}`}>
            <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 014-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 01-4 4H3" />
          </svg>
        </button>
      </div>

      {/* Name + info below card */}
      <div className="px-1">
        <div className="flex items-center gap-1.5">
          <Link href={`/animals/${animal.id}`} className="font-semibold text-[15px] text-foreground hover:underline">
            {animal.name}
          </Link>
          <span className={`text-sm ${animal.sex === "male" ? "text-blue-400" : "text-pink-400"}`}>
            {animal.sex === "male" ? "♂" : "♀"}
          </span>
        </div>
        <p className="text-xs text-gray-medium mt-0.5">
          {getAgeLabel(animal.age_months)} | {animal.breed || "Мікс"}
        </p>
      </div>
    </div>
  );
}
