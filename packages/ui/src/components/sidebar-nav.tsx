"use client";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../utils";

interface SidebarNavItemProps extends Omit<
  ComponentProps<typeof Link>,
  "href"
> {
  href: string;
  icon?: ReactNode;
  active?: boolean;
}

function SidebarNavItem({
  className,
  href,
  icon,
  active,
  children,
  ...props
}: SidebarNavItemProps) {
  return (
    <Link
      data-slot="sidebar-nav-item"
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary/20 text-foreground [&_svg]:text-green-secondary"
          : "text-gray-medium hover:text-foreground hover:bg-muted [&_svg]:text-gray-medium",
        className,
      )}
      {...props}
    >
      {icon && <span className="[&_svg]:size-4">{icon}</span>}
      {children}
    </Link>
  );
}

export { SidebarNavItem };
