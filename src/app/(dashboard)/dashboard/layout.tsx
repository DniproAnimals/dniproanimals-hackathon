"use client";

import { useEffect, useState, useCallback, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import Image from "next/image";
import Link from "next/link";
import { IconLayoutDashboardFilled, IconUsersGroup, IconPawFilled, IconFileTextFilled, IconSettingsFilled, IconExternalLink, IconMenu2, IconCoin } from "@tabler/icons-react";

type Organization = {
  id: number;
  name: string;
  description: string | null;
  photo: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  telegram: string | null;
  facebook: string | null;
  website: string | null;
  owner_id: number;
  status: "pending" | "approved" | "rejected";
  monobank_jar_id: string | null;
};

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
    icon: (<IconLayoutDashboardFilled size={18} />),
  },
  {
    href: "/dashboard/volunteers",
    label: "Волонтери",
    icon: (<IconUsersGroup size={18} />),
  },
  {
    href: "/dashboard/animals",
    label: "Тварини",
    icon: (<IconPawFilled size={18} />),
  },
  {
    href: "/dashboard/requests",
    label: "Анкети",
    icon: (<IconFileTextFilled size={18} />),
  },
  {
    href: "/dashboard/donations",
    label: "Пожертви",
    ownerOnly: true,
    icon: (<IconCoin size={18} />),
  },
  {
    href: "/dashboard/settings",
    label: "Налаштування",
    ownerOnly: true,
    icon: (<IconSettingsFilled size={18} />),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();
  const [org, setOrg] = useState<Organization | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refreshOrg = useCallback(async () => {
    if (!user?.org_id) return;
    const res = await fetch(`/api/organizations/${user.org_id}`);
    if (!res.ok) return;
    const myOrg = await res.json();
    if (myOrg) {
      setOrg(myOrg);
      setIsOwner(myOrg.owner_id === user.id);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    } else if (!loading && user && !user.org_id) {
      router.replace("/");
    } else if (user) {
      refreshOrg();
    }
  }, [user, loading, router, refreshOrg]);

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
  const statusColor = (s: string) => {
    if (s === "pending") return "bg-yellow-100 text-yellow-800";
    if (s === "approved") return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <DashboardContext.Provider value={{ org, isOwner, refreshOrg }}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed md:sticky top-0 left-0 z-50 md:z-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          {/* Logo */}
          <div className="p-5 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo.jpg" alt="DniproAnimals" width={32} height={32} className="rounded-full object-cover" />
              <span className="font-bold text-foreground text-sm">DniproAnimals</span>
            </Link>
          </div>

          {/* Org info */}
          {org && (
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-foreground truncate">{org.name}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(org.status)}`}>
                {statusLabel(org.status)}
              </span>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              if (item.ownerOnly && !isOwner) return null;
              const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#ced48c]/20 text-foreground"
                      : "text-gray-500 hover:text-foreground hover:bg-gray-50"
                  }`}
                >
                  <span className={isActive ? "text-[#5b7765]" : "text-gray-400"}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#ced48c] flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{user.role === "admin" ? "Власник" : "Волонтер"}</p>
              </div>
              <Link href="/" className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400" title="На сайт">
                <IconExternalLink size={16} />
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top bar mobile */}
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <IconMenu2 size={20} />
            </button>
            <span className="font-semibold text-sm text-foreground">{org?.name || "Організація"}</span>
          </div>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
