"use client";
import {
  useAdoptionQuery,
  useUpdateAdoptionStatusMutation,
} from "@/shared/query-hooks";
import type { AdoptionRequestWithAnimal } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
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
} from "@dniproanimals/icons";
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  EmptyState,
  FilterChip,
  Input,
} from "@dniproanimals/ui";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useDashboard } from "../layout";

export default function RequestsPage() {
  const qc = useQueryClient();
  const { org } = useDashboard();
  const { data: requests = [] } = useAdoptionQuery(
    { orgId: org?.id },
    { enabled: !!org?.id },
  );
  const updateMutation = useUpdateAdoptionStatusMutation({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [endpoints.adoption.list()] });
      qc.invalidateQueries({ queryKey: [endpoints.animals.list()] });
    },
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [selected, setSelected] = useState<AdoptionRequestWithAnimal | null>(
    null,
  );

  const updateStatus = (id: number, status: "approved" | "rejected") => {
    updateMutation.mutate({ id, status });
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const filtered = requests.filter((r) => {
    const matchSearch =
      !search ||
      `${r.name} ${r.email} ${r.animalName || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusLabel = (s: string) =>
    s === "pending" ? "Очікує" : s === "approved" ? "Схвалено" : "Відхилено";
  const statusVariant = (s: string): "warning" | "success" | "danger" =>
    s === "pending" ? "warning" : s === "approved" ? "success" : "danger";
  const typeLabel = (t: string | null) =>
    t === "dog" ? "🐕 Собака" : t === "cat" ? "🐈 Кіт" : "🐾 Інше";

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Анкети на усиновлення
      </h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Input
          type="text"
          placeholder="Пошук..."
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
                    {typeLabel(r.animalType)}:{" "}
                    <span className="text-foreground font-medium">
                      {r.animalName}
                    </span>
                    <span className="mx-1.5">·</span>
                    {new Date(r.createdAt).toLocaleDateString("uk-UA")}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-medium shrink-0">{r.phone}</p>
            </button>
          ))}
        </div>
      )}

      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {selected && (
            <>
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
                      {new Date(selected.createdAt).toLocaleDateString("uk-UA")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="bg-primary/10 rounded-xl p-3.5 flex items-center gap-3 mb-5">
                  <IconPawFilled size={20} className="text-primary" />
                  <div>
                    <p className="text-xs text-gray-medium">Тварина</p>
                    <p className="text-sm font-semibold">
                      {selected.animalName} · {typeLabel(selected.animalType)}
                    </p>
                  </div>
                  <Link
                    href={`/animals/${selected.animalId}`}
                    target="_blank"
                    className="ml-auto text-xs text-green-secondary font-medium hover:underline"
                  >
                    Переглянути →
                  </Link>
                </div>

                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconPhoneFilled size={16} className="text-gray-medium" />
                    <a
                      href={`tel:${selected.phone}`}
                      className="text-foreground hover:underline"
                    >
                      {selected.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconMailFilled size={16} className="text-gray-medium" />
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-foreground hover:underline"
                    >
                      {selected.email}
                    </a>
                  </div>
                  {selected.location && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <IconMapPinFilled size={16} className="text-gray-medium" />
                      <span>{selected.location}</span>
                    </div>
                  )}
                  {selected.instagram && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <IconBrandInstagram size={16} className="text-gray-medium" />
                      <span>@{selected.instagram}</span>
                    </div>
                  )}
                  {selected.telegram && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <IconBrandTelegram size={16} className="text-gray-medium" />
                      <span>@{selected.telegram}</span>
                    </div>
                  )}
                  {selected.facebook && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <IconBrandFacebook size={16} className="text-gray-medium" />
                      <span>{selected.facebook}</span>
                    </div>
                  )}
                </div>

                {selected.message && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-2">
                      Повідомлення
                    </p>
                    <div className="bg-gray-light rounded-xl p-4 flex gap-2.5">
                      <IconMessageFilled size={16} className="text-gray-medium" />
                      <p className="text-sm text-foreground leading-relaxed">
                        {selected.message}
                      </p>
                    </div>
                  </div>
                )}

                {selected.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={() => updateStatus(selected.id, "approved")}
                      disabled={updateMutation.isPending}
                      className="flex-1"
                    >
                      <IconCheck size={18} />
                      Схвалити
                    </Button>
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => updateStatus(selected.id, "rejected")}
                      disabled={updateMutation.isPending}
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
