"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/UserContext";

const navItems = [
  { href: "/about", label: "Про нас" },
  { href: "/", label: "Тварини" },
  { href: "/lost", label: "Загублені" },
  { href: "/donate", label: "Допомогти" },
];

export default function Header() {
  const pathname = usePathname();
  const { user } = useUser();
  const [lostCount, setLostCount] = useState(0);

  useEffect(() => {
    fetch("/api/lost?type=lost")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLostCount(data.length);
      })
      .catch(() => {});
  }, [pathname]);

  return (
    <>
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

          {/* User */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-1">
                {user.role === "superadmin" && (
                  <Link href="/superadmin" className="p-2 rounded-full hover:bg-gray-light transition-colors" title="Суперадмін">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </Link>
                )}
                {user.role !== "user" && (
                  <Link href="/notifications" className="relative p-2 rounded-full hover:bg-gray-light transition-colors" title="Повідомлення">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-medium"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                  </Link>
                )}
                <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-light transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#ced48c] flex items-center justify-center text-xs font-bold text-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </Link>
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
    </>
  );
}

