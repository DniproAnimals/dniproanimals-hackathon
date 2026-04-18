"use client";
import { SidebarNavItem } from "@dniproanimals/ui";
import { usePathname } from "next/navigation";
import {
  DASHBOARD_NAV_ITEMS,
  type DashboardNavItem,
} from "../../constants/navItems";

export function SidebarNav({
  isOwner,
  onNavigate,
}: {
  isOwner: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const isActive = (item: DashboardNavItem) =>
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href);

  return (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {DASHBOARD_NAV_ITEMS.map((item) => {
        if (item.ownerOnly && !isOwner) return null;
        return (
          <SidebarNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            active={isActive(item)}
            onClick={onNavigate}
          >
            {item.label}
          </SidebarNavItem>
        );
      })}
    </nav>
  );
}
