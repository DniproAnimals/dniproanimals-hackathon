"use client";
import ImageFallback from "@/shared/components/ImageFallback";
import { IconChevronLeft, IconChevronRight } from "@dniproanimals/icons";
import { Button, cn } from "@dniproanimals/ui";
import { useState } from "react";

export function AnimalGallery({
  photos,
  alt,
  fallbackEmoji,
}: {
  photos: string[];
  alt: string;
  fallbackEmoji: string;
}) {
  const [active, setActive] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-gray-light flex items-center justify-center text-7xl">
        {fallbackEmoji}
      </div>
    );
  }

  const prev = () => setActive((p) => (p - 1 + photos.length) % photos.length);
  const next = () => setActive((p) => (p + 1) % photos.length);

  return (
    <>
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-light group/photo">
        <ImageFallback
          src={photos[active]!}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {photos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              shape="pill"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm shadow opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-white"
            >
              <IconChevronLeft size={18} color="#1a1a1a" stroke={2.5} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              shape="pill"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm shadow opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-white"
            >
              <IconChevronRight size={18} color="#1a1a1a" stroke={2.5} />
            </Button>
            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded-full">
              {active + 1}/{photos.length}
            </div>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 mt-3">
          {photos.map((photo, i) => (
            <button
              key={photo}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 rounded-xl overflow-hidden border-2 transition-all",
                i === active
                  ? "border-green-primary"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <ImageFallback
                src={photo}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
