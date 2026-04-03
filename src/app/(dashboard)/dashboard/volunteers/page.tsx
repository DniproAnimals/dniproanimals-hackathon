"use client";

import { useEffect, useState, useCallback } from "react";
import { useDashboard } from "../layout";

type Volunteer = {
  id: number;
  name: string;
  surname: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  telegram: string | null;
  user_id: number | null;
  invite_token: string;
};

export default function VolunteersPage() {
  const { isOwner } = useDashboard();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", surname: "", description: "", phone: "", email: "", instagram: "", telegram: "" });
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchVolunteers = useCallback(() => {
    fetch("/api/volunteers")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setVolunteers(data); });
  }, []);

  useEffect(() => { fetchVolunteers(); }, [fetchVolunteers]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/volunteers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: "", surname: "", description: "", phone: "", email: "", instagram: "", telegram: "" });
      setShowForm(false);
      fetchVolunteers();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити волонтера?")) return;
    const res = await fetch("/api/volunteers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setVolunteers((prev) => prev.filter((v) => v.id !== id));
  };

  const copyInviteLink = (vol: Volunteer) => {
    const link = `${window.location.origin}/invite?token=${vol.invite_token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(vol.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = volunteers.filter((v) => {
    const matchSearch = !search || `${v.name} ${v.surname || ""} ${v.email || ""}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (statusFilter === "active" ? v.user_id : !v.user_id);
    return matchSearch && matchStatus;
  });

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm";

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Волонтери</h1>
        {isOwner && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-[#ced48c] text-foreground hover:bg-[#b8be72] transition-colors"
          >
            {showForm ? "Скасувати" : "Додати волонтера"}
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Ім&#39;я *</p>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Ім'я" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Прізвище</p>
              <input type="text" value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} className={inputClass} placeholder="Прізвище" />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Опис</p>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} rows={2} placeholder="Чим займається" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Телефон</p>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+380..." />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="email@example.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Instagram</p>
              <input type="text" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className={inputClass} placeholder="@username" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Telegram</p>
              <input type="text" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} className={inputClass} placeholder="@username" />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-[#ced48c] text-foreground py-2.5 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50 text-sm">
            {submitting ? "Зачекайте..." : "Додати"}
          </button>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Пошук за ім'ям або email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#ced48c]/30 w-64"
        />
        <div className="flex gap-1">
          {(["all", "active", "pending"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s ? "bg-[#ced48c] text-foreground" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {s === "all" ? "Усі" : s === "active" ? "Активні" : "Очікують"}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400">{filtered.length} з {volunteers.length}</span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
          {volunteers.length === 0 ? "Ще немає волонтерів" : "Нічого не знайдено"}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((vol) => (
            <div key={vol.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                  {vol.name.charAt(0)}{vol.surname ? vol.surname.charAt(0) : ""}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm truncate">{vol.name}{vol.surname ? ` ${vol.surname}` : ""}</p>
                    {vol.user_id ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">Активний</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">Очікує</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-400 mt-0.5">
                    {vol.phone && <span>{vol.phone}</span>}
                    {vol.email && <span>{vol.email}</span>}
                    {vol.instagram && <span>IG: {vol.instagram}</span>}
                    {vol.telegram && <span>TG: {vol.telegram}</span>}
                  </div>
                </div>
              </div>

              {isOwner && (
                <div className="flex gap-2 shrink-0">
                  {!vol.user_id && (
                    <button onClick={() => copyInviteLink(vol)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                      {copiedId === vol.id ? "Скопійовано!" : "Посилання"}
                    </button>
                  )}
                  <button onClick={() => handleDelete(vol.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                    Видалити
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
