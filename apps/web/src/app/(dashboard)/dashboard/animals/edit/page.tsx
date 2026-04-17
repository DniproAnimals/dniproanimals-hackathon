"use client";
import { cn } from "@/shared/lib/utils";
import {
  IconBan,
  IconBook,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconInfoCircle,
  IconMailFilled,
  IconMapPinFilled,
  IconPalette,
  IconPaw,
  IconPhoneFilled,
  IconPhoto,
  IconPlus,
  IconShieldCheck,
  IconTag,
  IconUser,
  IconWeight,
  IconX,
} from "@dniproanimals/icons";
import {
  Button,
  Checkbox,
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

const defaultCommands = [
  "Сидіти",
  "Лежати",
  "Дай лапу",
  "Голос",
  "Фу",
  "Поруч",
  "Апорт",
  "Чекай",
  "До мене",
  "Місце",
];

const dogBreeds = [
  "Німецька вівчарка",
  "Лабрадор",
  "Стаффордширський тер'єр",
  "Хаскі",
  "Бігль",
  "Бульдог",
  "Такса",
  "Пудель",
  "Ротвейлер",
  "Доберман",
  "Чихуахуа",
  "Йоркширський тер'єр",
  "Шпіц",
  "Коргі",
  "Мопс",
  "Мікс",
];
const catBreeds = [
  "Європейська короткошерста",
  "Ангорська",
  "Персидська",
  "Сіамська",
  "Мейн-кун",
  "Британська короткошерста",
  "Сфінкс",
  "Бенгальська",
  "Шотландська висловуха",
  "Абісинська",
  "Мікс",
];

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
  {
    value: "Триколірний",
    color:
      "linear-gradient(135deg, #1a1a1a 33%, #c45e1a 33%, #c45e1a 66%, #fff 66%)",
  },
];

const ageOptions = [
  { value: "3", label: "Цуценя / Кошеня", sub: "0–6 міс." },
  { value: "9", label: "Молодий", sub: "6–12 міс." },
  { value: "18", label: "Підліток", sub: "1–2 роки" },
  { value: "48", label: "Дорослий", sub: "2–7 років" },
  { value: "96", label: "Старший", sub: "7+ років" },
];

const weightOptions = [
  { value: "3", label: "Мініатюрний", sub: "до 5 кг" },
  { value: "7", label: "Малий", sub: "5–10 кг" },
  { value: "15", label: "Середній", sub: "10–20 кг" },
  { value: "28", label: "Великий", sub: "20–35 кг" },
  { value: "40", label: "Дуже великий", sub: "35+ кг" },
];

const fieldHints: Record<string, string> = {
  name: "Ім'я тварини, яке буде відображатися на сайті",
  description: "Опишіть характер, звички, особливості тварини",
  type: "Оберіть вид тварини — впливає на список порід",
  breed: "Оберіть зі списку або введіть свою",
  sex: "Стать тварини",
  age: "Приблизний вік — оберіть найближчий діапазон",
  weight: "Приблизна маса тварини",
  color: "Можна обрати декілька кольорів",
  health: "Медична інформація про тварину",
  photos: "Додайте фото тварини — перше стане головним",
  contacts: "Контакти для зв'язку щодо цієї тварини",
};

function InfoIcon({ field }: { field: string }) {
  const [show, setShow] = useState(false);
  const hint = fieldHints[field];
  if (!hint) return null;
  return (
    <span
      className="relative inline-flex ml-1.5"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <IconInfoCircle size={14} className="text-gray-medium cursor-help" />
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-white text-[11px] rounded-lg whitespace-nowrap shadow-lg z-30 animate-modal-in">
          {hint}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
        </span>
      )}
    </span>
  );
}

function Dropdown({
  label,
  field,
  open,
  setOpen,
  children,
  selectedText,
}: {
  label: string;
  field: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  children: React.ReactNode;
  selectedText: string;
}) {
  return (
    <div>
      <div className="flex items-center mb-1.5">
        <p className="text-xs text-gray-medium">{label}</p>
        <InfoIcon field={field} />
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
              open
                ? "border-primary bg-white"
                : selectedText
                  ? "border-primary bg-primary/5"
                  : "border-gray-border bg-gray-light hover:border-gray-medium",
            )}
          >
            <span
              className={
                selectedText
                  ? "text-foreground font-medium"
                  : "text-gray-medium"
              }
            >
              {selectedText || `Оберіть ${label.toLowerCase()}`}
            </span>
            <IconChevronDown
              size={14}
              className={cn(
                "text-gray-medium transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) p-1 max-h-60 overflow-auto"
        >
          {children}
        </PopoverContent>
      </Popover>
    </div>
  );
}

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
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [breedSearch, setBreedSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [commands, setCommands] = useState<string[]>([]);
  const [commandInput, setCommandInput] = useState("");
  const [visibleContacts, setVisibleContacts] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(!editId);
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "dog",
    breed: "",
    sex: "",
    age_months: "",
    weight_kg: "",
    size: "",
    color: "",
    vaccinated: false,
    sterilized: false,
    trained: false,
    photos: [] as string[],
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    contact_instagram: "",
    contact_telegram: "",
    contact_facebook: "",
    contact_location: "",
  });

  // Load animal data for editing
  useEffect(() => {
    if (!editId) return;
    fetch(`/api/animals/${editId}`)
      .then((r) => r.json())
      .then((a) => {
        const photos = JSON.parse(a.photos || "[]");
        const colors = a.color ? a.color.split(", ").filter(Boolean) : [];
        setSelectedColors(colors);
        const contacts: string[] = [];
        if (a.contact_email) contacts.push("email");
        if (a.contact_instagram) contacts.push("instagram");
        if (a.contact_telegram) contacts.push("telegram");
        if (a.contact_facebook) contacts.push("facebook");
        setVisibleContacts(contacts);
        setForm({
          name: a.name || "",
          description: a.description || "",
          type: a.type || "dog",
          breed: a.breed || "",
          sex: a.sex || "",
          age_months: a.age_months?.toString() || "",
          weight_kg: a.weight_kg?.toString() || "",
          size: a.size || "",
          color: a.color || "",
          vaccinated: !!a.vaccinated,
          sterilized: !!a.sterilized,
          trained: !!a.trained,
          photos,
          contact_name: a.contact_name || "",
          contact_phone: a.contact_phone || "",
          contact_email: a.contact_email || "",
          contact_instagram: a.contact_instagram || "",
          contact_telegram: a.contact_telegram || "",
          contact_facebook: a.contact_facebook || "",
          contact_location: a.contact_location || "",
        });
        setLoaded(true);
      });
  }, [editId]);

  const breeds = form.type === "cat" ? catBreeds : dogBreeds;
  const filteredBreeds = breedSearch
    ? breeds.filter((b) => b.toLowerCase().includes(breedSearch.toLowerCase()))
    : breeds;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setForm((prev) => ({ ...prev, photos: [...prev.photos, url] }));
      }
    }
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

  const toggle = (key: string) =>
    setOpenDropdown(openDropdown === key ? "" : key);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const body = {
      ...form,
      age_months: form.age_months ? Number(form.age_months) : null,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      trained: commands.length > 0 ? 1 : 0,
      commands: JSON.stringify(commands),
    };
    const url = editId ? `/api/animals/${editId}` : "/api/animals";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const animal = await res.json();
      router.push(`/animals/${animal.id}`);
    }
    setSubmitting(false);
  };

  if (!loaded)
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <Skeleton className="size-10 rounded-full mx-auto" />
      </div>
    );

  const ageLbl = ageOptions.find((a) => a.value === form.age_months);
  const weightLbl = weightOptions.find((w) => w.value === form.weight_kg);

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

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {editId ? "Редагувати тварину" : "Додати тварину"}
        </h1>
        <Button
          type="button"
          variant={showPreview ? "primary" : "outline"}
          size="md"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? "Редагувати" : "Попередній перегляд"}
        </Button>
      </div>

      <div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photos */}
          <div>
            <div className="flex items-center mb-2">
              <p className="text-sm font-semibold text-gray-medium uppercase tracking-wider">
                Фотографії
              </p>
              <InfoIcon field="photos" />
            </div>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-border rounded-2xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <IconPhoto size={28} className="mx-auto text-gray-medium mb-2" />
              <p className="text-sm font-medium text-foreground">
                Натисніть або перетягніть
              </p>
              <p className="text-xs text-gray-medium">JPG, PNG до 5 МБ</p>
              {uploading && (
                <p className="text-xs text-primary mt-1">Завантаження...</p>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handlePhotoUpload}
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
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <div className="flex items-center mb-1.5">
              <p className="text-xs text-gray-medium">Ім&apos;я *</p>
              <InfoIcon field="name" />
            </div>
            <Input
              type="text"
              placeholder="Ім'я тварини"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center mb-1.5">
              <p className="text-xs text-gray-medium">Опис</p>
              <InfoIcon field="description" />
            </div>
            <Textarea
              placeholder="Характер, звички, особливості..."
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Type */}
          <div>
            <div className="flex items-center mb-1.5">
              <p className="text-xs text-gray-medium">Вид *</p>
              <InfoIcon field="type" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "dog", label: "Собака", icon: "🐕" },
                { value: "cat", label: "Кіт", icon: "🐈" },
                { value: "other", label: "Інше", icon: "🐾" },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, type: t.value, breed: "" })}
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

          {/* Breed */}
          <Dropdown
            label="Порода"
            field="breed"
            open={openDropdown === "breed"}
            setOpen={() => toggle("breed")}
            selectedText={form.breed}
          >
            <div className="p-2 border-b border-gray-border">
              <Input
                type="text"
                placeholder="Пошук породи..."
                value={breedSearch}
                onChange={(e) => setBreedSearch(e.target.value)}
                size="sm"
                autoFocus
              />
            </div>
            {filteredBreeds.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => {
                  setForm({ ...form, breed: b });
                  setBreedSearch("");
                  setOpenDropdown("");
                }}
                className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-light rounded-lg"
              >
                <span className={form.breed === b ? "font-medium" : ""}>
                  {b}
                </span>
                {form.breed === b && (
                  <IconCheck
                    size={14}
                    className="text-primary"
                    strokeWidth={3}
                  />
                )}
              </button>
            ))}
            {filteredBreeds.length === 0 && (
              <p className="px-4 py-2 text-xs text-gray-medium">Не знайдено</p>
            )}
          </Dropdown>

          {/* Sex */}
          <div>
            <div className="flex items-center mb-1.5">
              <p className="text-xs text-gray-medium">Стать</p>
              <InfoIcon field="sex" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "male", label: "Хлопчик", icon: "♂️" },
                { value: "female", label: "Дівчинка", icon: "♀️" },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm({ ...form, sex: s.value })}
                  className={cn(
                    "py-2.5 rounded-xl text-sm font-medium transition-all border",
                    form.sex === s.value
                      ? "bg-primary border-primary"
                      : "bg-white border-gray-border hover:border-primary",
                  )}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <Dropdown
            label="Вік"
            field="age"
            open={openDropdown === "age"}
            setOpen={() => toggle("age")}
            selectedText={ageLbl ? `${ageLbl.label} (${ageLbl.sub})` : ""}
          >
            {ageOptions.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => {
                  setForm({ ...form, age_months: a.value });
                  setOpenDropdown("");
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-light rounded-lg"
              >
                <span>
                  <span
                    className={form.age_months === a.value ? "font-medium" : ""}
                  >
                    {a.label}
                  </span>{" "}
                  <span className="text-xs text-gray-medium">({a.sub})</span>
                </span>
                {form.age_months === a.value && (
                  <IconCheck
                    size={14}
                    className="text-primary"
                    strokeWidth={3}
                  />
                )}
              </button>
            ))}
          </Dropdown>

          {/* Weight */}
          <Dropdown
            label="Маса"
            field="weight"
            open={openDropdown === "weight"}
            setOpen={() => toggle("weight")}
            selectedText={
              weightLbl ? `${weightLbl.label} (${weightLbl.sub})` : ""
            }
          >
            {weightOptions.map((w) => (
              <button
                key={w.value}
                type="button"
                onClick={() => {
                  setForm({ ...form, weight_kg: w.value });
                  setOpenDropdown("");
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-light rounded-lg"
              >
                <span>
                  <span
                    className={form.weight_kg === w.value ? "font-medium" : ""}
                  >
                    {w.label}
                  </span>{" "}
                  <span className="text-xs text-gray-medium">({w.sub})</span>
                </span>
                {form.weight_kg === w.value && (
                  <IconCheck
                    size={14}
                    className="text-primary"
                    strokeWidth={3}
                  />
                )}
              </button>
            ))}
          </Dropdown>

          {/* Color */}
          <Dropdown
            label="Колір"
            field="color"
            open={openDropdown === "color"}
            setOpen={() => toggle("color")}
            selectedText={
              selectedColors.length > 0 ? selectedColors.join(", ") : ""
            }
          >
            {colorOptions.map((c) => {
              const sel = selectedColors.includes(c.value);
              const isGradient = c.color.includes("gradient");
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => toggleColor(c.value)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-light rounded-lg"
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className="size-5 rounded-full border border-gray-border shrink-0"
                      style={
                        isGradient
                          ? { background: c.color }
                          : { backgroundColor: c.color }
                      }
                    />
                    <span className={sel ? "font-medium" : ""}>{c.value}</span>
                  </span>
                  {sel && (
                    <IconCheck
                      size={14}
                      className="text-primary"
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </Dropdown>

          {/* Health checkboxes */}
          <div>
            <div className="flex items-center mb-2">
              <p className="text-xs text-gray-medium">Здоров&apos;я</p>
              <InfoIcon field="health" />
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                {
                  key: "vaccinated" as const,
                  label: "Вакциновано",
                  icon: "💉",
                },
                {
                  key: "sterilized" as const,
                  label: "Стерилізовано",
                  icon: "✂️",
                },
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

          {/* Commands — dropdown multi-select */}
          <div>
            <div className="flex items-center mb-1.5">
              <p className="text-xs text-gray-medium">Навчені команди</p>
              <InfoIcon field="name" />
            </div>
            <Popover
              open={openDropdown === "commands"}
              onOpenChange={(o) => setOpenDropdown(o ? "commands" : "")}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                    openDropdown === "commands"
                      ? "border-primary bg-white"
                      : commands.length > 0
                        ? "border-primary bg-primary/5"
                        : "border-gray-border bg-gray-light hover:border-gray-medium",
                  )}
                >
                  {commands.length > 0 ? (
                    <span className="flex flex-wrap gap-1">
                      {commands.map((cmd) => (
                        <span
                          key={cmd}
                          className="flex items-center gap-1 bg-primary/30 text-foreground text-xs font-medium px-2 py-0.5 rounded-full"
                        >
                          {cmd}
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setCommands(commands.filter((c) => c !== cmd));
                            }}
                            className="text-gray-medium hover:text-foreground cursor-pointer"
                          >
                            <IconX size={10} />
                          </span>
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="text-gray-medium">Оберіть команди</span>
                  )}
                  <IconChevronDown
                    size={14}
                    className={cn(
                      "text-gray-medium transition-transform shrink-0 ml-2",
                      openDropdown === "commands" && "rotate-180",
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-(--radix-popover-trigger-width) p-1 max-h-60 overflow-auto"
              >
                <div className="p-2 border-b border-gray-border">
                  <Input
                    type="text"
                    placeholder="Пошук або нова команда..."
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    size="sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && commandInput.trim()) {
                        e.preventDefault();
                        if (!commands.includes(commandInput.trim()))
                          setCommands([...commands, commandInput.trim()]);
                        setCommandInput("");
                      }
                    }}
                    autoFocus
                  />
                </div>
                {defaultCommands
                  .filter(
                    (c) =>
                      !commandInput ||
                      c.toLowerCase().includes(commandInput.toLowerCase()),
                  )
                  .map((cmd) => {
                    const sel = commands.includes(cmd);
                    return (
                      <button
                        key={cmd}
                        type="button"
                        onClick={() => {
                          if (sel) {
                            setCommands(commands.filter((c) => c !== cmd));
                          } else {
                            setCommands([...commands, cmd]);
                          }
                        }}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-light rounded-lg"
                      >
                        <span className={sel ? "font-medium" : ""}>{cmd}</span>
                        {sel && (
                          <IconCheck
                            size={14}
                            className="text-primary"
                            strokeWidth={3}
                          />
                        )}
                      </button>
                    );
                  })}
                {commandInput.trim() &&
                  !defaultCommands.some(
                    (c) =>
                      c.toLowerCase() === commandInput.trim().toLowerCase(),
                  ) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!commands.includes(commandInput.trim()))
                          setCommands([...commands, commandInput.trim()]);
                        setCommandInput("");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-gray-light font-medium rounded-lg"
                    >
                      <IconPlus size={14} />
                      Додати &quot;{commandInput.trim()}&quot;
                    </button>
                  )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Contacts */}
          <div>
            <div className="flex items-center mb-2">
              <p className="text-sm font-semibold text-gray-medium uppercase tracking-wider">
                Контакти
              </p>
              <InfoIcon field="contacts" />
            </div>
            <div className="space-y-2.5">
              <div className="relative">
                <IconUser
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-medium z-10 pointer-events-none"
                />
                <Input
                  type="text"
                  placeholder="Ім'я"
                  value={form.contact_name}
                  onChange={(e) =>
                    setForm({ ...form, contact_name: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <IconPhoneFilled
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-medium z-10 pointer-events-none"
                />
                <Input
                  type="tel"
                  placeholder="Телефон"
                  value={form.contact_phone}
                  onChange={(e) =>
                    setForm({ ...form, contact_phone: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <IconMapPinFilled
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-medium z-10 pointer-events-none"
                />
                <Input
                  type="text"
                  placeholder="Місто / район"
                  value={form.contact_location}
                  onChange={(e) =>
                    setForm({ ...form, contact_location: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
              {visibleContacts.map((type) => {
                const icons: Record<string, React.ReactNode> = {
                  email: <IconMailFilled size={16} />,
                  instagram: <IconBrandInstagram size={16} />,
                  telegram: <IconBrandTelegram size={16} />,
                  facebook: <IconBrandFacebook size={16} />,
                };
                const placeholders: Record<string, string> = {
                  email: "Email",
                  instagram: "Instagram",
                  telegram: "Telegram",
                  facebook: "Facebook",
                };
                const key = `contact_${type}` as keyof typeof form;
                return (
                  <div key={type} className="relative animate-modal-in">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-medium z-10 pointer-events-none">
                      {icons[type]}
                    </span>
                    <Input
                      type={type === "email" ? "email" : "text"}
                      placeholder={placeholders[type]}
                      value={form[key] as string}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      className="pl-10 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleContacts(
                          visibleContacts.filter((c) => c !== type),
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-foreground"
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                );
              })}
              {visibleContacts.length < 4 && (
                <button
                  type="button"
                  onClick={() => {
                    const opts = [
                      "email",
                      "instagram",
                      "telegram",
                      "facebook",
                    ].filter((o) => !visibleContacts.includes(o));
                    if (opts.length > 0)
                      setVisibleContacts([...visibleContacts, opts[0]]);
                  }}
                  className="flex items-center gap-1.5 text-[13px] text-gray-medium hover:text-foreground transition-colors py-1"
                >
                  <IconPlus size={14} />
                  Додати спосіб зв&apos;язку
                </button>
              )}
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

      {/* Preview — exact animal page replica */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          {/* Sticky action bar */}
          <div className="sticky top-0 z-10 bg-primary border-b border-green-dark">
            <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground/70">
                  Попередній перегляд
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                  className="bg-white/50 hover:bg-white/80 text-xs"
                >
                  ← Повернутися до редагування
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={async () => {
                    setSubmitting(true);
                    const body = {
                      ...form,
                      age_months: form.age_months
                        ? Number(form.age_months)
                        : null,
                      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
                      trained: commands.length > 0 ? 1 : 0,
                      commands: JSON.stringify(commands),
                    };
                    const url = editId
                      ? `/api/animals/${editId}`
                      : "/api/animals";
                    const method = editId ? "PUT" : "POST";
                    const res = await fetch(url, {
                      method,
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(body),
                    });
                    if (res.ok) {
                      const animal = await res.json();
                      router.push(`/animals/${animal.id}`);
                    }
                    setSubmitting(false);
                  }}
                  disabled={submitting || !form.name}
                  className="text-xs"
                >
                  {submitting
                    ? "..."
                    : editId
                      ? "Зберегти та опублікувати"
                      : "Додати та опублікувати"}
                </Button>
              </div>
            </div>
          </div>

          {/* Header */}
          <header className="bg-white border-b border-gray-border">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
              <Image
                src="/logo.jpg"
                alt="DniproAnimals"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="text-xl font-bold text-foreground tracking-tight ml-3">
                DniproAnimals
              </span>
            </div>
          </header>

          {/* Page content — same as /animals/[id] */}
          <div className="max-w-6xl mx-auto px-6 py-6 pb-10">
            <p className="flex items-center gap-2 text-gray-medium text-sm mb-5">
              <IconChevronLeft size={18} />
              Назад
            </p>

            <div className="md:grid md:grid-cols-2 md:gap-10">
              {/* Photos */}
              <div>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-light">
                  {form.photos[0] ? (
                    <Image
                      src={form.photos[0]}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-medium">
                      {form.type === "dog"
                        ? "🐕"
                        : form.type === "cat"
                          ? "🐈"
                          : "🐾"}
                    </div>
                  )}
                  {form.photos.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[11px] px-2 py-0.5 rounded-full">
                      {form.photos.length} фото
                    </div>
                  )}
                </div>
                {form.photos.length > 1 && (
                  <div className="flex gap-2 mt-3">
                    {form.photos.map((u, i) => (
                      <div
                        key={i}
                        className={cn(
                          "relative size-16 rounded-xl overflow-hidden border-2",
                          i === 0
                            ? "border-primary"
                            : "border-transparent opacity-60",
                        )}
                      >
                        <Image
                          src={u}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {form.description && (
                  <div className="mt-5">
                    <h2 className="text-sm font-semibold mb-2">Інформація</h2>
                    <p className="text-sm text-foreground leading-relaxed">
                      {form.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="mt-6 md:mt-0">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {form.name || "Ім'я"}
                    </h1>
                    {form.sex && (
                      <span
                        className={cn(
                          "text-xl",
                          form.sex === "male"
                            ? "text-blue-400"
                            : "text-pink-400",
                        )}
                      >
                        {form.sex === "male" ? "♂" : "♀"}
                      </span>
                    )}
                  </div>
                  <span className="bg-primary text-foreground px-5 py-2 rounded-xl font-semibold text-sm">
                    Забрати додому
                  </span>
                </div>
                <p className="text-sm text-gray-medium mb-5">
                  {form.breed || "Мікс порід"}
                </p>

                <div className="divide-y divide-gray-border mb-6">
                  {[
                    {
                      icon: <IconPaw size={16} />,
                      label: "Вид",
                      value:
                        form.type === "dog"
                          ? "Собака"
                          : form.type === "cat"
                            ? "Кіт"
                            : "Інше",
                    },
                    form.breed
                      ? {
                          icon: <IconTag size={16} />,
                          label: "Порода",
                          value: form.breed,
                        }
                      : null,
                    form.sex
                      ? {
                          icon: <IconUser size={16} />,
                          label: "Стать",
                          value: form.sex === "male" ? "Хлопчик" : "Дівчинка",
                        }
                      : null,
                    ageLbl
                      ? {
                          icon: <IconCalendar size={16} />,
                          label: "Вік",
                          value: `${ageLbl.label} (${ageLbl.sub})`,
                        }
                      : null,
                    weightLbl
                      ? {
                          icon: <IconWeight size={16} />,
                          label: "Маса",
                          value: weightLbl.sub,
                        }
                      : null,
                    {
                      icon: <IconShieldCheck size={16} />,
                      label: "Вакцинація",
                      value: form.vaccinated ? "Так" : "Ні",
                    },
                    {
                      icon: <IconBan size={16} />,
                      label: "Стерилізація",
                      value: form.sterilized ? "Так" : "Ні",
                    },
                  ]
                    .filter(Boolean)
                    .map(
                      (row) =>
                        row && (
                          <div
                            key={row.label}
                            className="flex items-center gap-2.5 py-3"
                          >
                            <span className="text-gray-medium shrink-0">
                              {row.icon}
                            </span>
                            <span className="text-sm font-medium">
                              {row.label}
                            </span>
                            <span className="text-sm text-gray-medium ml-auto">
                              {row.value}
                            </span>
                          </div>
                        ),
                    )}
                  {selectedColors.length > 0 && (
                    <div className="flex items-center gap-2.5 py-3">
                      <IconPalette
                        size={16}
                        className="text-gray-medium shrink-0"
                      />
                      <span className="text-sm font-medium">Колір</span>
                      <span className="flex items-center gap-1.5 ml-auto">
                        {selectedColors.map((c) => {
                          const o = colorOptions.find((x) => x.value === c);
                          return (
                            <span
                              key={c}
                              className="flex items-center gap-1 text-sm text-gray-medium"
                            >
                              <span
                                className="size-4 rounded-full border border-gray-border"
                                style={{ background: o?.color || "#ccc" }}
                              />
                              {c}
                            </span>
                          );
                        })}
                      </span>
                    </div>
                  )}
                  {commands.length > 0 && (
                    <div className="flex items-center gap-2.5 py-3">
                      <IconBook
                        size={16}
                        className="text-gray-medium shrink-0"
                      />
                      <span className="text-sm font-medium">Навчено</span>
                      <span className="text-sm text-gray-medium ml-auto">
                        {commands.join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                {(form.contact_name || form.contact_phone) && (
                  <div>
                    <h2 className="text-sm font-semibold mb-3">Контакти</h2>
                    <div className="space-y-2.5 text-sm">
                      {form.contact_name && (
                        <div className="flex items-center gap-2.5">
                          <IconUser size={16} className="text-gray-medium" />
                          <span className="font-medium">
                            {form.contact_name}
                          </span>
                        </div>
                      )}
                      {form.contact_phone && (
                        <div className="flex items-center gap-2.5">
                          <IconPhoneFilled
                            size={16}
                            className="text-gray-medium"
                          />
                          <span>{form.contact_phone}</span>
                        </div>
                      )}
                      {form.contact_location && (
                        <div className="flex items-center gap-2.5">
                          <IconMapPinFilled
                            size={16}
                            className="text-gray-medium"
                          />
                          <span>{form.contact_location}</span>
                        </div>
                      )}
                      {form.contact_instagram && (
                        <div className="flex items-center gap-2.5">
                          <IconBrandInstagram
                            size={16}
                            className="text-gray-medium"
                          />
                          <span>@{form.contact_instagram}</span>
                        </div>
                      )}
                      {form.contact_telegram && (
                        <div className="flex items-center gap-2.5">
                          <IconBrandTelegram
                            size={16}
                            className="text-gray-medium"
                          />
                          <span>@{form.contact_telegram}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-primary mt-16">
            <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-foreground/50">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.jpg"
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
                <span className="font-bold text-foreground/70">
                  DniproAnimals
                </span>
              </div>
              <span>
                &copy; {new Date().getFullYear()} · м. Дніпро, Україна
              </span>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
