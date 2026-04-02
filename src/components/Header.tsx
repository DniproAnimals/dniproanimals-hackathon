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
  const [showAuth, setShowAuth] = useState(false);

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
              <div className="flex items-center gap-2">
                <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-light transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#ced48c] flex items-center justify-center text-xs font-bold text-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </Link>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} className="px-4 py-2 rounded-full text-sm font-medium bg-gray-light hover:bg-[#ced48c] transition-colors">
                Увійти
              </button>
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
              <Link href={user ? "/profile" : "#"} onClick={user ? undefined : () => setShowAuth(true)} className={`flex flex-col items-center gap-0.5 py-1 px-3 text-xs font-medium transition-colors ${pathname === "/profile" ? "text-green-accent" : "text-gray-400"}`}>
                {user ? user.name.charAt(0) : "Увійти"}
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Auth modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const { refresh } = useUser();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = mode === "login" ? { email: form.email, password: form.password } : form;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Помилка");
    } else {
      refresh();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-modal-overlay" onClick={onClose}>
      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-modal-in space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-lg">{mode === "login" ? "Увійти" : "Реєстрація"}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-foreground">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {mode === "register" && (
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input type="text" placeholder="Ім'я" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
          </div>
        )}
        <div className="relative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
        </div>
        <div className="relative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          <input type="password" placeholder="Пароль" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-[#ced48c] text-foreground py-3 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50">
          {loading ? "Зачекайте..." : mode === "login" ? "Увійти" : "Зареєструватися"}
        </button>

        <p className="text-xs text-center text-gray-medium">
          {mode === "login" ? "Немає акаунту? " : "Вже є акаунт? "}
          <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="font-medium text-foreground hover:underline">
            {mode === "login" ? "Зареєструватися" : "Увійти"}
          </button>
        </p>
      </form>
    </div>
  );
}
