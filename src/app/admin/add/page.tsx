"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const defaultCommands = ["Сидіти", "Лежати", "Дай лапу", "Голос", "Фу", "Поруч", "Апорт", "Чекай", "До мене", "Місце"];

const dogBreeds = ["Німецька вівчарка", "Лабрадор", "Стаффордширський тер'єр", "Хаскі", "Бігль", "Бульдог", "Такса", "Пудель", "Ротвейлер", "Доберман", "Чихуахуа", "Йоркширський тер'єр", "Шпіц", "Коргі", "Мопс", "Мікс"];
const catBreeds = ["Європейська короткошерста", "Ангорська", "Персидська", "Сіамська", "Мейн-кун", "Британська короткошерста", "Сфінкс", "Бенгальська", "Шотландська висловуха", "Абісинська", "Мікс"];

const colorOptions = [
  { value: "Білий", color: "#ffffff" },
  { value: "Чорний", color: "#1a1a1a" },
  { value: "Сірий", color: "#9e9e9e" },
  { value: "Рудий", color: "#c45e1a" },
  { value: "Коричневий", color: "#6d4c2e" },
  { value: "Золотистий", color: "#d4a017" },
  { value: "Кремовий", color: "#f5deb3" },
  { value: "Тигровий", color: "#8B6914" },
  { value: "Чорно-білий", color: "linear-gradient(135deg, #1a1a1a 50%, #fff 50%)" },
  { value: "Триколірний", color: "linear-gradient(135deg, #1a1a1a 33%, #c45e1a 33%, #c45e1a 66%, #fff 66%)" },
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
    <span className="relative inline-flex ml-1.5" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 cursor-help"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-white text-[11px] rounded-lg whitespace-nowrap shadow-lg z-30 animate-modal-in">
          {hint}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
        </span>
      )}
    </span>
  );
}

function Dropdown({ label, field, open, setOpen, children, selectedText }: {
  label: string; field: string; open: boolean; setOpen: (v: boolean) => void; children: React.ReactNode; selectedText: string;
}) {
  return (
    <div className="relative">
      <div className="flex items-center mb-1.5">
        <p className="text-xs text-gray-medium">{label}</p>
        <InfoIcon field={field} />
      </div>
      <button type="button" onClick={() => setOpen(!open)} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm text-left transition-colors ${open ? "border-[#ced48c] ring-2 ring-[#ced48c]/30 bg-white" : selectedText ? "border-[#ced48c] bg-[#ced48c]/5" : "border-gray-border bg-gray-light hover:border-gray-400"}`}>
        <span className={selectedText ? "text-foreground font-medium" : "text-gray-medium"}>{selectedText || `Оберіть ${label.toLowerCase()}`}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-border shadow-lg z-30 py-1 max-h-60 overflow-auto animate-modal-in">
          {children}
        </div>
      )}
    </div>
  );
}

export default function AddAnimalPageWrapper() {
  return <Suspense fallback={<div className="max-w-2xl mx-auto px-6 py-20 text-center"><div className="w-10 h-10 rounded-full bg-gray-light animate-pulse mx-auto" /></div>}><AddAnimalPage /></Suspense>;
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
    name: "", description: "", type: "dog", breed: "", sex: "",
    age_months: "", weight_kg: "", size: "", color: "",
    vaccinated: false, sterilized: false, trained: false, photos: [] as string[],
    contact_name: "", contact_phone: "", contact_email: "", contact_instagram: "",
    contact_telegram: "", contact_facebook: "", contact_location: "",
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
          name: a.name || "", description: a.description || "", type: a.type || "dog",
          breed: a.breed || "", sex: a.sex || "", age_months: a.age_months?.toString() || "",
          weight_kg: a.weight_kg?.toString() || "", size: a.size || "", color: a.color || "",
          vaccinated: !!a.vaccinated, sterilized: !!a.sterilized, trained: !!a.trained, photos,
          contact_name: a.contact_name || "", contact_phone: a.contact_phone || "",
          contact_email: a.contact_email || "", contact_instagram: a.contact_instagram || "",
          contact_telegram: a.contact_telegram || "", contact_facebook: a.contact_facebook || "",
          contact_location: a.contact_location || "",
        });
        setLoaded(true);
      });
  }, [editId]);

  const breeds = form.type === "cat" ? catBreeds : dogBreeds;
  const filteredBreeds = breedSearch ? breeds.filter((b) => b.toLowerCase().includes(breedSearch.toLowerCase())) : breeds;

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
    const next = selectedColors.includes(value) ? selectedColors.filter((c) => c !== value) : [...selectedColors, value];
    setSelectedColors(next);
    setForm((prev) => ({ ...prev, color: next.join(", ") }));
  };

  const toggle = (key: string) => setOpenDropdown(openDropdown === key ? "" : key);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const body = { ...form, age_months: form.age_months ? Number(form.age_months) : null, weight_kg: form.weight_kg ? Number(form.weight_kg) : null, trained: commands.length > 0 ? 1 : 0, commands: JSON.stringify(commands) };
    const url = editId ? `/api/animals/${editId}` : "/api/animals";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) {
      const animal = await res.json();
      router.push(`/animals/${animal.id}`);
    }
    setSubmitting(false);
  };

  if (!loaded) return <div className="max-w-2xl mx-auto px-6 py-20 text-center"><div className="w-10 h-10 rounded-full bg-gray-light animate-pulse mx-auto" /></div>;

  const iconInput = "w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm";
  const ageLbl = ageOptions.find((a) => a.value === form.age_months);
  const weightLbl = weightOptions.find((w) => w.value === form.weight_kg);

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-medium hover:text-foreground mb-5 transition-colors text-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        Назад
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{editId ? "Редагувати тварину" : "Додати тварину"}</h1>
        <button type="button" onClick={() => setShowPreview(!showPreview)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${showPreview ? "bg-[#ced48c] border-[#b8be72] text-foreground" : "border-gray-border text-gray-medium hover:border-[#ced48c]"}`}>
          {showPreview ? "Редагувати" : "Попередній перегляд"}
        </button>
      </div>

      <div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Photos */}
          <div>
            <div className="flex items-center mb-2">
              <p className="text-sm font-semibold text-gray-medium uppercase tracking-wider">Фотографії</p>
              <InfoIcon field="photos" />
            </div>
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-border rounded-2xl p-6 text-center cursor-pointer hover:border-[#ced48c] hover:bg-[#ced48c]/5 transition-colors">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <p className="text-sm font-medium text-foreground">Натисніть або перетягніть</p>
              <p className="text-xs text-gray-medium">JPG, PNG до 5 МБ</p>
              {uploading && <p className="text-xs text-[#ced48c] mt-1">Завантаження...</p>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
            {form.photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.photos.map((url, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                    <Image src={url} alt="" fill className="object-cover" sizes="64px" />
                    <button type="button" onClick={() => setForm({ ...form, photos: form.photos.filter((_, j) => j !== i) })} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
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
            <input type="text" placeholder="Ім'я тварини" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center mb-1.5">
              <p className="text-xs text-gray-medium">Опис</p>
              <InfoIcon field="description" />
            </div>
            <textarea placeholder="Характер, звички, особливості..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm resize-none" />
          </div>

          {/* Type */}
          <div>
            <div className="flex items-center mb-1.5">
              <p className="text-xs text-gray-medium">Вид *</p>
              <InfoIcon field="type" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[{ value: "dog", label: "Собака", icon: "🐕" }, { value: "cat", label: "Кіт", icon: "🐈" }, { value: "other", label: "Інше", icon: "🐾" }].map((t) => (
                <button key={t.value} type="button" onClick={() => setForm({ ...form, type: t.value, breed: "" })} className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${form.type === t.value ? "bg-[#ced48c] border-[#b8be72]" : "bg-white border-gray-border hover:border-[#ced48c]"}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Breed */}
          <Dropdown label="Порода" field="breed" open={openDropdown === "breed"} setOpen={() => toggle("breed")} selectedText={form.breed}>
            <div className="p-2 border-b border-gray-border">
              <input type="text" placeholder="Пошук породи..." value={breedSearch} onChange={(e) => setBreedSearch(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-light border-none outline-none text-sm" autoFocus />
            </div>
            {filteredBreeds.map((b) => (
              <button key={b} type="button" onClick={() => { setForm({ ...form, breed: b }); setBreedSearch(""); setOpenDropdown(""); }} className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-light">
                <span className={form.breed === b ? "font-medium" : ""}>{b}</span>
                {form.breed === b && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ced48c" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            ))}
            {filteredBreeds.length === 0 && <p className="px-4 py-2 text-xs text-gray-medium">Не знайдено</p>}
          </Dropdown>

          {/* Sex */}
          <div>
            <div className="flex items-center mb-1.5">
              <p className="text-xs text-gray-medium">Стать</p>
              <InfoIcon field="sex" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[{ value: "male", label: "Хлопчик", icon: "♂️" }, { value: "female", label: "Дівчинка", icon: "♀️" }].map((s) => (
                <button key={s.value} type="button" onClick={() => setForm({ ...form, sex: s.value })} className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${form.sex === s.value ? "bg-[#ced48c] border-[#b8be72]" : "bg-white border-gray-border hover:border-[#ced48c]"}`}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <Dropdown label="Вік" field="age" open={openDropdown === "age"} setOpen={() => toggle("age")} selectedText={ageLbl ? `${ageLbl.label} (${ageLbl.sub})` : ""}>
            {ageOptions.map((a) => (
              <button key={a.value} type="button" onClick={() => { setForm({ ...form, age_months: a.value }); setOpenDropdown(""); }} className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-light">
                <span><span className={form.age_months === a.value ? "font-medium" : ""}>{a.label}</span> <span className="text-xs text-gray-medium">({a.sub})</span></span>
                {form.age_months === a.value && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ced48c" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            ))}
          </Dropdown>

          {/* Weight */}
          <Dropdown label="Маса" field="weight" open={openDropdown === "weight"} setOpen={() => toggle("weight")} selectedText={weightLbl ? `${weightLbl.label} (${weightLbl.sub})` : ""}>
            {weightOptions.map((w) => (
              <button key={w.value} type="button" onClick={() => { setForm({ ...form, weight_kg: w.value }); setOpenDropdown(""); }} className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-light">
                <span><span className={form.weight_kg === w.value ? "font-medium" : ""}>{w.label}</span> <span className="text-xs text-gray-medium">({w.sub})</span></span>
                {form.weight_kg === w.value && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ced48c" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            ))}
          </Dropdown>

          {/* Color */}
          <Dropdown label="Колір" field="color" open={openDropdown === "color"} setOpen={() => toggle("color")} selectedText={selectedColors.length > 0 ? selectedColors.join(", ") : ""}>
            {colorOptions.map((c) => {
              const sel = selectedColors.includes(c.value);
              const isGradient = c.color.includes("gradient");
              return (
                <button key={c.value} type="button" onClick={() => toggleColor(c.value)} className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-light">
                  <span className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full border border-gray-border flex-shrink-0" style={isGradient ? { background: c.color } : { backgroundColor: c.color }} />
                    <span className={sel ? "font-medium" : ""}>{c.value}</span>
                  </span>
                  {sel && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ced48c" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
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
                { key: "vaccinated" as const, label: "Вакциновано", icon: "💉" },
                { key: "sterilized" as const, label: "Стерилізовано", icon: "✂️" },
              ].map((c) => (
                <label key={c.key} className={`flex items-center gap-2.5 cursor-pointer px-4 py-2.5 rounded-xl border transition-all text-sm ${form[c.key] ? "bg-[#ced48c]/20 border-[#ced48c]" : "bg-white border-gray-border hover:border-[#ced48c]"}`}>
                  <span className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${form[c.key] ? "bg-[#ced48c] border-[#b8be72]" : "border-gray-300 bg-white"}`}>
                    {form[c.key] && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </span>
                  <input type="checkbox" checked={form[c.key]} onChange={(e) => setForm({ ...form, [c.key]: e.target.checked })} className="hidden" />
                  {c.icon} {c.label}
                </label>
              ))}
            </div>
          </div>

          {/* Commands — dropdown multi-select */}
          <div className="relative">
            <div className="flex items-center mb-1.5">
              <p className="text-xs text-gray-medium">Навчені команди</p>
              <InfoIcon field="name" />
            </div>
            <button type="button" onClick={() => toggle("commands")} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm text-left transition-colors ${openDropdown === "commands" ? "border-[#ced48c] ring-2 ring-[#ced48c]/30 bg-white" : commands.length > 0 ? "border-[#ced48c] bg-[#ced48c]/5" : "border-gray-border bg-gray-light hover:border-gray-400"}`}>
              {commands.length > 0 ? (
                <span className="flex flex-wrap gap-1">
                  {commands.map((cmd) => (
                    <span key={cmd} className="flex items-center gap-1 bg-[#ced48c]/30 text-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                      {cmd}
                      <span onClick={(e) => { e.stopPropagation(); setCommands(commands.filter((c) => c !== cmd)); }} className="text-gray-400 hover:text-foreground cursor-pointer">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </span>
                    </span>
                  ))}
                </span>
              ) : (
                <span className="text-gray-medium">Оберіть команди</span>
              )}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`text-gray-400 transition-transform flex-shrink-0 ml-2 ${openDropdown === "commands" ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {openDropdown === "commands" && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-border shadow-lg z-30 py-1 max-h-60 overflow-auto animate-modal-in">
                <div className="p-2 border-b border-gray-border">
                  <input
                    type="text"
                    placeholder="Пошук або нова команда..."
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && commandInput.trim()) {
                        e.preventDefault();
                        if (!commands.includes(commandInput.trim())) setCommands([...commands, commandInput.trim()]);
                        setCommandInput("");
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-gray-light border-none outline-none text-sm"
                    autoFocus
                  />
                </div>
                {defaultCommands.filter((c) => !commandInput || c.toLowerCase().includes(commandInput.toLowerCase())).map((cmd) => {
                  const sel = commands.includes(cmd);
                  return (
                    <button key={cmd} type="button" onClick={() => { if (sel) { setCommands(commands.filter((c) => c !== cmd)); } else { setCommands([...commands, cmd]); } }} className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-light">
                      <span className={sel ? "font-medium" : ""}>{cmd}</span>
                      {sel && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ced48c" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                  );
                })}
                {commandInput.trim() && !defaultCommands.some((c) => c.toLowerCase() === commandInput.trim().toLowerCase()) && (
                  <button type="button" onClick={() => { if (!commands.includes(commandInput.trim())) setCommands([...commands, commandInput.trim()]); setCommandInput(""); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#ced48c] hover:bg-gray-light font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                    Додати &quot;{commandInput.trim()}&quot;
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Contacts */}
          <div>
            <div className="flex items-center mb-2">
              <p className="text-sm font-semibold text-gray-medium uppercase tracking-wider">Контакти</p>
              <InfoIcon field="contacts" />
            </div>
            <div className="space-y-2.5">
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" placeholder="Ім'я" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} className={iconInput} />
              </div>
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                <input type="tel" placeholder="Телефон" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className={iconInput} />
              </div>
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <input type="text" placeholder="Місто / район" value={form.contact_location} onChange={(e) => setForm({ ...form, contact_location: e.target.value })} className={iconInput} />
              </div>
              {visibleContacts.map((type) => (
                <div key={type} className="relative animate-modal-in">
                  {type === "email" && <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><input type="email" placeholder="Email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className={`${iconInput} pr-9`} /></>}
                  {type === "instagram" && <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg><input type="text" placeholder="Instagram" value={form.contact_instagram} onChange={(e) => setForm({ ...form, contact_instagram: e.target.value })} className={`${iconInput} pr-9`} /></>}
                  {type === "telegram" && <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg><input type="text" placeholder="Telegram" value={form.contact_telegram} onChange={(e) => setForm({ ...form, contact_telegram: e.target.value })} className={`${iconInput} pr-9`} /></>}
                  {type === "facebook" && <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg><input type="text" placeholder="Facebook" value={form.contact_facebook} onChange={(e) => setForm({ ...form, contact_facebook: e.target.value })} className={`${iconInput} pr-9`} /></>}
                  <button type="button" onClick={() => setVisibleContacts(visibleContacts.filter((c) => c !== type))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
              ))}
              {visibleContacts.length < 4 && (
                <button type="button" onClick={() => {
                  const opts = ["email", "instagram", "telegram", "facebook"].filter((o) => !visibleContacts.includes(o));
                  if (opts.length > 0) setVisibleContacts([...visibleContacts, opts[0]]);
                }} className="flex items-center gap-1.5 text-[13px] text-gray-medium hover:text-foreground transition-colors py-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  Додати спосіб зв&apos;язку
                </button>
              )}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full bg-[#ced48c] text-foreground py-3.5 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50 text-base">
            {submitting ? "Збереження..." : editId ? "Зберегти зміни" : "Додати тварину"}
          </button>
        </form>

      </div>

      {/* Preview — exact animal page replica */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          {/* Sticky action bar */}
          <div className="sticky top-0 z-10 bg-[#ced48c] border-b border-[#b8be72]">
            <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground/70">Попередній перегляд</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setShowPreview(false)} className="px-4 py-1.5 rounded-lg bg-white/50 text-foreground text-xs font-medium hover:bg-white/80 transition-colors">
                  ← Повернутися до редагування
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setSubmitting(true);
                    const body = { ...form, age_months: form.age_months ? Number(form.age_months) : null, weight_kg: form.weight_kg ? Number(form.weight_kg) : null, trained: commands.length > 0 ? 1 : 0, commands: JSON.stringify(commands) };
                    const url = editId ? `/api/animals/${editId}` : "/api/animals";
                    const method = editId ? "PUT" : "POST";
                    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                    if (res.ok) { const animal = await res.json(); router.push(`/animals/${animal.id}`); }
                    setSubmitting(false);
                  }}
                  disabled={submitting || !form.name}
                  className="px-4 py-1.5 rounded-lg bg-foreground text-white text-xs font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-50"
                >
                  {submitting ? "..." : editId ? "Зберегти та опублікувати" : "Додати та опублікувати"}
                </button>
              </div>
            </div>
          </div>

          {/* Header */}
          <header className="bg-white border-b border-gray-border">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
              <Image src="/logo.jpg" alt="DniproAnimals" width={40} height={40} className="rounded-full object-cover" />
              <span className="text-xl font-bold text-foreground tracking-tight ml-3">DniproAnimals</span>
            </div>
          </header>

          {/* Page content — same as /animals/[id] */}
          <div className="max-w-6xl mx-auto px-6 py-6 pb-10">
            <p className="flex items-center gap-2 text-gray-medium text-sm mb-5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              Назад
            </p>

            <div className="md:grid md:grid-cols-2 md:gap-10">
              {/* Photos */}
              <div>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-light">
                  {form.photos[0] ? <Image src={form.photos[0]} alt="" fill className="object-cover" sizes="50vw" /> : <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">{form.type === "dog" ? "🐕" : form.type === "cat" ? "🐈" : "🐾"}</div>}
                  {form.photos.length > 1 && <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[11px] px-2 py-0.5 rounded-full">{form.photos.length} фото</div>}
                </div>
                {form.photos.length > 1 && <div className="flex gap-2 mt-3">{form.photos.map((u, i) => <div key={i} className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 ${i === 0 ? "border-[#ced48c]" : "border-transparent opacity-60"}`}><Image src={u} alt="" fill className="object-cover" sizes="64px" /></div>)}</div>}
                {form.description && <div className="mt-5"><h2 className="text-sm font-semibold mb-2">Інформація</h2><p className="text-sm text-gray-600 leading-relaxed">{form.description}</p></div>}
              </div>

              {/* Info */}
              <div className="mt-6 md:mt-0">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl md:text-3xl font-bold">{form.name || "Ім'я"}</h1>
                    {form.sex && <span className={`text-xl ${form.sex === "male" ? "text-blue-400" : "text-pink-400"}`}>{form.sex === "male" ? "♂" : "♀"}</span>}
                  </div>
                  <span className="bg-[#ced48c] text-foreground px-5 py-2 rounded-xl font-semibold text-sm">Забрати додому</span>
                </div>
                <p className="text-sm text-gray-medium mb-5">{form.breed || "Мікс порід"}</p>

                <div className="divide-y divide-gray-border mb-6">
                  {[
                    { icon: <><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></>, label: "Вид", value: form.type === "dog" ? "Собака" : form.type === "cat" ? "Кіт" : "Інше" },
                    form.breed ? { icon: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>, label: "Порода", value: form.breed } : null,
                    form.sex ? { icon: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>, label: "Стать", value: form.sex === "male" ? "Хлопчик" : "Дівчинка" } : null,
                    ageLbl ? { icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>, label: "Вік", value: `${ageLbl.label} (${ageLbl.sub})` } : null,
                    weightLbl ? { icon: <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></>, label: "Маса", value: weightLbl.sub } : null,
                    { icon: <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>, label: "Вакцинація", value: form.vaccinated ? "Так" : "Ні" },
                    { icon: <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/></>, label: "Стерилізація", value: form.sterilized ? "Так" : "Ні" },
                  ].filter(Boolean).map((row) => row && (
                    <div key={row.label} className="flex items-center gap-2.5 py-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0">{row.icon}</svg>
                      <span className="text-sm font-medium">{row.label}</span>
                      <span className="text-sm text-gray-medium ml-auto">{row.value}</span>
                    </div>
                  ))}
                  {selectedColors.length > 0 && <div className="flex items-center gap-2.5 py-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20"/></svg>
                    <span className="text-sm font-medium">Колір</span>
                    <span className="flex items-center gap-1.5 ml-auto">{selectedColors.map((c) => { const o = colorOptions.find((x) => x.value === c); return <span key={c} className="flex items-center gap-1 text-sm text-gray-medium"><span className="w-4 h-4 rounded-full border border-gray-border" style={{ background: o?.color || "#ccc" }}/>{c}</span>; })}</span>
                  </div>}
                  {commands.length > 0 && <div className="flex items-center gap-2.5 py-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                    <span className="text-sm font-medium">Навчено</span>
                    <span className="text-sm text-gray-medium ml-auto">{commands.join(", ")}</span>
                  </div>}
                </div>

                {(form.contact_name || form.contact_phone) && (
                  <div>
                    <h2 className="text-sm font-semibold mb-3">Контакти</h2>
                    <div className="space-y-2.5 text-sm">
                      {form.contact_name && <div className="flex items-center gap-2.5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span className="font-medium">{form.contact_name}</span></div>}
                      {form.contact_phone && <div className="flex items-center gap-2.5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span>{form.contact_phone}</span></div>}
                      {form.contact_location && <div className="flex items-center gap-2.5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg><span>{form.contact_location}</span></div>}
                      {form.contact_instagram && <div className="flex items-center gap-2.5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg><span>@{form.contact_instagram}</span></div>}
                      {form.contact_telegram && <div className="flex items-center gap-2.5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg><span>@{form.contact_telegram}</span></div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-[#ced48c] mt-16">
            <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-foreground/50">
              <div className="flex items-center gap-3">
                <Image src="/logo.jpg" alt="" width={28} height={28} className="rounded-full object-cover" />
                <span className="font-bold text-foreground/70">DniproAnimals</span>
              </div>
              <span>&copy; {new Date().getFullYear()} · м. Дніпро, Україна</span>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
