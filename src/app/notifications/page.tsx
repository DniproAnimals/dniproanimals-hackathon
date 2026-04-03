"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";

type Notif = { id: number; type: string; title: string; message: string | null; link: string | null; is_read: number; created_at: string };

export default function NotificationsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [requests, setRequests] = useState<{ id: number; name: string; phone: string; email: string; animal_name: string; message: string | null; status: string; created_at: string }[]>([]);
  const [lostItems, setLostItems] = useState<{ id: number; title: string; type: string; contact_name: string; created_at: string }[]>([]);
  const [tab, setTab] = useState<"all" | "requests" | "lost">("all");

  useEffect(() => {
    if (!loading && (!user || user.role === "user")) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || user.role === "user") return;
    fetch("/api/adoption").then((r) => r.json()).then(setRequests);
    fetch("/api/lost").then((r) => r.json()).then(setLostItems);
    fetch("/api/notifications").then((r) => r.json()).then((d: Notif[]) => { if (Array.isArray(d)) setNotifications(d); });
  }, [user]);

  if (loading || !user) return <div className="max-w-3xl mx-auto px-6 py-20 text-center"><div className="w-10 h-10 bg-gray-light rounded-full animate-pulse mx-auto" /></div>;

  const allItems = [
    ...requests.map((r) => ({ id: `req-${r.id}`, type: "adoption" as const, title: `Заявка від ${r.name}`, sub: `на ${r.animal_name}`, date: r.created_at, status: r.status, data: r })),
    ...lostItems.map((l) => ({ id: `lost-${l.id}`, type: "lost" as const, title: l.title, sub: l.contact_name, date: l.created_at, status: l.type, data: l })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = tab === "requests" ? allItems.filter((i) => i.type === "adoption") : tab === "lost" ? allItems.filter((i) => i.type === "lost") : allItems;

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold mb-1">Повідомлення</h1>
      <p className="text-sm text-gray-medium mb-5">{allItems.length} повідомлень</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { value: "all" as const, label: "Всі" },
          { value: "requests" as const, label: `Заявки (${requests.length})` },
          { value: "lost" as const, label: `Загублені (${lostItems.length})` },
        ].map((t) => (
          <button key={t.value} onClick={() => setTab(t.value)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === t.value ? "bg-[#ced48c] text-foreground" : "bg-gray-light text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gray-light mx-auto flex items-center justify-center mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          </div>
          <p className="text-sm text-gray-medium">Немає повідомлень</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-border p-4 hover:border-[#ced48c] transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${item.type === "adoption" ? "bg-[#ced48c]/20" : "bg-red-50"}`}>
                  {item.type === "adoption" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ced48c]"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold truncate">{item.title}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      item.type === "adoption"
                        ? item.status === "pending" ? "bg-yellow-100 text-yellow-700" : item.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {item.type === "adoption" ? (item.status === "pending" ? "Очікує" : item.status === "approved" ? "Схвалено" : "Відхилено") : "Загублено"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-medium">{item.sub}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{new Date(item.date).toLocaleDateString("uk-UA")} · {new Date(item.date).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}</p>
                  {item.type === "adoption" && (
                    <div className="mt-2 text-xs text-gray-600 space-y-0.5">
                      <p>📧 {(item.data as typeof requests[0]).email} · 📞 {(item.data as typeof requests[0]).phone}</p>
                      {(item.data as typeof requests[0]).message && <p className="bg-gray-light rounded-lg p-2 mt-1">{(item.data as typeof requests[0]).message}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
