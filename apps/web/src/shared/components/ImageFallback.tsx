"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ImageFallbackProps = Omit<ImageProps, "src"> & {
  src: string;
  fallback?: string;
};

export default function ImageFallback({
  src,
  fallback = "/logo.jpg",
  alt,
  ...props
}: ImageFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallback)}
    />
  );
}
