import {
  IconCashBanknote,
  IconFileTextFilled,
  IconLayoutDashboardFilled,
  IconMail,
  IconPawFilled,
  IconSettingsFilled,
  IconShoppingBag,
  IconUsersGroup,
} from "@dniproanimals/icons";
import type { ReactNode } from "react";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  superadminOnly?: boolean;
};

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    href: "/dashboard",
    label: "Дашборд",
    icon: <IconLayoutDashboardFilled size={18} />,
  },
  {
    href: "/dashboard/volunteers",
    label: "Користувачі",
    icon: <IconUsersGroup size={18} />,
    superadminOnly: true,
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
    href: "/dashboard/foundation",
    label: "Фонд",
    icon: <IconSettingsFilled size={18} />,
  },
  {
    href: "/dashboard/email-templates",
    label: "Шаблони листів",
    icon: <IconMail size={18} />,
  },
  {
    href: "/dashboard/contracts",
    label: "Шаблон договору",
    icon: <IconFileTextFilled size={18} />,
  },
  {
    href: "/dashboard/donations",
    label: "Донати",
    icon: <IconCashBanknote size={18} />,
  },
  {
    href: "/dashboard/material-help",
    label: "Матеріальна допомога",
    icon: <IconShoppingBag size={18} />,
  },
];
