"use client";
import { ImageFallback } from "@/shared/components/ImageFallback";
import { IconChevronLeft, IconChevronRight } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import { useState } from "react";

export function LostPhotoCarousel({
  photos,
  alt,
}: {
  photos: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  if (photos.length === 0) return null;

  return (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-light">
      <ImageFallback
        src={photos[active]!}
        alt={alt}
        fill
        className="object-cover"
        sizes="400px"
      />
      {photos.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              setActive((p) => (p - 1 + photos.length) % photos.length)
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80"
          >
            <IconChevronLeft size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setActive((p) => (p + 1) % photos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80"
          >
            <IconChevronRight size={16} />
          </Button>
        </>
      )}
    </div>
  );
}
