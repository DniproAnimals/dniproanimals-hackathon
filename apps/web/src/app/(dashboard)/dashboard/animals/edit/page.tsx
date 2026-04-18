"use client";
import {
  useAnimalQuery,
  useCreateAnimalMutation,
  useUpdateAnimalMutation,
  useUploadImageMutation,
} from "@/shared/query-hooks";
import type {
  AnimalSex,
  AnimalSize,
  AnimalType,
} from "@dniproanimals/contracts";
import {
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconPhoto,
} from "@dniproanimals/icons";
import {
  Button,
  Checkbox,
  cn,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Textarea,
} from "@dniproanimals/ui";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

const dogBreeds = ["Німецька вівчарка", "Лабрадор", "Хаскі", "Мопс", "Мікс"];
const catBreeds = ["Європейська", "Сіамська", "Мейн-кун", "Мікс"];

const colorOptions = [
  { value: "Білий", color: "#ffffff" },
  { value: "Чорний", color: "#1a1a1a" },
  { value: "Сірий", color: "#9e9e9e" },
  { value: "Рудий", color: "#c45e1a" },
];

export default function AddAnimalPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <Skeleton className="size-10 rounded-full mx-auto" />
        </div>
      }
    >
      <AddAnimalPage />
    </Suspense>
  );
}

function AddAnimalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const fileRef = useRef<HTMLInputElement>(null);
  const [openDropdown, setOpenDropdown] = useState("");

  const { data: existing, isLoading: loadingAnimal } = useAnimalQuery(
    editId ? Number(editId) : 0,
    { enabled: !!editId },
  );

  const uploadMutation = useUploadImageMutation({
    onSuccess: ({ url }) =>
      setForm((prev) => ({ ...prev, photos: [...prev.photos, url] })),
  });
  const createMutation = useCreateAnimalMutation({
    onSuccess: (animal) => router.push(`/animals/${animal.id}`),
  });
  const updateMutation = useUpdateAnimalMutation({
    onSuccess: (animal) => router.push(`/animals/${animal.id}`),
  });

  const submitting = createMutation.isPending || updateMutation.isPending;

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "dog" as AnimalType,
    breed: "",
    sex: "" as AnimalSex | "",
    ageMonths: null as number | null,
    weightKg: null as number | null,
    size: "" as AnimalSize | "",
    color: "",
    vaccinated: false,
    sterilized: false,
    trained: false,
    photos: [] as string[],
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactLocation: "",
  });

  useEffect(() => {
    if (!existing) return;
    setForm({
      name: existing.name,
      description: existing.description || "",
      type: existing.type,
      breed: existing.breed || "",
      sex: existing.sex || "",
      ageMonths: existing.ageMonths,
      weightKg: existing.weightKg,
      size: existing.size || "",
      color: existing.color || "",
      vaccinated: !!existing.vaccinated,
      sterilized: !!existing.sterilized,
      trained: !!existing.trained,
      photos: existing.photos,
      contactName: existing.contactName || "",
      contactPhone: existing.contactPhone || "",
      contactEmail: existing.contactEmail || "",
      contactLocation: existing.contactLocation || "",
    });
  }, [existing]);

  const breeds = form.type === "cat" ? catBreeds : dogBreeds;

  const handleFiles = async (files: FileList) => {
    for (const file of Array.from(files)) {
      await uploadMutation.mutateAsync(file);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: form.name,
      description: form.description || null,
      type: form.type,
      breed: form.breed || null,
      sex: form.sex || null,
      ageMonths: form.ageMonths,
      weightKg: form.weightKg,
      size: form.size || null,
      color: form.color || null,
      vaccinated: form.vaccinated,
      sterilized: form.sterilized,
      trained: form.trained,
      photos: form.photos,
      contactName: form.contactName || null,
      contactPhone: form.contactPhone || null,
      contactEmail: form.contactEmail || null,
      contactLocation: form.contactLocation || null,
    };
    if (editId) {
      updateMutation.mutate({ id: Number(editId), body });
    } else {
      createMutation.mutate({ ...body, status: "available" });
    }
  };

  if (editId && loadingAnimal) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <Skeleton className="size-10 rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-5 gap-2"
      >
        <IconChevronLeft size={18} />
        Назад
      </Button>

      <h1 className="text-2xl font-bold mb-6">
        {editId ? "Редагувати тварину" : "Додати тварину"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-gray-medium uppercase tracking-wider mb-2">
            Фотографії
          </p>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-border rounded-2xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <IconPhoto size={28} className="mx-auto text-gray-medium mb-2" />
            <p className="text-sm font-medium">Натисніть або перетягніть</p>
            {uploadMutation.isPending && (
              <p className="text-xs text-primary mt-1">Завантаження...</p>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
          {form.photos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.photos.map((url, i) => (
                <div
                  key={i}
                  className="relative size-16 rounded-lg overflow-hidden group"
                >
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        photos: form.photos.filter((_, j) => j !== i),
                      })
                    }
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-medium mb-1.5">Ім&apos;я *</p>
          <Input
            type="text"
            placeholder="Ім'я тварини"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <p className="text-xs text-gray-medium mb-1.5">Опис</p>
          <Textarea
            placeholder="Характер, звички, особливості..."
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <p className="text-xs text-gray-medium mb-1.5">Вид *</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "dog", label: "Собака", icon: "🐕" },
              { value: "cat", label: "Кіт", icon: "🐈" },
              { value: "other", label: "Інше", icon: "🐾" },
            ].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() =>
                  setForm({ ...form, type: t.value as AnimalType, breed: "" })
                }
                className={cn(
                  "py-2.5 rounded-xl text-sm font-medium transition-all border",
                  form.type === t.value
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-border hover:border-primary",
                )}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-medium mb-1.5">Порода</p>
          <Popover
            open={openDropdown === "breed"}
            onOpenChange={(o) => setOpenDropdown(o ? "breed" : "")}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm text-left border-gray-border bg-gray-light"
              >
                <span>{form.breed || "Оберіть породу"}</span>
                <IconChevronDown size={14} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-(--radix-popover-trigger-width) p-1 max-h-60 overflow-auto"
            >
              {breeds.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setForm({ ...form, breed: b });
                    setOpenDropdown("");
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-light rounded-lg"
                >
                  {b}
                  {form.breed === b && (
                    <IconCheck size={14} className="text-primary" />
                  )}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <p className="text-xs text-gray-medium mb-1.5">Стать</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "male", label: "Хлопчик" },
              { value: "female", label: "Дівчинка" },
            ].map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setForm({ ...form, sex: s.value as AnimalSex })}
                className={cn(
                  "py-2.5 rounded-xl text-sm font-medium transition-all border",
                  form.sex === s.value
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-border hover:border-primary",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-medium mb-1.5">Вік (місяців)</p>
          <Input
            type="number"
            value={form.ageMonths ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                ageMonths: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>

        <div>
          <p className="text-xs text-gray-medium mb-1.5">Вага (кг)</p>
          <Input
            type="number"
            step="0.1"
            value={form.weightKg ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                weightKg: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>

        <div>
          <p className="text-xs text-gray-medium mb-1.5">Розмір</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "small", label: "Малий" },
              { value: "medium", label: "Середній" },
              { value: "large", label: "Великий" },
            ].map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() =>
                  setForm({ ...form, size: s.value as AnimalSize })
                }
                className={cn(
                  "py-2.5 rounded-xl text-sm font-medium transition-all border",
                  form.size === s.value
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-border hover:border-primary",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-medium mb-1.5">Колір</p>
          <Popover
            open={openDropdown === "color"}
            onOpenChange={(o) => setOpenDropdown(o ? "color" : "")}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm text-left border-gray-border bg-gray-light"
              >
                <span>{form.color || "Оберіть колір"}</span>
                <IconChevronDown size={14} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-1">
              {colorOptions.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    setForm({ ...form, color: c.value });
                    setOpenDropdown("");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-light rounded-lg"
                >
                  <span
                    className="size-4 rounded-full border"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.value}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <p className="text-xs text-gray-medium mb-2">Здоров&apos;я</p>
          <div className="flex flex-wrap gap-3">
            {[
              { key: "vaccinated" as const, label: "Вакциновано", icon: "💉" },
              { key: "sterilized" as const, label: "Стерилізовано", icon: "✂️" },
              { key: "trained" as const, label: "Навчено", icon: "🎓" },
            ].map((c) => (
              <label
                key={c.key}
                className={cn(
                  "flex items-center gap-2.5 cursor-pointer px-4 py-2.5 rounded-xl border transition-all text-sm",
                  form[c.key]
                    ? "bg-primary/20 border-primary"
                    : "bg-white border-gray-border hover:border-primary",
                )}
              >
                <Checkbox
                  checked={form[c.key]}
                  onCheckedChange={(v) => setForm({ ...form, [c.key]: !!v })}
                />
                <span>
                  {c.icon} {c.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-medium uppercase tracking-wider mb-2">
            Контакти
          </p>
          <div className="space-y-2.5">
            <Input
              type="text"
              placeholder="Ім'я"
              value={form.contactName}
              onChange={(e) =>
                setForm({ ...form, contactName: e.target.value })
              }
            />
            <Input
              type="tel"
              placeholder="Телефон"
              value={form.contactPhone}
              onChange={(e) =>
                setForm({ ...form, contactPhone: e.target.value })
              }
            />
            <Input
              type="email"
              placeholder="Email"
              value={form.contactEmail}
              onChange={(e) =>
                setForm({ ...form, contactEmail: e.target.value })
              }
            />
            <Input
              type="text"
              placeholder="Місто / район"
              value={form.contactLocation}
              onChange={(e) =>
                setForm({ ...form, contactLocation: e.target.value })
              }
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
          className="w-full"
        >
          {submitting
            ? "Збереження..."
            : editId
              ? "Зберегти зміни"
              : "Додати тварину"}
        </Button>
      </form>
    </div>
  );
}
