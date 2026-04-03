"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "../layout";

export default function SettingsPage() {
  const { org, isOwner, refreshOrg } = useDashboard();
  const [form, setForm] = useState({
    name: "", description: "", location: "", phone: "", email: "",
    instagram: "", telegram: "", facebook: "", website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (org) {
      setForm({
        name: org.name || "",
        description: org.description || "",
        location: org.location || "",
        phone: org.phone || "",
        email: org.email || "",
        instagram: org.instagram || "",
        telegram: org.telegram || "",
        facebook: org.facebook || "",
        website: org.website || "",
      });
    }
  }, [org]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSaved(false);
    const res = await fetch("/api/organizations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSaved(true);
      refreshOrg();
      setTimeout(() => setSaved(false), 3000);
    }
    setSubmitting(false);
  };

  if (!isOwner) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-4">Налаштування</h1>
        <p className="text-gray-500">Тільки власник організації може змінювати налаштування.</p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm";

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Налаштування організації</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Назва організації *</p>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Опис</p>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Місто / Адреса</p>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Телефон</p>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Вебсайт</p>
            <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className={inputClass} placeholder="https://..." />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Instagram</p>
            <input type="text" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className={inputClass} placeholder="@username" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Telegram</p>
            <input type="text" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} className={inputClass} placeholder="@username" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Facebook</p>
            <input type="text" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#ced48c] text-foreground hover:bg-[#b8be72] transition-colors disabled:opacity-50">
            {submitting ? "Зачекайте..." : "Зберегти"}
          </button>
          {saved && <span className="text-sm text-green-600">Збережено!</span>}
        </div>
      </form>
    </div>
  );
}
