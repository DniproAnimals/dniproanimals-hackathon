"use client";
import { useUser } from "@/shared/lib/UserContext";
import { cn } from "@/shared/lib/utils";
import {
  IconChevronDown,
  IconHomeFilled,
  IconLogout,
  IconShieldFilled,
  IconUserFilled,
} from "@dniproanimals/icons";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dniproanimals/ui";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Про нас" },
  { href: "/animals", label: "Тварини" },
  { href: "/lost", label: "Загублені" },
  { href: "/organizations", label: "Організації" },
  { href: "/donate", label: "Допомогти" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, refresh } = useUser();
  const [lostCount, setLostCount] = useState(0);

  useEffect(() => {
    fetch("/api/lost?type=lost")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLostCount(data.length);
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    refresh();
    router.push("/");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-white border-b border-gray-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="DniproAnimals"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span className="text-xl font-bold text-foreground tracking-tight hidden sm:block">
            DniproAnimals
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-all",
                isActive(item.href)
                  ? "text-primary underline underline-offset-4 decoration-2 decoration-primary"
                  : "text-gray-medium hover:text-foreground",
              )}
            >
              {item.label}
              {item.href === "/lost" && lostCount > 0 && (
                <Badge
                  variant="danger"
                  size="xs"
                  className="absolute -top-1 -right-1 size-5 p-0 justify-center bg-red-500 text-white"
                >
                  {lostCount}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted transition-colors data-[state=open]:bg-muted">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name}</span>
                  <IconChevronDown className="size-3.5 text-gray-medium transition-transform data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {user.role === "superadmin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <IconShieldFilled className="text-red-500" />
                      Адмін панель
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.org_id && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <IconHomeFilled className="text-green-secondary" />
                      Організація
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <IconUserFilled className="text-gray-medium" />
                    Профіль
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive onClick={handleLogout}>
                  <IconLogout />
                  Вийти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="subtle" shape="pill" size="sm">
              <Link href="/auth">Увійти</Link>
            </Button>
          )}
        </div>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-border z-50">
          <div className="flex justify-around py-2 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-1 px-3 text-xs font-medium transition-colors",
                  isActive(item.href)
                    ? "text-green-accent"
                    : "text-gray-medium",
                )}
              >
                {item.label}
                {item.href === "/lost" && lostCount > 0 && (
                  <Badge
                    variant="danger"
                    size="xs"
                    className="absolute -top-0.5 right-0 size-4 p-0 justify-center bg-red-500 text-white text-[9px]"
                  >
                    {lostCount}
                  </Badge>
                )}
              </Link>
            ))}
            <Link
              href={user ? "/profile" : "/auth"}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1 px-3 text-xs font-medium transition-colors",
                pathname === "/profile"
                  ? "text-green-accent"
                  : "text-gray-medium",
              )}
            >
              {user ? user.name.charAt(0) : "Увійти"}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
