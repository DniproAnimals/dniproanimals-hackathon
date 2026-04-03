"use client";

import { useEffect, useState, useCallback, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import Image from "next/image";
import Link from "next/link";

type Organization = {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  telegram: string | null;
  facebook: string | null;
  website: string | null;
  owner_id: number;
  status: "pending" | "approved" | "rejected";
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
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/dashboard/volunteers",
    label: "Волонтери",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    href: "/dashboard/animals",
    label: "Тварини",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
        <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
        <path d="M8 14v.5" /><path d="M16 14v.5" />
        <path d="M11.25 16.25h1.5L12 17l-.75-.75z" />
        <path d="M4.42 11.247A13.152 13.152 0 004 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 00-.493-3.309" />
      </svg>
    ),
  },
  {
    href: "/dashboard/requests",
    label: "Анкети",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Налаштування",
    ownerOnly: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
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
    const res = await fetch("/api/organizations");
    const orgs = await res.json();
    if (Array.isArray(orgs)) {
      const myOrg = orgs.find((o: Organization) => o.id === user.org_id);
      if (myOrg) {
        setOrg(myOrg);
        setIsOwner(myOrg.owner_id === user.id);
      }
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top bar mobile */}
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <span className="font-semibold text-sm text-foreground">{org?.name || "Організація"}</span>
          </div>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
