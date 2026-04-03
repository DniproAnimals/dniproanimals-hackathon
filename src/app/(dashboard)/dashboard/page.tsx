"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import Image from "next/image";
import Link from "next/link";

type Organization = {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  status: "pending" | "approved" | "rejected";
};

type Volunteer = {
  id: number;
  name: string;
  surname: string | null;
  photo: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  telegram: string | null;
  user_id: number | null;
  invite_token: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [org, setOrg] = useState<Organization | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: "", surname: "", description: "", phone: "", email: "", instagram: "", telegram: "" });
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const fetchData = useCallback(async () => {
    const [orgsRes, volsRes] = await Promise.all([
      fetch("/api/organizations"),
      fetch("/api/volunteers"),
    ]);
    const orgs = await orgsRes.json();
    const vols = await volsRes.json();

    if (Array.isArray(orgs) && user?.org_id) {
      const myOrg = orgs.find((o: Organization & { owner_id: number }) => o.id === user.org_id);
      if (myOrg) {
        setOrg(myOrg);
        setIsOwner(myOrg.owner_id === user.id);
      }
    }
    if (Array.isArray(vols)) setVolunteers(vols);
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    } else if (!loading && user && !user.org_id) {
      router.replace("/");
    } else if (user) {
      fetchData();
    }
  }, [user, loading, router, fetchData]);

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
      setShowAddForm(false);
      fetchData();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch("/api/volunteers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setVolunteers((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const copyInviteLink = (vol: Volunteer) => {
    const link = `${window.location.origin}/invite?token=${vol.invite_token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(vol.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-medium">Завантаження...</p>
      </div>
    );
  }

  if (!user) return null;

  const statusLabel = (s: string) => {
    if (s === "pending") return "На модерації";
    if (s === "approved") return "Схвалено";
    return "Відхилено";
  };
  const statusColor = (s: string) => {
    if (s === "pending") return "bg-yellow-100 text-yellow-800";
    if (s === "approved") return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image src="/logo.jpg" alt="DniproAnimals" width={36} height={36} className="rounded-full object-cover" />
            </Link>
            <h1 className="text-lg font-bold text-foreground">Панель організації</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{user.name}</span>
            <Link href="/" className="text-sm text-gray-500 hover:text-foreground transition-colors">На сайт</Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Org info */}
        {org && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-foreground">{org.name}</h2>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(org.status)}`}>
                {statusLabel(org.status)}
              </span>
            </div>
            {org.description && <p className="text-sm text-gray-500 mb-3">{org.description}</p>}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
              {org.location && <span>{org.location}</span>}
              {org.email && <span>{org.email}</span>}
              {org.phone && <span>{org.phone}</span>}
            </div>
          </div>
        )}

        {/* Volunteers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Волонтери <span className="text-gray-400 text-base font-normal">({volunteers.length})</span>
            </h2>
            {isOwner && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-[#ced48c] text-foreground hover:bg-[#b8be72] transition-colors"
              >
                {showAddForm ? "Скасувати" : "Додати волонтера"}
              </button>
            )}
          </div>

          {/* Add form */}
          {showAddForm && (
            <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-200 p-5 mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-medium mb-1">Ім'я *</p>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Ім'я" />
                </div>
                <div>
                  <p className="text-xs text-gray-medium mb-1">Прізвище</p>
                  <input type="text" value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} className={inputClass} placeholder="Прізвище" />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-medium mb-1">Опис</p>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} rows={2} placeholder="Чим займається волонтер" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-medium mb-1">Телефон</p>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+380..." />
                </div>
                <div>
                  <p className="text-xs text-gray-medium mb-1">Email</p>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="email@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-medium mb-1">Instagram</p>
                  <input type="text" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className={inputClass} placeholder="@username" />
                </div>
                <div>
                  <p className="text-xs text-gray-medium mb-1">Telegram</p>
                  <input type="text" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} className={inputClass} placeholder="@username" />
                </div>
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-[#ced48c] text-foreground py-2.5 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50 text-sm">
                {submitting ? "Зачекайте..." : "Додати"}
              </button>
            </form>
          )}

          {/* List */}
          {volunteers.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
              Ще немає волонтерів
            </div>
          ) : (
            <div className="space-y-3">
              {volunteers.map((vol) => (
                <div key={vol.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">
                        {vol.name}{vol.surname ? ` ${vol.surname}` : ""}
                      </p>
                      {vol.user_id ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">Активний</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">Очікує</span>
                      )}
                    </div>
                    {vol.description && <p className="text-xs text-gray-500 mb-1">{vol.description}</p>}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      {vol.phone && <span>{vol.phone}</span>}
                      {vol.email && <span>{vol.email}</span>}
                      {vol.instagram && <span>IG: {vol.instagram}</span>}
                      {vol.telegram && <span>TG: {vol.telegram}</span>}
                    </div>
                  </div>

                  {isOwner && (
                    <div className="flex gap-2 shrink-0">
                      {!vol.user_id && (
                        <button
                          onClick={() => copyInviteLink(vol)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          {copiedId === vol.id ? "Скопійовано!" : "Копіювати посилання"}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(vol.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        Видалити
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
