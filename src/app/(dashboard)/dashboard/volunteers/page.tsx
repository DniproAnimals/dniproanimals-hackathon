"use client";

import { useEffect, useState, useCallback } from "react";
import { useDashboard } from "../layout";
import {
  IconX,
  IconPlus,
  IconSearch,
  IconLink,
  IconTrash,
  IconPhone,
  IconMail,
  IconBrandInstagram,
  IconBrandTelegram,
  IconUsersGroup,
  IconCircleCheckFilled,
  IconClockFilled,
} from "@tabler/icons-react";

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
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  const activeCount = volunteers.filter((v) => v.user_id).length;
  const pendingCount = volunteers.length - activeCount;
  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm";

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Волонтери</h1>
          <p className="text-sm text-gray-400 mt-0.5">{volunteers.length} волонтерів у команді</p>
        </div>
        {isOwner && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#ced48c] text-foreground hover:bg-[#b8be72] transition-colors"
          >
            <IconPlus size={16} />
            Додати волонтера
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <IconUsersGroup size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{volunteers.length}</p>
            <p className="text-[11px] text-gray-400">Всього</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <IconCircleCheckFilled size={20} className="text-green-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{activeCount}</p>
            <p className="text-[11px] text-gray-400">Активних</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
            <IconClockFilled size={20} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{pendingCount}</p>
            <p className="text-[11px] text-gray-400">Очікують запрошення</p>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-50">
            <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Пошук за ім'ям, прізвищем або email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#ced48c]/30"
            />
          </div>
          <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
            {(["all", "active", "pending"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === s ? "bg-white text-foreground shadow-sm" : "text-gray-500 hover:text-foreground"
                }`}
              >
                {s === "all" ? `Усі (${volunteers.length})` : s === "active" ? `Активні (${activeCount})` : `Очікують (${pendingCount})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <IconUsersGroup size={24} className="text-gray-300" />
          </div>
          <p className="text-foreground font-medium mb-1">
            {volunteers.length === 0 ? "Ще немає волонтерів" : "Нікого не знайдено"}
          </p>
          <p className="text-xs text-gray-400 mb-4">
            {volunteers.length === 0 ? "Додайте першого волонтера до команди" : "Спробуйте змінити параметри пошуку"}
          </p>
          {volunteers.length === 0 && isOwner && (
            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#ced48c] text-foreground hover:bg-[#b8be72] transition-colors">
              <IconPlus size={14} />
              Додати волонтера
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((vol) => (
            <div
              key={vol.id}
              className={`bg-white rounded-xl border transition-all ${expandedId === vol.id ? "border-[#ced48c] shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
            >
              {/* Main row */}
              <div
                className="p-4 flex items-center gap-3 cursor-pointer"
                onClick={() => setExpandedId(expandedId === vol.id ? null : vol.id)}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  vol.user_id ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {vol.name.charAt(0)}{vol.surname ? vol.surname.charAt(0) : ""}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {vol.name}{vol.surname ? ` ${vol.surname}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {vol.user_id ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-600">
                        <IconCircleCheckFilled size={10} />
                        Активний
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-yellow-600">
                        <IconClockFilled size={10} />
                        Очікує запрошення
                      </span>
                    )}
                    {vol.description && (
                      <span className="text-[10px] text-gray-400 truncate hidden sm:inline">· {vol.description}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === vol.id && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                  {vol.description && (
                    <p className="text-sm text-gray-500">{vol.description}</p>
                  )}

                  {/* Contact grid */}
                  {(vol.phone || vol.email || vol.instagram || vol.telegram) && (
                    <div className="grid grid-cols-2 gap-2">
                      {vol.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                          <IconPhone size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate">{vol.phone}</span>
                        </div>
                      )}
                      {vol.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                          <IconMail size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate">{vol.email}</span>
                        </div>
                      )}
                      {vol.instagram && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                          <IconBrandInstagram size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate">{vol.instagram}</span>
                        </div>
                      )}
                      {vol.telegram && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                          <IconBrandTelegram size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate">{vol.telegram}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {isOwner && (
                    <div className="flex gap-2 pt-1">
                      {!vol.user_id && (
                        <button
                          onClick={() => copyInviteLink(vol)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <IconLink size={13} />
                          {copiedId === vol.id ? "Скопійовано!" : "Скопіювати запрошення"}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(vol.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors ml-auto"
                      >
                        <IconTrash size={13} />
                        Видалити
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add volunteer modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4" onClick={() => setShowForm(false)}>
          <form onSubmit={handleAdd} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-lg">Додати волонтера</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-foreground">
                <IconX size={20} />
              </button>
            </div>
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
              {submitting ? "Зачекайте..." : "Додати волонтера"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
