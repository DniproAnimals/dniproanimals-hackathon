"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import Image from "next/image";

export default function AuthPage() {
  const router = useRouter();
  const { user, refresh } = useUser();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    if (user.role === "superadmin") router.replace("/admin");
    else if (user.org_id) router.replace("/dashboard");
    else router.replace("/onboarding");
    return null;
  }

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
      if (mode === "register") {
        router.push("/onboarding");
        refresh();
      } else {
        refresh();
        const { role, org_id } = data;
        if (role === "superadmin") router.push("/admin");
        else if (org_id) router.push("/dashboard");
        else router.push("/onboarding");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo.jpg" alt="DniproAnimals" width={48} height={48} className="rounded-full object-cover mb-3" />
          <h1 className="text-xl font-bold text-foreground">
            {mode === "login" ? "Увійти в акаунт" : "Створити акаунт"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-border space-y-3">
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
    </div>
  );
}
