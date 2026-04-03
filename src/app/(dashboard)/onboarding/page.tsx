"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import Image from "next/image";
import { IconUserFilled, IconHomeFilled, IconChevronLeft } from "@tabler/icons-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading, refresh } = useUser();
  const [step, setStep] = useState<"choose" | "org">("choose");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [form, setForm] = useState({
    name: "", description: "", location: "", phone: "", email: "", instagram: "", telegram: "", facebook: "", website: "",
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setAuthError("");
    const url = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = authMode === "login" ? { email: authForm.email, password: authForm.password } : authForm;
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) setAuthError(data.error || "Помилка");
    else { refresh(); setShowAuth(false); }
    setSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setShowAuth(true); return; }
    setSubmitting(true);
    const res = await fetch("/api/organizations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { refresh(); router.push("/profile"); }
    setSubmitting(false);
  };


  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-gray-medium">Завантаження...</p>
      </div>
    );
  }

  if (!user) {
    router.replace("/auth");
    return null;
  }

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      refresh();
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Помилка");
    }
    setSubmitting(false);
  };

  if (step === "choose") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Image src="/logo.jpg" alt="DniproAnimals" width={48} height={48} className="rounded-full object-cover mb-3" />
            <h1 className="text-xl font-bold text-foreground mb-1">Вітаємо, {user.name}!</h1>
            <p className="text-sm text-gray-medium text-center">Як ви плануєте використовувати платформу?</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-white rounded-2xl border border-gray-border p-5 text-left hover:border-[#ced48c] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-light flex items-center justify-center shrink-0 group-hover:bg-[#ced48c]/20 transition-colors">
                  <IconUserFilled size={24} className="text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Особисте використання</p>
                  <p className="text-xs text-gray-medium mt-0.5">Шукати тварин, додавати в обране, допомагати</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setStep("org")}
              className="w-full bg-white rounded-2xl border border-gray-border p-5 text-left hover:border-[#ced48c] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-light flex items-center justify-center shrink-0 group-hover:bg-[#ced48c]/20 transition-colors">
                  <IconHomeFilled size={24} className="text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Створити організацію</p>
                  <p className="text-xs text-gray-medium mt-0.5">Зареєструвати притулок або волонтерську організацію</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm";

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold mb-2">Створити організацію</h1>
      <p className="text-sm text-gray-medium mb-6">Зареєструйте свій притулок або волонтерську організацію на платформі DniproAnimals</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <p className="text-xs text-gray-medium mb-1.5">Назва організації *</p>
          <input type="text" placeholder="Наприклад: Притулок 'Друг'" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
        </div>

        {/* Description */}
        <div>
          <p className="text-xs text-gray-medium mb-1.5">Опис</p>
          <textarea placeholder="Розкажіть про діяльність організації..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm resize-none" />
        </div>

        {/* Location */}
        <div className="relative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <input type="text" placeholder="Місто / адреса *" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
        </div>

        {/* Contacts */}
        <p className="text-xs text-gray-medium pt-2">Контакти організації</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            <input type="tel" placeholder="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          </div>
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            <input type="text" placeholder="Instagram" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className={inputClass} />
          </div>
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            <input type="text" placeholder="Telegram" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} className={inputClass} />
          </div>
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            <input type="text" placeholder="Facebook" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} className={inputClass} />
          </div>
        </div>

        {!user && (
          <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700">
            <p className="font-medium mb-1">Потрібен акаунт</p>
            <p className="text-xs">Щоб створити організацію, потрібно увійти або зареєструватися. Вас буде призначено власником.</p>
          </div>
        )}

        <button type="submit" disabled={submitting} className="w-full bg-[#ced48c] text-foreground py-3.5 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50">
          {submitting ? "Створення..." : user ? "Створити організацію" : "Увійти та створити"}
        </button>

        <p className="text-xs text-gray-medium text-center">Після створення організація потрапить на модерацію</p>
      </form>

      {/* Auth modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-modal-overlay" onClick={() => setShowAuth(false)}>
          <form onSubmit={handleAuth} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-modal-in space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-lg">{authMode === "login" ? "Увійти" : "Реєстрація"}</h3>
              <button type="button" onClick={() => setShowAuth(false)} className="text-gray-400 hover:text-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {authMode === "register" && <input type="text" placeholder="Ім'я" required value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border outline-none text-sm" />}
            <input type="email" placeholder="Email" required value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border outline-none text-sm" />
            <input type="password" placeholder="Пароль" required value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border outline-none text-sm" />
            {authError && <p className="text-xs text-red-500">{authError}</p>}
            <button type="submit" disabled={submitting} className="w-full bg-[#ced48c] text-foreground py-3 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50">
              {authMode === "login" ? "Увійти" : "Зареєструватися"}
            </button>
            <p className="text-xs text-center text-gray-medium">
              {authMode === "login" ? "Немає акаунту? " : "Вже є акаунт? "}
              <button type="button" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")} className="font-medium text-foreground hover:underline">{authMode === "login" ? "Зареєструватися" : "Увійти"}</button>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
