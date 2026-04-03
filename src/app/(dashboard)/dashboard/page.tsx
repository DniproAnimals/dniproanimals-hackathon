"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDashboard } from "./layout";
import { useUser } from "@/lib/UserContext";
import {
  IconPawFilled,
  IconUsersGroup,
  IconFileTextFilled,
  IconPlus,
  IconArrowRight,
  IconClock,
  IconCircleCheckFilled,
  IconAlertTriangleFilled,
  IconClockFilled,
  IconX,
} from "@tabler/icons-react";

type Animal = {
  id: number;
  name: string;
  type: string;
  status: string;
  photos: string;
  created_at: string;
};

type Request = {
  id: number;
  name: string;
  animal_name: string;
  status: string;
  created_at: string;
};

type Volunteer = {
  id: number;
  name: string;
  surname: string | null;
  user_id: number | null;
};

export default function DashboardOverview() {
  const { org, isOwner } = useDashboard();
  const { user } = useUser();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [volForm, setVolForm] = useState({ name: "", surname: "", description: "", phone: "", email: "", instagram: "", telegram: "" });
  const [volSubmitting, setVolSubmitting] = useState(false);

  useEffect(() => {
    if (!org) return;
    Promise.all([
      fetch(`/api/animals?org_id=${org.id}`).then((r) => r.json()),
      fetch(`/api/adoption?org_id=${org.id}`).then((r) => r.json()),
      fetch("/api/volunteers").then((r) => r.json()),
    ]).then(([a, r, v]) => {
      if (Array.isArray(a)) setAnimals(a);
      if (Array.isArray(r)) setRequests(r);
      if (Array.isArray(v)) setVolunteers(v);
      setLoading(false);
    });
  }, [org]);

  const handleAddVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    setVolSubmitting(true);
    const res = await fetch("/api/volunteers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(volForm),
    });
    if (res.ok) {
      const vols = await fetch("/api/volunteers").then((r) => r.json());
      if (Array.isArray(vols)) setVolunteers(vols);
      setVolForm({ name: "", surname: "", description: "", phone: "", email: "", instagram: "", telegram: "" });
      setShowVolunteerModal(false);
    }
    setVolSubmitting(false);
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const availableAnimals = animals.filter((a) => a.status === "available");
  const activeVolunteers = volunteers.filter((v) => v.user_id);
  const recentAnimals = animals.slice(0, 5);
  const recentRequests = requests.slice(0, 5);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} хв тому`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} год тому`;
    const days = Math.floor(hours / 24);
    return `${days} дн тому`;
  };

  if (loading) {
    return (
      <div className="max-w-5xl animate-pulse space-y-6">
        <div className="h-8 bg-gray-100 rounded-lg w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-gray-100 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-64 bg-gray-100 rounded-xl" />
          <div className="h-64 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Вітаємо, {user?.name}!
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Ось що відбувається у вашій організації
        </p>
      </div>

      {/* Org status alert */}
      {org && org.status === "pending" && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <IconClockFilled size={20} className="text-yellow-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Організація на модерації</p>
            <p className="text-xs text-yellow-600 mt-0.5">Ваша організація очікує перевірки адміністратором. Деякі функції можуть бути обмежені.</p>
          </div>
        </div>
      )}
      {org && org.status === "rejected" && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <IconAlertTriangleFilled size={20} className="text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">Організацію відхилено</p>
            <p className="text-xs text-red-600 mt-0.5">Зверніться до адміністрації для уточнення причин.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/animals" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#ced48c]/20 flex items-center justify-center">
              <IconPawFilled size={20} className="text-[#5b7765]" />
            </div>
            <IconArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
          <p className="text-2xl font-bold text-foreground">{animals.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Тварин всього</p>
          <p className="text-[10px] text-[#5b7765] mt-1">{availableAnimals.length} шукають дім</p>
        </Link>

        <Link href="/dashboard/requests" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <IconFileTextFilled size={20} className="text-orange-500" />
            </div>
            <IconArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
          <p className="text-2xl font-bold text-foreground">{requests.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Анкет всього</p>
          {pendingRequests.length > 0 && (
            <p className="text-[10px] text-orange-500 mt-1 font-medium">{pendingRequests.length} очікують розгляду</p>
          )}
        </Link>

        <Link href="/dashboard/volunteers" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <IconUsersGroup size={20} className="text-blue-500" />
            </div>
            <IconArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
          <p className="text-2xl font-bold text-foreground">{volunteers.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Волонтерів</p>
          <p className="text-[10px] text-blue-500 mt-1">{activeVolunteers.length} активних</p>
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <IconCircleCheckFilled size={20} className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {requests.filter((r) => r.status === "approved").length}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Успішних усиновлень</p>
        </div>
      </div>

      {/* Two columns: recent animals + recent requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent animals */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-foreground">Останні тварини</h2>
            <div className="flex items-center gap-2">
              {isOwner && (
                <Link href="/dashboard/animals" className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ced48c] text-foreground text-xs font-medium hover:bg-[#b8be72] transition-colors">
                  <IconPlus size={12} />
                  Додати
                </Link>
              )}
              <Link href="/dashboard/animals" className="text-xs text-gray-400 hover:text-foreground transition-colors">
                Всі →
              </Link>
            </div>
          </div>
          {recentAnimals.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Ще немає тварин</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentAnimals.map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ced48c]/20 flex items-center justify-center text-xs shrink-0">
                    {a.type === "dog" ? "🐕" : a.type === "cat" ? "🐈" : "🐾"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                      <IconClock size={10} />
                      {timeAgo(a.created_at)}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    a.status === "available" ? "bg-green-100 text-green-700" :
                    a.status === "adopted" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {a.status === "available" ? "Шукає дім" : a.status === "adopted" ? "Усиновлено" : "Заброньовано"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent requests */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-foreground">Останні анкети</h2>
            <Link href="/dashboard/requests" className="text-xs text-gray-400 hover:text-foreground transition-colors">
              Всі →
            </Link>
          </div>
          {recentRequests.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Ще немає анкет</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentRequests.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-xs font-bold text-orange-500 shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">
                      хоче усиновити <span className="text-gray-600">{r.animal_name}</span>
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    r.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    r.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {r.status === "pending" ? "Очікує" : r.status === "approved" ? "Схвалено" : "Відхилено"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Volunteers overview */}
      {volunteers.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-foreground">Команда</h2>
            <div className="flex items-center gap-2">
              {isOwner && (
                <button onClick={() => setShowVolunteerModal(true)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-foreground text-xs font-medium hover:bg-gray-50 transition-colors">
                  <IconPlus size={12} />
                  Додати
                </button>
              )}
              <Link href="/dashboard/volunteers" className="text-xs text-gray-400 hover:text-foreground transition-colors">
                Всі →
              </Link>
            </div>
          </div>
          <div className="px-5 py-4 flex flex-wrap gap-3">
            {volunteers.slice(0, 8).map((v) => (
              <div key={v.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  v.user_id ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
                }`}>
                  {v.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-foreground">{v.name}{v.surname ? ` ${v.surname.charAt(0)}.` : ""}</span>
              </div>
            ))}
            {volunteers.length > 8 && (
              <span className="flex items-center px-3 py-1.5 text-xs text-gray-400">
                +{volunteers.length - 8} ще
              </span>
            )}
          </div>
        </div>
      )}
      {/* Add volunteer modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4" onClick={() => setShowVolunteerModal(false)}>
          <form onSubmit={handleAddVolunteer} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-lg">Додати волонтера</h3>
              <button type="button" onClick={() => setShowVolunteerModal(false)} className="text-gray-400 hover:text-foreground">
                <IconX size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Ім&#39;я *</p>
                <input type="text" required value={volForm.name} onChange={(e) => setVolForm({ ...volForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" placeholder="Ім'я" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Прізвище</p>
                <input type="text" value={volForm.surname} onChange={(e) => setVolForm({ ...volForm, surname: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" placeholder="Прізвище" />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Опис</p>
              <textarea value={volForm.description} onChange={(e) => setVolForm({ ...volForm, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm resize-none" rows={2} placeholder="Чим займається" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Телефон</p>
                <input type="tel" value={volForm.phone} onChange={(e) => setVolForm({ ...volForm, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" placeholder="+380..." />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <input type="email" value={volForm.email} onChange={(e) => setVolForm({ ...volForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" placeholder="email@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Instagram</p>
                <input type="text" value={volForm.instagram} onChange={(e) => setVolForm({ ...volForm, instagram: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" placeholder="@username" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Telegram</p>
                <input type="text" value={volForm.telegram} onChange={(e) => setVolForm({ ...volForm, telegram: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" placeholder="@username" />
              </div>
            </div>
            <button type="submit" disabled={volSubmitting} className="w-full bg-[#ced48c] text-foreground py-2.5 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50 text-sm">
              {volSubmitting ? "Зачекайте..." : "Додати волонтера"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
