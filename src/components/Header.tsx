"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Тварини" },
  { href: "/lost", label: "Загублені" },
  { href: "/donate", label: "Допомогти" },
  { href: "/admin", label: "Адмін" },
];

export default function Header() {
  const pathname = usePathname();
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
    <header className="bg-white border-b border-gray-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="DniproAnimals"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span className="text-xl font-bold text-foreground tracking-tight">
            DniproAnimals
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#ced48c] text-foreground"
                    : "text-gray-medium hover:bg-gray-light hover:text-foreground"
                }`}
              >
                {item.label}
                {item.href === "/lost" && lostCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {lostCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile nav — bottom */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-border z-50">
          <div className="flex justify-around py-2 px-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex flex-col items-center gap-0.5 py-1 px-3 text-xs font-medium transition-colors ${
                    isActive ? "text-green-accent" : "text-gray-400"
                  }`}
                >
                  {item.label}
                  {item.href === "/lost" && lostCount > 0 && (
                    <span className="absolute -top-0.5 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {lostCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
