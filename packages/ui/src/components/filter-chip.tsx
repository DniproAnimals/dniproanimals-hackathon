"use client";
import { IconX } from "@dniproanimals/icons";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../utils";

const filterChipVariants = cva(
  "inline-flex items-center gap-1 rounded-full text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/20 text-foreground hover:bg-primary/30",
        outline:
          "border border-gray-border bg-white text-foreground hover:border-primary hover:bg-green-light/40",
        active: "bg-primary text-primary-foreground hover:bg-green-dark",
        muted: "bg-muted text-foreground hover:bg-gray-border",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px]",
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

export type FilterChipProps = ComponentProps<"button"> &
  VariantProps<typeof filterChipVariants> & {
    onRemove?: () => void;
    count?: number;
  };

function FilterChip({
  className,
  variant,
  size,
  onRemove,
  count,
  children,
  type = "button",
  ...props
}: FilterChipProps) {
  return (
    <button
      data-slot="filter-chip"
      type={type}
      className={cn(filterChipVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      {typeof count === "number" && count > 0 && (
        <span className="ml-0.5 inline-flex size-4 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-bold">
          {count}
        </span>
      )}
      {onRemove && (
        <span
          role="button"
          aria-label="Видалити фільтр"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 inline-flex cursor-pointer text-gray-medium hover:text-foreground"
        >
          <IconX className="size-3" />
        </span>
      )}
    </button>
  );
}

export { FilterChip, filterChipVariants };
