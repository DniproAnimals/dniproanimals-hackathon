import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium transition-colors whitespace-nowrap [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground",
        brand: "bg-primary text-primary-foreground",
        soft: "bg-green-light text-green-secondary",
        outline: "border border-gray-border text-foreground",
        success: "bg-green-100 text-green-700",
        warning: "bg-yellow-100 text-yellow-700",
        danger: "bg-red-100 text-red-700",
        info: "bg-blue-100 text-blue-700",
        reserved: "bg-yellow-500/90 text-white backdrop-blur-sm",
        adopted: "bg-green-accent/90 text-white backdrop-blur-sm",
        dark: "bg-foreground text-white",
      },
      size: {
        xs: "px-1.5 py-0 text-[10px]",
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
