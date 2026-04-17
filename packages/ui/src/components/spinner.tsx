import type { ComponentProps } from "react";
import { cn } from "../utils";

interface SpinnerProps extends ComponentProps<"div"> {
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "size-3 border",
  md: "size-4 border-2",
  lg: "size-6 border-2",
};

function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Завантаження"
      data-slot="spinner"
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent text-primary",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export { Spinner };
