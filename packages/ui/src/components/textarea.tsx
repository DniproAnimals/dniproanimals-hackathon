"use client";
import type { ComponentProps } from "react";
import { cn } from "../utils";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full rounded-xl border border-gray-border bg-gray-light px-4 py-2.5 text-sm text-foreground placeholder:text-gray-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-20",
        className,
      )}
      {...props}
    />
  );
}
