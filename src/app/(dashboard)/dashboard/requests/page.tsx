"use client";

import { useEffect, useState, useCallback } from "react";
import {
  IconX, IconPhoneFilled, IconMailFilled, IconMapPinFilled,
  IconBrandInstagram, IconBrandTelegram, IconBrandFacebook,
  IconMessageFilled, IconPawFilled, IconCheck, IconBan,
} from "@tabler/icons-react";

type Request = {
  id: number;
  animal_id: number;
  animal_name: string;
  animal_type: string;
  name: string;
  email: string;
  phone: string;
  instagram: string | null;
  telegram: string | null;
  facebook: string | null;
  location: string | null;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [updating, setUpdating] = useState<number | null>(null);
  const [selected, setSelected] = useState<Request | null>(null);

  const fetchRequests = useCallback(() => {
    fetch("/api/adoption").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setRequests(data);
    });
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const updateStatus = async (id: number, status: "approved" | "rejected") => {
    setUpdating(id);
    const res = await fetch("/api/adoption", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      if (selected?.id === id) setSelected({ ...selected, status });
    }
    setUpdating(null);
  };

  const filtered = requests.filter((r) => {
    const matchSearch = !search || `${r.name} ${r.email} ${r.animal_name}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusLabel = (s: string) => s === "pending" ? "Очікує" : s === "approved" ? "Схвалено" : "Відхилено";
  const statusColor = (s: string) => s === "pending" ? "bg-yellow-100 text-yellow-700" : s === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  const typeLabel = (t: string) => t === "dog" ? "🐕 Собака" : t === "cat" ? "🐈 Кіт" : "🐾 Інше";

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Анкети на усиновлення</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Пошук за ім'ям, email, тварина..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#ced48c]/30 w-72"
        />
        <div className="flex gap-1">
          {(["all", "pending", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s ? "bg-[#ced48c] text-foreground" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {s === "all" ? "Усі" : statusLabel(s)}
              <span className="ml-1 opacity-60">
                {s === "all" ? requests.length : requests.filter((r) => r.status === s).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
          {requests.length === 0 ? "Ще немає анкет" : "Нічого не знайдено"}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className="w-full bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4 text-left hover:border-[#ced48c] transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#ced48c]/20 flex items-center justify-center text-sm font-bold text-[#5b7765] shrink-0">
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm truncate">{r.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(r.status)}`}>
                      {statusLabel(r.status)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {typeLabel(r.animal_type)}: <span className="text-gray-600 font-medium">{r.animal_name}</span>
                    <span className="mx-1.5">·</span>
                    {new Date(r.created_at).toLocaleDateString("uk-UA")}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 shrink-0">{r.phone}</p>
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-modal-overlay" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-modal-in overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-5 pb-0 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#ced48c]/20 flex items-center justify-center text-lg font-bold text-[#5b7765]">
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold">{selected.name}</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusColor(selected.status)}`}>
                      {statusLabel(selected.status)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-medium mt-0.5">{new Date(selected.created_at).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-foreground transition-colors">
                <IconX size={20} />
              </button>
            </div>

            <div className="p-5">
              {/* Animal info */}
              <div className="bg-[#ced48c]/10 rounded-xl p-3.5 flex items-center gap-3 mb-5">
                <IconPawFilled size={20} className="text-[#ced48c] flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-medium">Тварина</p>
                  <p className="text-sm font-semibold">{selected.animal_name} · {typeLabel(selected.animal_type)}</p>
                </div>
                <a href={`/animals/${selected.animal_id}`} target="_blank" className="ml-auto text-xs text-[#5b7765] font-medium hover:underline">Переглянути →</a>
              </div>

              {/* Contact details */}
              <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-3">Контактні дані</p>
              <div className="space-y-2.5 mb-5">
                <div className="flex items-center gap-2.5 text-sm">
                  <IconPhoneFilled size={16} className="text-gray-400 flex-shrink-0" />
                  <a href={`tel:${selected.phone}`} className="text-foreground hover:underline">{selected.phone}</a>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <IconMailFilled size={16} className="text-gray-400 flex-shrink-0" />
                  <a href={`mailto:${selected.email}`} className="text-foreground hover:underline">{selected.email}</a>
                </div>
                {selected.location && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconMapPinFilled size={16} className="text-gray-400 flex-shrink-0" />
                    <span>{selected.location}</span>
                  </div>
                )}
                {selected.instagram && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconBrandInstagram size={16} className="text-gray-400 flex-shrink-0" />
                    <a href={`https://instagram.com/${selected.instagram}`} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">@{selected.instagram}</a>
                  </div>
                )}
                {selected.telegram && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconBrandTelegram size={16} className="text-gray-400 flex-shrink-0" />
                    <a href={`https://t.me/${selected.telegram}`} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">@{selected.telegram}</a>
                  </div>
                )}
                {selected.facebook && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconBrandFacebook size={16} className="text-gray-400 flex-shrink-0" />
                    <a href={`https://facebook.com/${selected.facebook}`} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">{selected.facebook}</a>
                  </div>
                )}
              </div>

              {/* Message */}
              {selected.message && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-2">Повідомлення</p>
                  <div className="bg-gray-light rounded-xl p-4 flex gap-2.5">
                    <IconMessageFilled size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 leading-relaxed">{selected.message}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selected.status === "pending" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(selected.id, "approved")}
                    disabled={updating === selected.id}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <IconCheck size={18} />
                    Схвалити
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, "rejected")}
                    disabled={updating === selected.id}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <IconBan size={18} />
                    Відхилити
                  </button>
                </div>
              ) : (
                <div className={`text-center py-3 rounded-xl text-sm font-medium ${statusColor(selected.status)}`}>
                  {statusLabel(selected.status)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
