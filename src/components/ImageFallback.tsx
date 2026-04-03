"use client";

import { useState, useEffect } from "react";
import Image, { type ImageProps } from "next/image";

type ImageFallbackProps = Omit<ImageProps, "src"> & {
  src: string;
  fallback?: string;
};

export default function ImageFallback({ src, fallback = "/logo.jpg", alt, ...props }: ImageFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallback)}
    />
  );
}
