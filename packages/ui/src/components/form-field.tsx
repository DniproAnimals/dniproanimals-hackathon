import type { ComponentProps, ReactNode } from "react";
import { cn } from "../utils";

interface InputWithIconProps extends ComponentProps<"div"> {
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

function InputWithIcon({
  className,
  icon,
  iconPosition = "left",
  children,
  ...props
}: InputWithIconProps) {
  return (
    <div
      data-slot="input-with-icon"
      className={cn("relative", className)}
      {...props}
    >
      {icon && (
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-gray-medium pointer-events-none [&_svg]:size-4",
            iconPosition === "left" ? "left-3.5" : "right-3.5",
          )}
        >
          {icon}
        </div>
      )}
      <div
        className={cn(
          icon &&
            iconPosition === "left" &&
            "[&>input]:pl-10 [&>textarea]:pl-10",
          icon &&
            iconPosition === "right" &&
            "[&>input]:pr-10 [&>textarea]:pr-10",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { InputWithIcon };
