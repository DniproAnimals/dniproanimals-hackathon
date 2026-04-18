"use client";
import Image, { type ImageProps } from "next/image";
import { ReactEventHandler, useCallback, useState } from "react";

interface ImageFallbackProps extends Omit<ImageProps, "src"> {
  src: string;
  fallback?: string;
  alt: string;
}

export function ImageFallback({
  src,
  fallback = "/logo.jpg",
  alt,
  onError,
  ...props
}: ImageFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError: ReactEventHandler<HTMLImageElement> = useCallback(
    (e) => {
      onError?.(e);

      if (!hasError) {
        setImgSrc(fallback);
        setHasError(true);
      }
    },
    [hasError, fallback, onError],
  );

  return <Image {...props} src={imgSrc} alt={alt} onError={handleError} />;
}
