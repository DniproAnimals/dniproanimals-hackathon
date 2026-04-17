"use client";
import { Badge, Button, Card, EmptyState, FilterChip } from "@/components/ui";
import { useUser } from "@/shared/lib/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
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
    if (
      !confirm(
        "Видалити організацію? Акаунти власника та волонтерів буде скинуто.",
      )
    )
      return;
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

  const filtered =
    filter === "all" ? orgs : orgs.filter((o) => o.status === filter);

  const statusLabel = (s: string) => {
    if (s === "pending") return "На модерації";
    if (s === "approved") return "Схвалено";
    return "Відхилено";
  };

  const statusVariant = (s: string): "warning" | "success" | "danger" => {
    if (s === "pending") return "warning";
    if (s === "approved") return "success";
    return "danger";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image
                src="/logo.jpg"
                alt="DniproAnimals"
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            </Link>
            <h1 className="text-lg font-bold text-foreground">
              Глобальна адмін панель
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-medium">{user.name}</span>
            <Link
              href="/"
              className="text-sm text-gray-medium hover:text-foreground transition-colors"
            >
              На сайт
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Організації</h2>
          <div className="flex gap-1">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <FilterChip
                key={f}
                variant={filter === f ? "active" : "outline"}
                size="md"
                onClick={() => setFilter(f)}
                count={
                  f === "all"
                    ? orgs.length
                    : orgs.filter((o) => o.status === f).length
                }
              >
                {f === "all" ? "Усі" : statusLabel(f)}
              </FilterChip>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card className="p-10">
            <EmptyState title="Немає організацій" />
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((org) => (
              <Card key={org.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <Link
                    href={`/organizations/${org.id}`}
                    target="_blank"
                    className="flex-1 min-w-0 hover:opacity-75 transition-opacity"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {org.name}
                      </h3>
                      <Badge variant={statusVariant(org.status)} size="sm">
                        {statusLabel(org.status)}
                      </Badge>
                    </div>
                    {org.description && (
                      <p className="text-sm text-gray-medium line-clamp-2 mb-2">
                        {org.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-medium">
                      {org.location && <span>{org.location}</span>}
                      {org.email && <span>{org.email}</span>}
                      {org.phone && <span>{org.phone}</span>}
                      {org.website && <span>{org.website}</span>}
                      <span>
                        {new Date(org.created_at).toLocaleDateString("uk-UA")}
                      </span>
                    </div>
                  </Link>

                  <div className="flex gap-2 shrink-0">
                    {org.status === "pending" && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => updateStatus(org.id, "approved")}
                        disabled={updating === org.id}
                      >
                        Схвалити
                      </Button>
                    )}
                    {org.status === "approved" && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => updateStatus(org.id, "rejected")}
                        disabled={updating === org.id}
                        className="bg-yellow-500 text-white hover:bg-yellow-600"
                      >
                        Заблокувати
                      </Button>
                    )}
                    {org.status === "rejected" && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => updateStatus(org.id, "approved")}
                        disabled={updating === org.id}
                      >
                        Схвалити
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteOrg(org.id)}
                      disabled={deleting === org.id}
                    >
                      {deleting === org.id ? "..." : "Видалити"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
