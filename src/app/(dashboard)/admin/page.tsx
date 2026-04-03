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
  website: string | null;
  owner_id: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function SuperadminPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchOrgs = useCallback(() => {
    fetch("/api/organizations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrgs(data);
      });
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
      return;
    }
    if (!loading && user && user.role !== "superadmin") {
      router.replace("/");
      return;
    }
    if (user) fetchOrgs();
  }, [user, loading, router, fetchOrgs]);

  const updateStatus = async (id: number, status: "approved" | "rejected") => {
    setUpdating(id);
    const res = await fetch("/api/superadmin/organizations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setOrgs((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
    setUpdating(null);
  };

  const deleteOrg = async (id: number) => {
    if (!confirm("Видалити організацію? Акаунти власника та волонтерів буде скинуто.")) return;
    setDeleting(id);
    const res = await fetch("/api/superadmin/organizations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setOrgs((prev) => prev.filter((o) => o.id !== id));
    }
    setDeleting(null);
  };

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-medium">Завантаження...</p>
      </div>
    );
  }

  const filtered = filter === "all" ? orgs : orgs.filter((o) => o.status === filter);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image src="/logo.jpg" alt="DniproAnimals" width={36} height={36} className="rounded-full object-cover" />
            </Link>
            <h1 className="text-lg font-bold text-foreground">Глобальна адмін панель</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{user.name}</span>
            <Link href="/" className="text-sm text-gray-500 hover:text-foreground transition-colors">На сайт</Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Організації</h2>
          <div className="flex gap-1">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === f ? "bg-[#ced48c] text-foreground" : "bg-white text-gray-500 hover:bg-gray-100"
                }`}
              >
                {f === "all" ? "Усі" : statusLabel(f)}
                <span className="ml-1 opacity-60">
                  {f === "all" ? orgs.length : orgs.filter((o) => o.status === f).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
            Немає організацій
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((org) => (
              <div key={org.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/organizations/${org.id}`} target="_blank" className="flex-1 min-w-0 hover:opacity-75 transition-opacity">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{org.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(org.status)}`}>
                        {statusLabel(org.status)}
                      </span>
                    </div>
                    {org.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">{org.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      {org.location && <span>{org.location}</span>}
                      {org.email && <span>{org.email}</span>}
                      {org.phone && <span>{org.phone}</span>}
                      {org.website && <span>{org.website}</span>}
                      <span>{new Date(org.created_at).toLocaleDateString("uk-UA")}</span>
                    </div>
                  </Link>

                  <div className="flex gap-2 shrink-0">
                    {org.status === "pending" && (
                      <button
                        onClick={() => updateStatus(org.id, "approved")}
                        disabled={updating === org.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        Схвалити
                      </button>
                    )}
                    {org.status === "approved" && (
                      <button
                        onClick={() => updateStatus(org.id, "rejected")}
                        disabled={updating === org.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-500 text-white hover:bg-yellow-600 transition-colors disabled:opacity-50"
                      >
                        Заблокувати
                      </button>
                    )}
                    {org.status === "rejected" && (
                      <button
                        onClick={() => updateStatus(org.id, "approved")}
                        disabled={updating === org.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        Схвалити
                      </button>
                    )}
                    <button
                      onClick={() => deleteOrg(org.id)}
                      disabled={deleting === org.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {deleting === org.id ? "..." : "Видалити"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
