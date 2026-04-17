"use client";
import { cn } from "@/shared/lib/utils";
import * as LabelPrimitive from "@radix-ui/react-label";
import type { ComponentProps } from "react";

function Label({
  className,
  ...props
}: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-xs font-medium text-gray-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
