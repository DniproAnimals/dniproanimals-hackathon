import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../utils";

export const inputVariants = cva(
  "flex w-full rounded-xl border border-gray-border bg-gray-light text-sm text-foreground placeholder:text-gray-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium",
  {
    variants: {
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4 py-2.5",
        lg: "h-12 px-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type InputProps = Omit<ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>;

export function Input({ className, type, size, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, className }))}
      {...props}
    />
  );
}
