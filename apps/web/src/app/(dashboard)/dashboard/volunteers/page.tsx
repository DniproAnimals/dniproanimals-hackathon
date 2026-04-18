"use client";
import ImageFallback from "@/shared/components/ImageFallback";
import {
  useCreateVolunteerMutation,
  useDeleteVolunteerMutation,
  useUpdateVolunteerMutation,
  useUploadImageMutation,
  useVolunteersQuery,
} from "@/shared/query-hooks";
import type { Volunteer } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
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
  cn,
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
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useDashboard } from "../layout";

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
  const qc = useQueryClient();
  const { isOwner } = useDashboard();
  const { data: volunteers = [] } = useVolunteersQuery();
  const uploadMutation = useUploadImageMutation({
    onSuccess: ({ url }) => setForm((prev) => ({ ...prev, photo: url })),
  });
  const createMutation = useCreateVolunteerMutation({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [endpoints.volunteers.list()] });
      setForm(emptyForm);
      setShowForm(false);
      setEditingVol(null);
    },
  });
  const updateMutation = useUpdateVolunteerMutation({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [endpoints.volunteers.list()] });
      setForm(emptyForm);
      setShowForm(false);
      setEditingVol(null);
    },
  });
  const deleteMutation = useDeleteVolunteerMutation({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [endpoints.volunteers.list()] });
      setSelectedVol(null);
    },
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">(
    "all",
  );
  const [showForm, setShowForm] = useState(false);
  const [editingVol, setEditingVol] = useState<Volunteer | null>(null);
  const [selectedVol, setSelectedVol] = useState<Volunteer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadMutation.mutateAsync(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVol) {
      updateMutation.mutate({ id: editingVol.id, ...form });
    } else {
      createMutation.mutate(form);
    }
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

  const handleDelete = (id: number) => {
    if (!confirm("Видалити волонтера?")) return;
    deleteMutation.mutate({ id });
  };

  const copyInviteLink = (vol: Volunteer) => {
    if (!vol.inviteToken) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/invite?token=${vol.inviteToken}`,
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
      (statusFilter === "active" ? !!v.userId : !v.userId);
    return matchSearch && matchStatus;
  });

  const activeCount = volunteers.filter((v) => v.userId).length;
  const pendingCount = volunteers.length - activeCount;
  const submitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-5xl space-y-6">
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
                      vol.userId
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700",
                    )}
                  >
                    {vol.name.charAt(0)}
                    {vol.surname ? vol.surname.charAt(0) : ""}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-sm truncate">
                    {vol.name}
                    {vol.surname ? ` ${vol.surname}` : ""}
                  </p>
                  {vol.userId ? (
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
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog
        open={!!selectedVol}
        onOpenChange={(open) => {
          if (!open) setSelectedVol(null);
        }}
      >
        <DialogContent className="p-0 overflow-hidden">
          {selectedVol && (
            <>
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
                        selectedVol.userId
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700",
                      )}
                    >
                      {selectedVol.name.charAt(0)}
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
                  {selectedVol.userId ? (
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

                {(selectedVol.phone ||
                  selectedVol.email ||
                  selectedVol.instagram ||
                  selectedVol.telegram) && (
                  <div className="space-y-2 mb-4">
                    {selectedVol.phone && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <IconPhoneFilled size={14} className="text-gray-medium" />
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
                        <IconMailFilled size={14} className="text-gray-medium" />
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
                        <span>@{selectedVol.instagram}</span>
                      </div>
                    )}
                    {selectedVol.telegram && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <IconBrandTelegram
                          size={14}
                          className="text-gray-medium"
                        />
                        <span>@{selectedVol.telegram}</span>
                      </div>
                    )}
                  </div>
                )}

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
                    {!selectedVol.userId && selectedVol.inviteToken && (
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
                  {uploadMutation.isPending
                    ? "Завантаження..."
                    : form.photo
                      ? "Змінити фото"
                      : "Додати фото"}
                </button>
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
              <Input
                type="text"
                required
                placeholder="Ім'я *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Прізвище"
                value={form.surname}
                onChange={(e) => setForm({ ...form, surname: e.target.value })}
              />
            </div>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              placeholder="Чим займається"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="tel"
                placeholder="Телефон"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="Instagram"
                value={form.instagram}
                onChange={(e) =>
                  setForm({ ...form, instagram: e.target.value })
                }
              />
              <Input
                type="text"
                placeholder="Telegram"
                value={form.telegram}
                onChange={(e) =>
                  setForm({ ...form, telegram: e.target.value })
                }
              />
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
