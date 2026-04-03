"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import ImageFallback from "@/components/ImageFallback";
import { IconX, IconPhoto, IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
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
  { value: "Чорно-білий", color: "linear-gradient(135deg, #1a1a1a 50%, #fff 50%)" },
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
    const next = selectedColors.includes(value) ? selectedColors.filter((c) => c !== value) : [...selectedColors, value];
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
  const statusColor = (s: string) =>
    s === "available"
      ? "bg-green-100 text-green-700"
      : s === "adopted"
        ? "bg-blue-100 text-blue-700"
        : "bg-yellow-100 text-yellow-700";
  const sexLabel = (s: string | null) =>
    s === "male" ? "Хлопчик" : s === "female" ? "Дівчинка" : "";

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm";
  const selectClass = `${inputClass} appearance-none`;

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
        <Link href="/dashboard/animals/edit" className="px-4 py-2 rounded-xl text-sm font-medium bg-[#ced48c] text-foreground hover:bg-[#b8be72] transition-colors">
          Додати тварину
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Пошук..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#ced48c]/30 w-56"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none"
        >
          <option value="">Усі види</option>
          <option value="dog">Собаки</option>
          <option value="cat">Коти</option>
          <option value="other">Інше</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none"
        >
          <option value="">Усі статуси</option>
          <option value="available">Шукає дім</option>
          <option value="reserved">Заброньовано</option>
          <option value="adopted">Усиновлено</option>
        </select>
        <span className="text-xs text-gray-400">{animals.length} тварин</span>
      </div>

      {/* Table */}
      {animals.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
          Немає тварин
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
                <th className="px-4 py-3">Тварина</th>
                <th className="px-4 py-3 hidden sm:table-cell">Вид</th>
                <th className="px-4 py-3 hidden md:table-cell">Стать</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3 text-right">Дії</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((a) => {
                const photo = getPhoto(a.photos);
                return (
                  <Link
                    href={`/animals/${a.id}`}
                    key={a.id}
                    className="border-b table-row border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {photo ? (
                          <ImageFallback
                            src={photo}
                            alt={a.name}
                            width={36}
                            height={36}
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                            {a.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {a.name}
                          </p>
                          {a.breed && (
                            <p className="text-xs text-gray-400">{a.breed}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500">
                      {typeLabel(a.type)}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                      {sexLabel(a.sex)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(a.status)}`}
                      >
                        {statusLabel(a.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/dashboard/animals/edit?edit=${a.id}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          Редагувати
                        </Link>
                        <button
                          onClick={(event) => {
                            event.stopPropagation()
                            event.preventDefault()
                            handleDelete(a.id)
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Видалити
                        </button>
                      </div>
                    </td>
                  </Link>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick add/edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => { setShowForm(false); setEditingId(null); }}>
          <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-[#ced48c] px-5 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{editingId ? "Редагувати тварину" : "Додати тварину"}</h3>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="text-foreground/60 hover:text-foreground"><IconX size={20} /></button>
            </div>
            <div className="p-5 space-y-3">
              {/* Photos */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Фото</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {(() => { try { const arr = JSON.parse(form.photos || "[]"); return Array.isArray(arr) ? arr : []; } catch { return []; } })().map((url: string, i: number) => (
                    <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden group">
                      <ImageFallback src={url} alt="" fill className="object-cover" sizes="56px" />
                      <button type="button" onClick={() => { const arr = JSON.parse(form.photos || "[]"); arr.splice(i, 1); setForm({ ...form, photos: JSON.stringify(arr) }); }} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm">×</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileRef.current?.click()} className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-[#ced48c] hover:bg-[#ced48c]/5 transition-colors">
                    <IconPhoto size={18} className="text-gray-400" />
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={handlePhotoUpload} className="hidden" />
                {uploading && <p className="text-[11px] text-gray-400 mt-1">Завантаження...</p>}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Ім&apos;я *</p>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Ім'я тварини" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Вид *</p>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={selectClass}>
                    <option value="dog">🐕 Собака</option>
                    <option value="cat">🐈 Кіт</option>
                    <option value="other">🐾 Інше</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Стать</p>
                  <select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} className={selectClass}>
                    <option value="">—</option>
                    <option value="male">Хлопчик</option>
                    <option value="female">Дівчинка</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Розмір</p>
                  <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className={selectClass}>
                    <option value="">—</option>
                    <option value="small">Малий</option>
                    <option value="medium">Середній</option>
                    <option value="large">Великий</option>
                  </select>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Порода</p>
                <input type="text" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className={inputClass} placeholder="Мікс" />
              </div>

              {/* Color picker */}
              <div className="relative">
                <p className="text-xs text-gray-500 mb-1">Колір</p>
                <button type="button" onClick={() => setShowColorPicker(!showColorPicker)} className={`${inputClass} text-left flex items-center justify-between`}>
                  {selectedColors.length > 0 ? (
                    <span className="flex items-center gap-1.5 flex-wrap">
                      {selectedColors.map((c) => {
                        const opt = colorOptions.find((o) => o.value === c);
                        return <span key={c} className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0" style={{ background: opt?.color || "#ccc" }} />{c}</span>;
                      })}
                    </span>
                  ) : (
                    <span className="text-gray-400">Оберіть колір</span>
                  )}
                  <IconChevronDown size={14} className={`text-gray-400 transition-transform ${showColorPicker ? "rotate-180" : ""}`} />
                </button>
                {showColorPicker && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-30 py-1 max-h-48 overflow-auto">
                    {colorOptions.map((c) => {
                      const sel = selectedColors.includes(c.value);
                      const isG = c.color.includes("gradient");
                      return (
                        <button key={c.value} type="button" onClick={() => toggleColor(c.value)} className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-gray-50">
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0" style={isG ? { background: c.color } : { backgroundColor: c.color }} />
                            <span className={sel ? "font-medium" : ""}>{c.value}</span>
                          </span>
                          {sel && <span className="text-[#ced48c] font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Опис</p>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} rows={2} placeholder="Характер, особливості..." />
              </div>
              <div className="flex gap-3">
                <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs cursor-pointer transition-colors ${form.vaccinated ? "bg-[#ced48c]/20 border-[#ced48c]" : "border-gray-200"}`}>
                  <input type="checkbox" checked={form.vaccinated} onChange={(e) => setForm({ ...form, vaccinated: e.target.checked })} className="hidden" />
                  <span className={`w-4 h-4 rounded flex items-center justify-center border text-white text-[10px] ${form.vaccinated ? "bg-[#ced48c] border-[#b8be72]" : "border-gray-300"}`}>{form.vaccinated && "✓"}</span>
                  💉 Вакциновано
                </label>
                <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs cursor-pointer transition-colors ${form.sterilized ? "bg-[#ced48c]/20 border-[#ced48c]" : "border-gray-200"}`}>
                  <input type="checkbox" checked={form.sterilized} onChange={(e) => setForm({ ...form, sterilized: e.target.checked })} className="hidden" />
                  <span className={`w-4 h-4 rounded flex items-center justify-center border text-white text-[10px] ${form.sterilized ? "bg-[#ced48c] border-[#b8be72]" : "border-gray-300"}`}>{form.sterilized && "✓"}</span>
                  ✂️ Стерилізовано
                </label>
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-[#ced48c] text-foreground py-2.5 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50 text-sm">
                {submitting ? "Зачекайте..." : editingId ? "Зберегти" : "Додати"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
