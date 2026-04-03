"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import { IconMapPinFilled, IconPhoneFilled, IconMailFilled, IconBrandInstagram, IconBrandTelegram, IconBrandFacebook, IconX } from "@tabler/icons-react";

export default function CreateOrgPage() {
  const router = useRouter();
  const { user, refresh } = useUser();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  const inputClass = "w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm";

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
          <IconMapPinFilled size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Місто / адреса *" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
        </div>

        {/* Contacts */}
        <p className="text-xs text-gray-medium pt-2">Контакти організації</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <IconPhoneFilled size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="tel" placeholder="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          </div>
          <div className="relative">
            <IconMailFilled size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="relative">
            <IconBrandInstagram size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Instagram" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className={inputClass} />
          </div>
          <div className="relative">
            <IconBrandTelegram size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Telegram" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} className={inputClass} />
          </div>
          <div className="relative">
            <IconBrandFacebook size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
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
                <IconX size={20} />
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
