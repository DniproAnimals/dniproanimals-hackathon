"use client";
import ImageFallback from "@/shared/components/ImageFallback";
import type { LostAnimal } from "@dniproanimals/contracts";
import { IconMapPin, IconPaw } from "@dniproanimals/icons";
import { cn } from "@dniproanimals/ui";

export function LostCard({
  item,
  onClick,
}: {
  item: LostAnimal;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-border overflow-hidden text-left hover:border-primary hover:shadow-md transition-all"
    >
      {item.photos[0] ? (
        <div className="relative w-full h-40 bg-gray-light">
          <ImageFallback
            src={item.photos[0]}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <span
            className={cn(
              "absolute top-2.5 left-2.5 text-[11px] px-2.5 py-0.5 rounded-full font-semibold",
              item.type === "lost"
                ? "bg-red-500 text-white"
                : "bg-green-accent text-white",
            )}
          >
            {item.type === "lost" ? "Загублено" : "Знайдено"}
          </span>
        </div>
      ) : (
        <div className="relative w-full h-24 bg-gray-light flex items-center justify-center">
          <span className="text-3xl">{item.type === "lost" ? "🔴" : "🟢"}</span>
        </div>
      )}
      <div className="p-3.5">
        <h3 className="font-semibold text-sm mb-1 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-xs text-gray-medium line-clamp-2 mb-2">
          {item.description}
        </p>
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          {item.location && (
            <span className="flex items-center gap-1">
              <IconMapPin size={11} />
              {item.location}
            </span>
          )}
          {item.animalType && (
            <span className="flex items-center gap-1">
              <IconPaw size={11} />
              {item.animalType}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
