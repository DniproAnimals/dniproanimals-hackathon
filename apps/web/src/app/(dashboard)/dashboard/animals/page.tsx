"use client";
import ImageFallback from "@/components/ImageFallback";
import { cn } from "@/shared/lib/utils";
import { IconChevronDown, IconPhoto, IconX } from "@dniproanimals/icons";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@dniproanimals/ui";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDashboard } from "../layout";

const colorOptions = [
  { value: "Білий", color: "#ffffff" },
  { value: "Чорний", color: "#1a1a1a" },
  { value: "Сірий", color: "#9e9e9e" },
  { value: "Рудий", color: "#c45e1a" },
  { value: "Коричневий", color: "#6d4c2e" },
  { value: "Золотистий", color: "#d4a017" },
  { value: "Кремовий", color: "#f5deb3" },
  { value: "Тигровий", color: "#8B6914" },
  {
    value: "Чорно-білий",
    color: "linear-gradient(135deg, #1a1a1a 50%, #fff 50%)",
  },
];

type Animal = {
  id: number;
  name: string;
  type: "dog" | "cat" | "other";
  breed: string | null;
  sex: "male" | "female" | null;
  age_months: number | null;
  size: "small" | "medium" | "large" | null;
  status: "available" | "adopted" | "reserved";
  photos: string;
  created_at: string;
};

const emptyForm = {
  name: "",
  description: "",
  type: "dog" as string,
  breed: "",
  sex: "",
  age_months: "",
  weight_kg: "",
  size: "",
  color: "",
  vaccinated: false,
  sterilized: false,
  trained: false,
  photos: "[]",
  status: "available",
  contact_name: "",
  contact_phone: "",
  contact_email: "",
  contact_instagram: "",
  contact_telegram: "",
  contact_facebook: "",
  contact_location: "",
};

export default function AnimalsPage() {
  const { org } = useDashboard();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const currentPhotos: string[] = JSON.parse(form.photos || "[]");
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        currentPhotos.push(url);
      }
    }
    setForm((prev) => ({ ...prev, photos: JSON.stringify(currentPhotos) }));
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const toggleColor = (value: string) => {
    const next = selectedColors.includes(value)
      ? selectedColors.filter((c) => c !== value)
      : [...selectedColors, value];
    setSelectedColors(next);
    setForm((prev) => ({ ...prev, color: next.join(", ") }));
  };

  const fetchAnimals = useCallback(() => {
    if (!org) return;
    const params = new URLSearchParams();
    params.set("org_id", String(org.id));
    if (typeFilter) params.set("type", typeFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("q", search);
    fetch(`/api/animals?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAnimals(data);
      });
  }, [org, typeFilter, statusFilter, search]);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const body = {
      ...form,
      age_months: form.age_months ? Number(form.age_months) : null,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      photos: JSON.parse(form.photos || "[]"),
    };
    const url = editingId ? `/api/animals/${editingId}` : "/api/animals";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchAnimals();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити тварину?")) return;
    const res = await fetch(`/api/animals/${id}`, { method: "DELETE" });
    if (res.ok) setAnimals((prev) => prev.filter((a) => a.id !== id));
  };

  const typeLabel = (t: string) =>
    t === "dog" ? "Собака" : t === "cat" ? "Кіт" : "Інше";
  const statusLabel = (s: string) =>
    s === "available"
      ? "Шукає дім"
      : s === "adopted"
        ? "Усиновлено"
        : "Заброньовано";
  const statusVariant = (s: string): "success" | "info" | "warning" =>
    s === "available" ? "success" : s === "adopted" ? "info" : "warning";
  const sexLabel = (s: string | null) =>
    s === "male" ? "Хлопчик" : s === "female" ? "Дівчинка" : "";

  const getPhoto = (photos: string) => {
    try {
      const arr = JSON.parse(photos);
      return Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Тварини</h1>
        <Button asChild variant="primary">
          <Link href="/dashboard/animals/edit">Додати тварину</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Input
          type="text"
          placeholder="Пошук..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white w-56"
        />
        <Select
          value={typeFilter || "all"}
          onValueChange={(v) => setTypeFilter(v === "all" ? "" : v)}
        >
          <SelectTrigger className="bg-white w-auto">
            <SelectValue placeholder="Усі види" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Усі види</SelectItem>
            <SelectItem value="dog">Собаки</SelectItem>
            <SelectItem value="cat">Коти</SelectItem>
            <SelectItem value="other">Інше</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter || "all"}
          onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}
        >
          <SelectTrigger className="bg-white w-auto">
            <SelectValue placeholder="Усі статуси" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Усі статуси</SelectItem>
            <SelectItem value="available">Шукає дім</SelectItem>
            <SelectItem value="reserved">Заброньовано</SelectItem>
            <SelectItem value="adopted">Усиновлено</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-gray-medium">
          {animals.length} тварин
        </span>
      </div>

      {/* Table */}
      {animals.length === 0 ? (
        <Card>
          <EmptyState title="Немає тварин" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Тварина</TableHead>
                <TableHead className="hidden sm:table-cell">Вид</TableHead>
                <TableHead className="hidden md:table-cell">Стать</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {animals.map((a) => {
                const photo = getPhoto(a.photos);
                return (
                  <TableRow key={a.id} className="cursor-pointer">
                    <TableCell>
                      <Link
                        href={`/animals/${a.id}`}
                        className="flex items-center gap-3"
                      >
                        {photo ? (
                          <ImageFallback
                            src={photo}
                            alt={a.name}
                            width={36}
                            height={36}
                            className="size-9 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="size-9 rounded-lg bg-muted flex items-center justify-center text-xs text-gray-medium">
                            {a.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {a.name}
                          </p>
                          {a.breed && (
                            <p className="text-xs text-gray-medium">
                              {a.breed}
                            </p>
                          )}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-gray-medium">
                      {typeLabel(a.type)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-medium">
                      {sexLabel(a.sex)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(a.status)} size="sm">
                        {statusLabel(a.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                        >
                          <Link href={`/dashboard/animals/edit?edit=${a.id}`}>
                            Редагувати
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-destructive hover:bg-red-50"
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            handleDelete(a.id);
                          }}
                        >
                          Видалити
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Quick add/edit modal */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) {
            setShowForm(false);
            setEditingId(null);
          } else {
            setShowForm(true);
          }
        }}
      >
        <DialogContent hideClose className="p-0 overflow-hidden">
          <DialogHeader className="bg-primary px-5 py-4 flex flex-row items-center justify-between space-y-0">
            <DialogTitle>
              {editingId ? "Редагувати тварину" : "Додати тварину"}
            </DialogTitle>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="text-foreground/60 hover:text-foreground"
            >
              <IconX size={20} />
            </button>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-5 space-y-3">
            {/* Photos */}
            <div>
              <p className="text-xs text-gray-medium mb-1">Фото</p>
              <div className="flex items-center gap-2 flex-wrap">
                {(() => {
                  try {
                    const arr = JSON.parse(form.photos || "[]");
                    return Array.isArray(arr) ? arr : [];
                  } catch {
                    return [];
                  }
                })().map((url: string, i: number) => (
                  <div
                    key={i}
                    className="relative size-14 rounded-lg overflow-hidden group"
                  >
                    <ImageFallback
                      src={url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const arr = JSON.parse(form.photos || "[]");
                        arr.splice(i, 1);
                        setForm({ ...form, photos: JSON.stringify(arr) });
                      }}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="size-14 rounded-lg border-2 border-dashed border-gray-border flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <IconPhoto size={18} className="text-gray-medium" />
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              {uploading && (
                <p className="text-[11px] text-gray-medium mt-1">
                  Завантаження...
                </p>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-medium mb-1">Ім&apos;я *</p>
              <Input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ім'я тварини"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-xs text-gray-medium mb-1">Вид *</p>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">🐕 Собака</SelectItem>
                    <SelectItem value="cat">🐈 Кіт</SelectItem>
                    <SelectItem value="other">🐾 Інше</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-gray-medium mb-1">Стать</p>
                <Select
                  value={form.sex || "none"}
                  onValueChange={(v) =>
                    setForm({ ...form, sex: v === "none" ? "" : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">—</SelectItem>
                    <SelectItem value="male">Хлопчик</SelectItem>
                    <SelectItem value="female">Дівчинка</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-gray-medium mb-1">Розмір</p>
                <Select
                  value={form.size || "none"}
                  onValueChange={(v) =>
                    setForm({ ...form, size: v === "none" ? "" : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">—</SelectItem>
                    <SelectItem value="small">Малий</SelectItem>
                    <SelectItem value="medium">Середній</SelectItem>
                    <SelectItem value="large">Великий</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-medium mb-1">Порода</p>
              <Input
                type="text"
                value={form.breed}
                onChange={(e) => setForm({ ...form, breed: e.target.value })}
                placeholder="Мікс"
              />
            </div>

            {/* Color picker */}
            <div>
              <p className="text-xs text-gray-medium mb-1">Колір</p>
              <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-10 px-4 rounded-xl border border-gray-border bg-gray-light text-sm text-left flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                  >
                    {selectedColors.length > 0 ? (
                      <span className="flex items-center gap-1.5 flex-wrap">
                        {selectedColors.map((c) => {
                          const opt = colorOptions.find((o) => o.value === c);
                          return (
                            <span
                              key={c}
                              className="flex items-center gap-1 text-xs"
                            >
                              <span
                                className="size-3 rounded-full border border-gray-border shrink-0"
                                style={{ background: opt?.color || "#ccc" }}
                              />
                              {c}
                            </span>
                          );
                        })}
                      </span>
                    ) : (
                      <span className="text-gray-medium">Оберіть колір</span>
                    )}
                    <IconChevronDown
                      size={14}
                      className={cn(
                        "text-gray-medium transition-transform",
                        showColorPicker && "rotate-180",
                      )}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-(--radix-popover-trigger-width) p-1 max-h-48 overflow-auto"
                >
                  {colorOptions.map((c) => {
                    const sel = selectedColors.includes(c.value);
                    const isG = c.color.includes("gradient");
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => toggleColor(c.value)}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-muted rounded-lg"
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="size-4 rounded-full border border-gray-border shrink-0"
                            style={
                              isG
                                ? { background: c.color }
                                : { backgroundColor: c.color }
                            }
                          />
                          <span className={sel ? "font-medium" : ""}>
                            {c.value}
                          </span>
                        </span>
                        {sel && (
                          <span className="text-primary font-bold">✓</span>
                        )}
                      </button>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <p className="text-xs text-gray-medium mb-1">Опис</p>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                placeholder="Характер, особливості..."
              />
            </div>
            <div className="flex gap-3">
              <label
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs cursor-pointer transition-colors",
                  form.vaccinated
                    ? "bg-primary/20 border-primary"
                    : "border-gray-border",
                )}
              >
                <Checkbox
                  checked={form.vaccinated}
                  onCheckedChange={(v) => setForm({ ...form, vaccinated: !!v })}
                  className="size-4"
                />
                <span>💉 Вакциновано</span>
              </label>
              <label
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs cursor-pointer transition-colors",
                  form.sterilized
                    ? "bg-primary/20 border-primary"
                    : "border-gray-border",
                )}
              >
                <Checkbox
                  checked={form.sterilized}
                  onCheckedChange={(v) => setForm({ ...form, sterilized: !!v })}
                  className="size-4"
                />
                <span>✂️ Стерилізовано</span>
              </label>
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Зачекайте..." : editingId ? "Зберегти" : "Додати"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
