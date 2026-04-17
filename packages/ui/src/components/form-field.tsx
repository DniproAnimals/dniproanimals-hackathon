import type { ComponentProps, ReactNode } from "react";
import { cn } from "../utils";
import { Label } from "./label";

interface FormFieldProps extends ComponentProps<"div"> {
  label?: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
}

function FormField({
  className,
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div
      data-slot="form-field"
      className={cn("space-y-1.5", className)}
      {...props}
    >
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-gray-medium">{hint}</p>
      ) : null}
    </div>
  );
}

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

export { FormField, InputWithIcon };
