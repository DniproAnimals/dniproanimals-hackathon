"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Animal } from "@/lib/db";

function getAgeLabel(months: number | null): string {
  if (!months) return "Невідомо";
  if (months < 12) return `${months} міс.`;
  const years = Math.floor(months / 12);
  return `${years} р.`;
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
  const photos: string[] = JSON.parse(animal.photos || "[]");
  const photo = photos[0] || "/placeholder-animal.svg";
  const tint = tintColors[index % tintColors.length];

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFlipped(!flipped);
  };

  return (
    <div className="group">
      {/* Card container with perspective */}
      <div className="relative aspect-square [perspective:800px] mb-2.5">
        <div
          className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front — photo */}
          <Link
            href={`/animals/${animal.id}`}
            className="absolute inset-0 [backface-visibility:hidden]"
          >
            <div className={`relative w-full h-full rounded-2xl overflow-hidden ${tint}`}>
              <Image
                src={photo}
                alt={animal.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
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
            <div className="w-full h-full rounded-2xl bg-white border border-gray-border p-4 flex flex-col">
              <p className="text-xs font-bold text-gray-medium uppercase tracking-wider mb-3">Fast Facts</p>

              <div className="flex-1 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🐾</span>
                  <div>
                    <p className="text-[10px] text-gray-medium">Вид</p>
                    <p className="text-xs font-semibold">{animal.type === "dog" ? "Собака" : animal.type === "cat" ? "Кіт" : "Інше"}</p>
                  </div>
                </div>
                {animal.breed && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🏷️</span>
                    <div>
                      <p className="text-[10px] text-gray-medium">Порода</p>
                      <p className="text-xs font-semibold">{animal.breed}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm">📅</span>
                  <div>
                    <p className="text-[10px] text-gray-medium">Вік</p>
                    <p className="text-xs font-semibold">{getAgeLabel(animal.age_months)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{animal.sex === "male" ? "♂️" : "♀️"}</span>
                  <div>
                    <p className="text-[10px] text-gray-medium">Стать</p>
                    <p className="text-xs font-semibold">{animal.sex === "male" ? "Хлопчик" : "Дівчинка"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">📏</span>
                  <div>
                    <p className="text-[10px] text-gray-medium">Розмір</p>
                    <p className="text-xs font-semibold">{getSizeLabel(animal.size)}{animal.weight_kg ? ` · ${animal.weight_kg} кг` : ""}</p>
                  </div>
                </div>
              </div>

              {/* Tags at bottom */}
              <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-border">
                {animal.vaccinated === 1 && (
                  <span className="text-[10px] bg-green-light text-green-accent px-2 py-0.5 rounded-full font-medium">💉</span>
                )}
                {animal.sterilized === 1 && (
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">✂️</span>
                )}
                {animal.trained === 1 && (
                  <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">🎓</span>
                )}
              </div>

              {/* Link to detail */}
              <Link
                href={`/animals/${animal.id}`}
                className="block mt-2 text-center bg-[#ced48c] text-foreground text-xs font-semibold py-2 rounded-xl hover:bg-[#b8be72] transition-colors"
              >
                Детальніше →
              </Link>
            </div>
          </div>
        </div>

        {/* Flip button — appears on hover */}
        <button
          onClick={handleFlip}
          className={`absolute bottom-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-all hover:bg-white ${
            flipped ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          aria-label={flipped ? "Показати фото" : "Показати факти"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${flipped ? "rotate-180" : ""}`}
          >
            <path d="M17 1l4 4-4 4" />
            <path d="M3 11V9a4 4 0 014-4h14" />
            <path d="M7 23l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 01-4 4H3" />
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
