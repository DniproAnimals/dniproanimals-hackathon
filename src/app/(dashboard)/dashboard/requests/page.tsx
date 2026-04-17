"use client";
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  EmptyState,
  FilterChip,
  Input,
} from "@/components/ui";
import {
  IconBan,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconCheck,
  IconMailFilled,
  IconMapPinFilled,
  IconMessageFilled,
  IconPawFilled,
  IconPhoneFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useDashboard } from "../layout";

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
  const { org } = useDashboard();
  const [requests, setRequests] = useState<Request[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [updating, setUpdating] = useState<number | null>(null);
  const [selected, setSelected] = useState<Request | null>(null);

  const fetchRequests = useCallback(() => {
    if (!org) return;
    fetch(`/api/adoption?org_id=${org.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRequests(data);
      });
  }, [org]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateStatus = async (id: number, status: "approved" | "rejected") => {
    setUpdating(id);
    const res = await fetch("/api/adoption", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
      if (selected?.id === id) setSelected({ ...selected, status });
    }
    setUpdating(null);
  };

  const filtered = requests.filter((r) => {
    const matchSearch =
      !search ||
      `${r.name} ${r.email} ${r.animal_name}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusLabel = (s: string) =>
    s === "pending" ? "Очікує" : s === "approved" ? "Схвалено" : "Відхилено";
  const statusVariant = (s: string): "warning" | "success" | "danger" =>
    s === "pending" ? "warning" : s === "approved" ? "success" : "danger";
  const typeLabel = (t: string) =>
    t === "dog" ? "🐕 Собака" : t === "cat" ? "🐈 Кіт" : "🐾 Інше";

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Анкети на усиновлення
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Input
          type="text"
          placeholder="Пошук за ім'ям, email, тварина..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white w-72"
        />
        <div className="flex gap-1">
          {(["all", "pending", "approved", "rejected"] as const).map((s) => (
            <FilterChip
              key={s}
              variant={statusFilter === s ? "active" : "outline"}
              size="md"
              onClick={() => setStatusFilter(s)}
              count={
                s === "all"
                  ? requests.length
                  : requests.filter((r) => r.status === s).length
              }
            >
              {s === "all" ? "Усі" : statusLabel(s)}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            title={
              requests.length === 0 ? "Ще немає анкет" : "Нічого не знайдено"
            }
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className="w-full bg-white rounded-xl border border-gray-border p-4 flex items-center justify-between gap-4 text-left hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-green-secondary shrink-0">
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm truncate">
                      {r.name}
                    </p>
                    <Badge variant={statusVariant(r.status)} size="sm">
                      {statusLabel(r.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-medium mt-0.5">
                    {typeLabel(r.animal_type)}:{" "}
                    <span className="text-foreground font-medium">
                      {r.animal_name}
                    </span>
                    <span className="mx-1.5">·</span>
                    {new Date(r.created_at).toLocaleDateString("uk-UA")}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-medium shrink-0">{r.phone}</p>
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {selected && (
            <>
              {/* Header */}
              <div className="p-5 pb-0 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-green-secondary">
                    {selected.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">{selected.name}</h2>
                      <Badge variant={statusVariant(selected.status)} size="md">
                        {statusLabel(selected.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-medium mt-0.5">
                      {new Date(selected.created_at).toLocaleDateString(
                        "uk-UA",
                        { day: "numeric", month: "long", year: "numeric" },
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Animal info */}
                <div className="bg-primary/10 rounded-xl p-3.5 flex items-center gap-3 mb-5">
                  <IconPawFilled size={20} className="text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-gray-medium">Тварина</p>
                    <p className="text-sm font-semibold">
                      {selected.animal_name} · {typeLabel(selected.animal_type)}
                    </p>
                  </div>
                  <Link
                    href={`/animals/${selected.animal_id}`}
                    target="_blank"
                    className="ml-auto text-xs text-green-secondary font-medium hover:underline"
                  >
                    Переглянути →
                  </Link>
                </div>

                {/* Contact details */}
                <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-3">
                  Контактні дані
                </p>
                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconPhoneFilled
                      size={16}
                      className="text-gray-medium shrink-0"
                    />
                    <a
                      href={`tel:${selected.phone}`}
                      className="text-foreground hover:underline"
                    >
                      {selected.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconMailFilled
                      size={16}
                      className="text-gray-medium shrink-0"
                    />
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-foreground hover:underline"
                    >
                      {selected.email}
                    </a>
                  </div>
                  {selected.location && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <IconMapPinFilled
                        size={16}
                        className="text-gray-medium shrink-0"
                      />
                      <span>{selected.location}</span>
                    </div>
                  )}
                  {selected.instagram && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <IconBrandInstagram
                        size={16}
                        className="text-gray-medium shrink-0"
                      />
                      <a
                        href={`https://instagram.com/${selected.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:underline"
                      >
                        @{selected.instagram}
                      </a>
                    </div>
                  )}
                  {selected.telegram && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <IconBrandTelegram
                        size={16}
                        className="text-gray-medium shrink-0"
                      />
                      <a
                        href={`https://t.me/${selected.telegram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:underline"
                      >
                        @{selected.telegram}
                      </a>
                    </div>
                  )}
                  {selected.facebook && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <IconBrandFacebook
                        size={16}
                        className="text-gray-medium shrink-0"
                      />
                      <a
                        href={`https://facebook.com/${selected.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:underline"
                      >
                        {selected.facebook}
                      </a>
                    </div>
                  )}
                </div>

                {/* Message */}
                {selected.message && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-2">
                      Повідомлення
                    </p>
                    <div className="bg-gray-light rounded-xl p-4 flex gap-2.5">
                      <IconMessageFilled
                        size={16}
                        className="text-gray-medium shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-foreground leading-relaxed">
                        {selected.message}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selected.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={() => updateStatus(selected.id, "approved")}
                      disabled={updating === selected.id}
                      className="flex-1"
                    >
                      <IconCheck size={18} />
                      Схвалити
                    </Button>
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => updateStatus(selected.id, "rejected")}
                      disabled={updating === selected.id}
                      className="flex-1"
                    >
                      <IconBan size={18} />
                      Відхилити
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant={statusVariant(selected.status)}
                    size="lg"
                    className="w-full justify-center py-3"
                  >
                    {statusLabel(selected.status)}
                  </Badge>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
