import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils";

interface EmptyStateProps extends Omit<ComponentProps<"div">, "title"> {
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4",
        className,
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-gray-medium [&_svg]:size-12">{icon}</div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-gray-medium max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
      {children}
    </div>
  );
}
