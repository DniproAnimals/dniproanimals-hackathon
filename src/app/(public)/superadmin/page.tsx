"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";

type Org = { id: number; name: string; description: string | null; location: string | null; status: string; owner_id: number; created_at: string };

export default function SuperAdminPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [orgs, setOrgs] = useState<Org[]>([]);

  useEffect(() => {
    if (!loading && user?.role !== "superadmin") router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    fetch("/api/organizations").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setOrgs(d); });
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/superadmin/organizations`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setOrgs(orgs.map((o) => o.id === id ? { ...o, status } : o));
  };

  const deleteOrg = async (id: number) => {
    if (!confirm("Видалити організацію? Це видалить всіх волонтерів та скине роль власника.")) return;
    await fetch(`/api/superadmin/organizations`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setOrgs(orgs.filter((o) => o.id !== id));
  };

  if (loading || user?.role !== "superadmin") return null;

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-600",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold mb-1">Суперадмін</h1>
      <p className="text-sm text-gray-medium mb-6">Модерація організацій</p>

      {orgs.length === 0 ? (
        <p className="text-center py-16 text-sm text-gray-medium">Організацій поки немає</p>
      ) : (
        <div className="space-y-3">
          {orgs.map((org) => (
            <div key={org.id} className="bg-white rounded-2xl border border-gray-border p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{org.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[org.status] || ""}`}>
                      {org.status === "pending" ? "На модерації" : org.status === "approved" ? "Схвалено" : "Відхилено"}
                    </span>
                  </div>
                  {org.location && <p className="text-xs text-gray-medium mb-1">📍 {org.location}</p>}
                  {org.description && <p className="text-xs text-gray-600 line-clamp-2">{org.description}</p>}
                  <p className="text-[10px] text-gray-400 mt-1">{new Date(org.created_at).toLocaleDateString("uk-UA")}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {org.status !== "approved" && (
                    <button onClick={() => updateStatus(org.id, "approved")} className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-medium hover:bg-green-100 transition-colors">
                      Схвалити
                    </button>
                  )}
                  {org.status !== "rejected" && (
                    <button onClick={() => updateStatus(org.id, "rejected")} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors">
                      Відхилити
                    </button>
                  )}
                  <button onClick={() => deleteOrg(org.id)} className="px-3 py-1.5 rounded-lg bg-gray-light text-gray-medium text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors">
                    Видалити
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
