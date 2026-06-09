import {
  IconCoin,
  IconFileTextFilled,
  IconLayoutDashboardFilled,
  IconPawFilled,
  IconSettingsFilled,
  IconUsersGroup,
} from "@dniproanimals/icons";
import type { ReactNode } from "react";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  ownerOnly?: boolean;
};

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    href: "/dashboard",
    label: "Дашборд",
    icon: <IconLayoutDashboardFilled size={18} />,
  },
  {
    href: "/dashboard/volunteers",
    label: "Волонтери",
    icon: <IconUsersGroup size={18} />,
  },
  {
    href: "/dashboard/animals",
    label: "Тварини",
    icon: <IconPawFilled size={18} />,
  },
  {
    href: "/dashboard/requests",
    label: "Анкети",
    icon: <IconFileTextFilled size={18} />,
  },
  {
    href: "/dashboard/donations",
    label: "Пожертви",
    icon: <IconCoin size={18} />,
  },
  {
    href: "/dashboard/foundation",
    label: "Налаштування",
    icon: <IconSettingsFilled size={18} />,
  },
];
