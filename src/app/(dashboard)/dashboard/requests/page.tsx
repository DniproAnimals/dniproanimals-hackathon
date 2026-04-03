"use client";

import { useEffect, useState, useCallback } from "react";
import { IconChevronDown } from "@tabler/icons-react";

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
  const [expandedId, setExpandedId] = useState<number | null>(null);

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
  const typeLabel = (t: string) => t === "dog" ? "Собака" : t === "cat" ? "Кіт" : "Інше";

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
            <div key={r.id} className="bg-white rounded-xl border border-gray-200">
              <div
                className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-xs font-bold text-orange-500 shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground text-sm truncate">{r.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(r.status)}`}>
                        {statusLabel(r.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {typeLabel(r.animal_type)}: <span className="text-gray-600">{r.animal_name}</span>
                      <span className="mx-1.5">·</span>
                      {new Date(r.created_at).toLocaleDateString("uk-UA")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {r.status === "pending" && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(r.id, "approved"); }}
                        disabled={updating === r.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        Схвалити
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(r.id, "rejected"); }}
                        disabled={updating === r.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        Відхилити
                      </button>
                    </>
                  )}
                  <IconChevronDown size={16} className={`text-gray-300 transition-transform ${expandedId === r.id ? "rotate-180" : ""}`} />
                </div>
              </div>

              {expandedId === r.id && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-3 pt-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Email</p>
                      <p className="text-foreground">{r.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Телефон</p>
                      <p className="text-foreground">{r.phone}</p>
                    </div>
                    {r.location && (
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Місто</p>
                        <p className="text-foreground">{r.location}</p>
                      </div>
                    )}
                    {r.instagram && (
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Instagram</p>
                        <p className="text-foreground">{r.instagram}</p>
                      </div>
                    )}
                    {r.telegram && (
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Telegram</p>
                        <p className="text-foreground">{r.telegram}</p>
                      </div>
                    )}
                    {r.facebook && (
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Facebook</p>
                        <p className="text-foreground">{r.facebook}</p>
                      </div>
                    )}
                  </div>
                  {r.message && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 mb-0.5">Повідомлення</p>
                      <p className="text-sm text-foreground bg-gray-50 p-3 rounded-lg">{r.message}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
