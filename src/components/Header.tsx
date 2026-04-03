"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import { IconChevronDown, IconShieldFilled, IconHomeFilled, IconUserFilled, IconLogout } from "@tabler/icons-react";

const navItems = [
  { href: "/about", label: "Про нас" },
  { href: "/", label: "Тварини" },
  { href: "/lost", label: "Загублені" },
  { href: "/donate", label: "Допомогти" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, refresh } = useUser();
  const [lostCount, setLostCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/lost?type=lost")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLostCount(data.length);
      })
      .catch(() => {});
  }, [pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    refresh();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-gray-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/about" className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="DniproAnimals" width={40} height={40} className="rounded-full object-cover" />
          <span className="text-xl font-bold text-foreground tracking-tight hidden sm:block">DniproAnimals</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all ${
                  isActive ? "text-[#ced48c] underline underline-offset-4 decoration-2 decoration-[#ced48c]" : "text-gray-medium hover:text-foreground"
                }`}
              >
                {item.label}
                {item.href === "/lost" && lostCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{lostCount}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / Auth */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-light transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#ced48c] flex items-center justify-center text-xs font-bold text-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.name}</span>
                <IconChevronDown size={14} className={`text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-gray-200 shadow-lg py-1.5 z-50">
                  {user.role === "superadmin" && (
                    <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-gray-50 transition-colors" onClick={() => setMenuOpen(false)}>
                      <IconShieldFilled size={16} className="text-red-500" />
                      Адмін панель
                    </Link>
                  )}
                  {user.org_id && (
                    <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-gray-50 transition-colors" onClick={() => setMenuOpen(false)}>
                      <IconHomeFilled size={16} className="text-[#5b7765]" />
                      Організація
                    </Link>
                  )}
                  <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-gray-50 transition-colors" onClick={() => setMenuOpen(false)}>
                    <IconUserFilled size={16} className="text-gray-400" />
                    Профіль
                  </Link>
                  <div className="my-1.5 border-t border-gray-100" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <IconLogout size={16} />
                    Вийти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth" className="px-4 py-2 rounded-full text-sm font-medium bg-gray-light hover:bg-[#ced48c] transition-colors">
              Увійти
            </Link>
          )}
        </div>

        {/* Mobile nav — bottom */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-border z-50">
          <div className="flex justify-around py-2 px-2">
            {navItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`relative flex flex-col items-center gap-0.5 py-1 px-3 text-xs font-medium transition-colors ${isActive ? "text-green-accent" : "text-gray-400"}`}>
                  {item.label}
                  {item.href === "/lost" && lostCount > 0 && (
                    <span className="absolute -top-0.5 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{lostCount}</span>
                  )}
                </Link>
              );
            })}
            <Link href={user ? "/profile" : "/auth"} className={`flex flex-col items-center gap-0.5 py-1 px-3 text-xs font-medium transition-colors ${pathname === "/profile" ? "text-green-accent" : "text-gray-400"}`}>
              {user ? user.name.charAt(0) : "Увійти"}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
