"use client";
import ImageFallback from "@/components/ImageFallback";
import { cn } from "@/shared/lib/utils";
import {
  IconBrandInstagram,
  IconBrandTelegram,
  IconCircleCheckFilled,
  IconClockFilled,
  IconEdit,
  IconLink,
  IconMailFilled,
  IconPhoneFilled,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUsersGroup,
} from "@dniproanimals/icons";
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Input,
  InputWithIcon,
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@dniproanimals/ui";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDashboard } from "../layout";

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

const emptyForm = {
  name: "",
  surname: "",
  photo: "",
  description: "",
  phone: "",
  email: "",
  instagram: "",
  telegram: "",
};

export default function VolunteersPage() {
  const { isOwner } = useDashboard();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "pending"
  >("all");
  const [showForm, setShowForm] = useState(false);
  const [editingVol, setEditingVol] = useState<Volunteer | null>(null);
  const [selectedVol, setSelectedVol] = useState<Volunteer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchVolunteers = useCallback(() => {
    fetch("/api/volunteers")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setVolunteers(data);
      });
  }, []);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, photo: url }));
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const isEdit = !!editingVol;
    const body = isEdit ? { ...form, id: editingVol.id } : form;
    const res = await fetch("/api/volunteers", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setForm(emptyForm);
      setShowForm(false);
      setEditingVol(null);
      fetchVolunteers();
    }
    setSubmitting(false);
  };

  const openEdit = (vol: Volunteer) => {
    setEditingVol(vol);
    setForm({
      name: vol.name,
      surname: vol.surname || "",
      photo: vol.photo || "",
      description: vol.description || "",
      phone: vol.phone || "",
      email: vol.email || "",
      instagram: vol.instagram || "",
      telegram: vol.telegram || "",
    });
    setShowForm(true);
  };

  const openAdd = () => {
    setEditingVol(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити волонтера?")) return;
    await fetch("/api/volunteers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setVolunteers((prev) => prev.filter((v) => v.id !== id));
    setSelectedVol(null);
  };

  const copyInviteLink = (vol: Volunteer) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/invite?token=${vol.invite_token}`,
    );
    setCopiedId(vol.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = volunteers.filter((v) => {
    const matchSearch =
      !search ||
      `${v.name} ${v.surname || ""} ${v.email || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? v.user_id : !v.user_id);
    return matchSearch && matchStatus;
  });

  const activeCount = volunteers.filter((v) => v.user_id).length;
  const pendingCount = volunteers.length - activeCount;

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Волонтери</h1>
          <p className="text-sm text-gray-medium mt-0.5">
            {volunteers.length} у команді
          </p>
        </div>
        {isOwner && (
          <Button variant="primary" onClick={openAdd}>
            <IconPlus size={16} /> Додати
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: IconUsersGroup,
            color: "bg-blue-50 text-blue-500",
            value: volunteers.length,
            label: "Всього",
          },
          {
            icon: IconCircleCheckFilled,
            color: "bg-green-50 text-green-500",
            value: activeCount,
            label: "Активних",
          },
          {
            icon: IconClockFilled,
            color: "bg-yellow-50 text-yellow-500",
            value: pendingCount,
            label: "Очікують",
          },
        ].map((s) => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <div
              className={cn(
                "size-10 rounded-xl flex items-center justify-center",
                s.color,
              )}
            >
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[11px] text-gray-medium">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-50">
          <InputWithIcon icon={<IconSearch />}>
            <Input
              type="text"
              placeholder="Пошук..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white"
            />
          </InputWithIcon>
        </div>
        <Tabs
          value={statusFilter}
          onValueChange={(v) =>
            setStatusFilter(v as "all" | "active" | "pending")
          }
        >
          <TabsList>
            <TabsTrigger value="all">Усі ({volunteers.length})</TabsTrigger>
            <TabsTrigger value="active">Активні ({activeCount})</TabsTrigger>
            <TabsTrigger value="pending">Очікують ({pendingCount})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconUsersGroup />}
            title={
              volunteers.length === 0
                ? "Ще немає волонтерів"
                : "Нікого не знайдено"
            }
            action={
              volunteers.length === 0 && isOwner ? (
                <Button variant="primary" size="sm" onClick={openAdd}>
                  <IconPlus size={14} /> Додати
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((vol) => (
            <button
              key={vol.id}
              onClick={() => setSelectedVol(vol)}
              className="bg-white rounded-2xl border border-gray-border p-4 text-left hover:border-primary transition-all flex gap-4"
            >
              {/* Avatar */}
              <div className="size-14 rounded-xl overflow-hidden shrink-0 bg-muted relative">
                {vol.photo ? (
                  <ImageFallback
                    src={vol.photo}
                    alt={vol.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div
                    className={cn(
                      "w-full h-full flex items-center justify-center text-base font-bold",
                      vol.user_id
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700",
                    )}
                  >
                    {vol.name.charAt(0)}
                    {vol.surname ? vol.surname.charAt(0) : ""}
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-sm truncate">
                    {vol.name}
                    {vol.surname ? ` ${vol.surname}` : ""}
                  </p>
                  {vol.user_id ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-green-600">
                      <IconCircleCheckFilled size={10} />
                      Активний
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-yellow-600">
                      <IconClockFilled size={10} />
                      Очікує
                    </span>
                  )}
                </div>
                {vol.description && (
                  <p className="text-xs text-gray-medium line-clamp-1 mb-1">
                    {vol.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-[11px] text-gray-medium">
                  {vol.phone && (
                    <span className="flex items-center gap-0.5">
                      <IconPhoneFilled size={10} />
                      {vol.phone}
                    </span>
                  )}
                  {vol.instagram && (
                    <span className="flex items-center gap-0.5">
                      <IconBrandInstagram size={10} />@{vol.instagram}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <Dialog
        open={!!selectedVol}
        onOpenChange={(open) => {
          if (!open) setSelectedVol(null);
        }}
      >
        <DialogContent className="p-0 overflow-hidden">
          {selectedVol && (
            <>
              {/* Header with photo */}
              <div className="relative h-20 bg-primary/30" />
              <div className="px-5 -mt-10 mb-4">
                <div className="size-20 rounded-2xl overflow-hidden border-4 border-white shadow-sm bg-muted relative">
                  {selectedVol.photo ? (
                    <ImageFallback
                      src={selectedVol.photo}
                      alt={selectedVol.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div
                      className={cn(
                        "w-full h-full flex items-center justify-center text-xl font-bold",
                        selectedVol.user_id
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700",
                      )}
                    >
                      {selectedVol.name.charAt(0)}
                      {selectedVol.surname ? selectedVol.surname.charAt(0) : ""}
                    </div>
                  )}
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold">
                    {selectedVol.name}
                    {selectedVol.surname ? ` ${selectedVol.surname}` : ""}
                  </h2>
                  {selectedVol.user_id ? (
                    <Badge variant="success" size="sm">
                      Активний
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      Очікує
                    </Badge>
                  )}
                </div>
                {selectedVol.description && (
                  <p className="text-sm text-gray-medium mb-4">
                    {selectedVol.description}
                  </p>
                )}

                {/* Contacts */}
                {(selectedVol.phone ||
                  selectedVol.email ||
                  selectedVol.instagram ||
                  selectedVol.telegram) && (
                  <div className="space-y-2 mb-4">
                    {selectedVol.phone && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <IconPhoneFilled
                          size={14}
                          className="text-gray-medium"
                        />
                        <a
                          href={`tel:${selectedVol.phone}`}
                          className="hover:underline"
                        >
                          {selectedVol.phone}
                        </a>
                      </div>
                    )}
                    {selectedVol.email && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <IconMailFilled
                          size={14}
                          className="text-gray-medium"
                        />
                        <a
                          href={`mailto:${selectedVol.email}`}
                          className="hover:underline"
                        >
                          {selectedVol.email}
                        </a>
                      </div>
                    )}
                    {selectedVol.instagram && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <IconBrandInstagram
                          size={14}
                          className="text-gray-medium"
                        />
                        <a
                          href={`https://instagram.com/${selectedVol.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          @{selectedVol.instagram}
                        </a>
                      </div>
                    )}
                    {selectedVol.telegram && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <IconBrandTelegram
                          size={14}
                          className="text-gray-medium"
                        />
                        <a
                          href={`https://t.me/${selectedVol.telegram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          @{selectedVol.telegram}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                {isOwner && (
                  <div className="flex gap-2">
                    <Button
                      variant="soft"
                      size="lg"
                      onClick={() => {
                        openEdit(selectedVol);
                        setSelectedVol(null);
                      }}
                      className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      <IconEdit size={14} /> Редагувати
                    </Button>
                    {!selectedVol.user_id && (
                      <Button
                        variant="subtle"
                        size="lg"
                        onClick={() => copyInviteLink(selectedVol)}
                        className="flex-1"
                      >
                        <IconLink size={14} />{" "}
                        {copiedId === selectedVol.id
                          ? "Скопійовано!"
                          : "Запрошення"}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => handleDelete(selectedVol.id)}
                      className="bg-red-50 text-destructive hover:bg-red-100 px-3"
                    >
                      <IconTrash size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit modal */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) {
            setShowForm(false);
            setEditingVol(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingVol ? "Редагувати волонтера" : "Додати волонтера"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Photo */}
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-xl overflow-hidden shrink-0 bg-muted relative">
                {form.photo ? (
                  <ImageFallback
                    src={form.photo}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-medium">
                    <IconPhoto size={24} />
                  </div>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-sm font-medium text-green-secondary hover:underline"
                >
                  {uploading
                    ? "Завантаження..."
                    : form.photo
                      ? "Змінити фото"
                      : "Додати фото"}
                </button>
                {form.photo && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, photo: "" })}
                    className="block text-xs text-destructive mt-0.5"
                  >
                    Видалити
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-medium mb-1">Ім&apos;я *</p>
                <Input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ім'я"
                />
              </div>
              <div>
                <p className="text-xs text-gray-medium mb-1">Прізвище</p>
                <Input
                  type="text"
                  value={form.surname}
                  onChange={(e) =>
                    setForm({ ...form, surname: e.target.value })
                  }
                  placeholder="Прізвище"
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-medium mb-1">Опис / роль</p>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                placeholder="Чим займається"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-medium mb-1">Телефон</p>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+380..."
                />
              </div>
              <div>
                <p className="text-xs text-gray-medium mb-1">Email</p>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-medium mb-1">Instagram</p>
                <Input
                  type="text"
                  value={form.instagram}
                  onChange={(e) =>
                    setForm({ ...form, instagram: e.target.value })
                  }
                  placeholder="@username"
                />
              </div>
              <div>
                <p className="text-xs text-gray-medium mb-1">Telegram</p>
                <Input
                  type="text"
                  value={form.telegram}
                  onChange={(e) =>
                    setForm({ ...form, telegram: e.target.value })
                  }
                  placeholder="@username"
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="w-full"
            >
              {submitting
                ? "Зачекайте..."
                : editingVol
                  ? "Зберегти зміни"
                  : "Додати волонтера"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
