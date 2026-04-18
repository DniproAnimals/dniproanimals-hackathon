"use client";
import {
  useMeQuery,
  useOrganizationQuery,
} from "@/shared/query-hooks";
import {
  IconCoin,
  IconExternalLink,
  IconFileTextFilled,
  IconLayoutDashboardFilled,
  IconMenu2,
  IconPawFilled,
  IconSettingsFilled,
  IconUsersGroup,
} from "@dniproanimals/icons";
import { Badge, Button, cn, SidebarNavItem } from "@dniproanimals/ui";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import type { Organization } from "@dniproanimals/contracts";

type DashboardContextType = {
  org: Organization | null;
  isOwner: boolean;
  refreshOrg: () => void;
};

const DashboardContext = createContext<DashboardContextType>({
  org: null,
  isOwner: false,
  refreshOrg: () => {},
});

export function useDashboard() {
  return useContext(DashboardContext);
}

const navItems = [
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
    ownerOnly: true,
    icon: <IconCoin size={18} />,
  },
  {
    href: "/dashboard/settings",
    label: "Налаштування",
    ownerOnly: true,
    icon: <IconSettingsFilled size={18} />,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading: loading } = useMeQuery();
  const { data: org, refetch: refreshOrg } = useOrganizationQuery(
    user?.orgId ?? 0,
    { enabled: !!user?.orgId },
  );
  const isOwner = !!(org && user && org.ownerId === user.id);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth");
      return;
    }
    if (!user.orgId) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-medium">Завантаження...</p>
      </div>
    );
  }

  const statusLabel = (s: string) => {
    if (s === "pending") return "На модерації";
    if (s === "approved") return "Активна";
    return "Відхилено";
  };
  const statusVariant = (s: string): "warning" | "success" | "danger" => {
    if (s === "pending") return "warning";
    if (s === "approved") return "success";
    return "danger";
  };

  return (
    <DashboardContext.Provider
      value={{ org: org ?? null, isOwner, refreshOrg: () => void refreshOrg() }}
    >
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed md:sticky top-0 left-0 z-50 md:z-0 h-screen w-64 bg-white border-r border-gray-border flex flex-col transition-transform md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {/* Logo */}
          <div className="p-5 border-b border-gray-border/60">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.jpg"
                alt="DniproAnimals"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <span className="font-bold text-foreground text-sm">
                DniproAnimals
              </span>
            </Link>
          </div>

          {/* Org info */}
          {org && (
            <div className="px-4 py-3 border-b border-gray-border/60">
              <p className="text-sm font-medium text-foreground truncate">
                {org.name}
              </p>
              <Badge
                variant={statusVariant(org.status)}
                size="sm"
                className="mt-1"
              >
                {statusLabel(org.status)}
              </Badge>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              if (item.ownerOnly && !isOwner) return null;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              return (
                <SidebarNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  active={isActive}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.label}
                </SidebarNavItem>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-gray-border/60">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-gray-medium truncate">
                  {user.role === "admin" ? "Власник" : "Волонтер"}
                </p>
              </div>
              <Button asChild variant="ghost" size="icon-sm" title="На сайт">
                <Link href="/">
                  <IconExternalLink size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top bar mobile */}
          <div className="md:hidden bg-white border-b border-gray-border px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarOpen(true)}
            >
              <IconMenu2 size={20} />
            </Button>
            <span className="font-semibold text-sm text-foreground">
              {org?.name || "Організація"}
            </span>
          </div>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
