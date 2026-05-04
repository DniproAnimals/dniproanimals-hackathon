// Avatar.tsx
"use client";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { ComponentProps } from "react";
import { cn } from "../../utils";

const sizeClasses = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
  xl: "size-18",
  "2xl": "size-24",
} as const;

const shapeClasses = {
  circle: "rounded-full",
  rounded: "rounded-lg",
  slight: "rounded-sm",
  square: "rounded-none",
} as const;

export type AvatarSize = keyof typeof sizeClasses;
export type AvatarShape = keyof typeof shapeClasses;

export interface AvatarProps extends ComponentProps<
  typeof AvatarPrimitive.Root
> {
  size?: AvatarSize;
  shape?: AvatarShape;
}

export function Avatar({
  className,
  size = "md",
  shape = "circle",
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 overflow-hidden",
        sizeClasses[size],
        shapeClasses[shape],
        className,
      )}
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-primary text-primary-foreground text-sm font-semibold",
        className,
      )}
      {...props}
    />
  );
}

const statusColors = {
  online: "bg-green-500",
  busy: "bg-red-500",
  away: "bg-yellow-500",
  offline: "bg-gray-400",
} as const;

export type AvatarStatus = keyof typeof statusColors;

export interface AvatarWithStatusProps extends AvatarProps {
  status?: AvatarStatus;
  src?: string;
  fallback?: string;
  alt?: string;
}

export function AvatarWithStatus({
  status,
  src,
  fallback,
  alt,
  size = "md",
  shape = "circle",
  className,
  ...props
}: AvatarWithStatusProps) {
  return (
    <div className="relative inline-flex">
      <Avatar size={size} shape={shape} className={className} {...props}>
        {src && <AvatarImage src={src} alt={alt} />}
        {fallback && <AvatarFallback>{fallback}</AvatarFallback>}
      </Avatar>
      {status && (
        <span
          data-slot="avatar-status"
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
            statusColors[status],
            size === "xs" || size === "sm" ? "size-2" : "size-3",
          )}
        />
      )}
    </div>
  );
}
