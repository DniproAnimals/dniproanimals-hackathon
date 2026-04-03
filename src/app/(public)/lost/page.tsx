"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import ImageFallback from "@/components/ImageFallback";
import { motion } from "motion/react";
import type { LostAnimal } from "@/lib/db";
import {
  IconSearch,
  IconMapPin,
  IconPaw,
  IconX,
  IconTag,
  IconPalette,
  IconEye,
  IconCalendar,
  IconUser,
  IconPhone,
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconPackage,
  IconPhoto,
  IconEdit,
  IconCheck,
} from "@tabler/icons-react";

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

export default function LostAnimalsPage() {
  const [items, setItems] = useState<LostAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const filter = "lost";
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LostAnimal | null>(null);
  const [detailPhoto, setDetailPhoto] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [breedSearch, setBreedSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "lost" as "lost" | "found",
    animal_type: "",
    breed: "",
    sex: "",
    color: "",
    size: "",
    location: "",
    last_seen_location: "",
    last_seen_date: "",
    contact_name: "",
    contact_phone: "",
    photos: [] as string[],
  });

  const fetchItems = () => {
    fetch(`/api/lost?type=${filter}`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);


  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "lost",
      animal_type: "",
      breed: "",
      sex: "",
      color: "",
      size: "",
      location: "",
      last_seen_location: "",
      last_seen_date: "",
      contact_name: "",
      contact_phone: "",
      photos: [],
    });
    setEditingId(null);
  };

  const openEditForm = (item: LostAnimal) => {
    const photos: string[] = JSON.parse(item.photos || "[]");
    setFormData({
      title: item.title,
      description: item.description,
      type: item.type as "lost" | "found",
      animal_type: item.animal_type || "",
      breed: item.breed || "",
      sex: item.sex || "",
      color: item.color || "",
      size: item.size || "",
      location: item.location || "",
      last_seen_location: item.last_seen_location || "",
      last_seen_date: item.last_seen_date || "",
      contact_name: item.contact_name,
      contact_phone: item.contact_phone,
      photos,
    });
    setEditingId(item.id);
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleMarkFound = async (item: LostAnimal) => {
    const res = await fetch(`/api/lost/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: item.title,
        description: item.description,
        type: "found",
        animal_type: item.animal_type,
        breed: item.breed,
        sex: item.sex,
        color: item.color,
        size: item.size,
        location: item.location,
        last_seen_location: item.last_seen_location,
        last_seen_date: item.last_seen_date,
        contact_name: item.contact_name,
        contact_phone: item.contact_phone,
        photos: JSON.parse(item.photos || "[]"),
      }),
    });
    if (res.ok) {
      setSelectedItem(null);
      fetchItems();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const url = editingId ? `/api/lost/${editingId}` : "/api/lost";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, photos: formData.photos }),
    });
    if (res.ok) {
      setShowForm(false);
      resetForm();
      fetchItems();
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Загублені тварини</h1>
          <p className="text-sm text-gray-medium mt-1">Допоможіть знайти господарів</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-red-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1.5"
        >
          <IconSearch size={14} />
          Загубив тварину
        </button>
      </div>

      {/* Count */}
      {!loading && items.length > 0 && (
        <p className="text-sm text-gray-medium mb-5">{items.length} оголошень</p>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-light rounded-2xl animate-pulse h-48" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-gray-light mx-auto flex items-center justify-center mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-lg font-semibold">Оголошень поки немає</p>
          <p className="text-sm text-gray-medium mt-1">Будьте першим — додайте оголошення</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const photos: string[] = JSON.parse(item.photos || "[]");
            return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-2xl border border-gray-border overflow-hidden text-left hover:border-[#ced48c] hover:shadow-md transition-all"
              >
                {photos[0] && (
                  <div className="relative w-full h-40 bg-gray-light">
                    <ImageFallback
                      src={photos[0]}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span
                      className={`absolute top-2.5 left-2.5 text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                        item.type === "lost"
                          ? "bg-red-500 text-white"
                          : "bg-green-accent text-white"
                      }`}
                    >
                      {item.type === "lost" ? "Загублено" : "Знайдено"}
                    </span>
                  </div>
                )}
                {!photos[0] && (
                  <div className="relative w-full h-24 bg-gray-light flex items-center justify-center">
                    <span className="text-3xl">{item.type === "lost" ? "🔴" : "🟢"}</span>
                    <span
                      className={`absolute top-2.5 left-2.5 text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                        item.type === "lost"
                          ? "bg-red-500 text-white"
                          : "bg-green-accent text-white"
                      }`}
                    >
                      {item.type === "lost" ? "Загублено" : "Знайдено"}
                    </span>
                  </div>
                )}
                <div className="p-3.5">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-gray-medium line-clamp-2 mb-2">{item.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <IconMapPin size={11} />
                        {item.location}
                      </span>
                    )}
                    {item.animal_type && (
                      <span className="flex items-center gap-1">
                        <IconPaw size={11} />
                        {item.animal_type}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Add form — modal */}
      {showForm && (() => {
        const breeds = formData.animal_type === "Кіт" ? catBreeds : dogBreeds;
        const filteredBreeds = breedSearch ? breeds.filter((b) => b.toLowerCase().includes(breedSearch.toLowerCase())) : breeds;
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-modal-overlay" onClick={() => { setShowForm(false); resetForm(); setOpenDropdown(""); }}>
          <form
            onSubmit={handleSubmit}
            onClick={(e) => { e.stopPropagation(); setOpenDropdown(""); }}
            className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-modal-in overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-red-500 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2 text-white">
                {editingId ? <IconEdit size={18} /> : <IconSearch size={18} />}
                <h3 className="font-semibold">{editingId ? "Редагувати оголошення" : "Загубив тварину"}</h3>
              </div>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="text-white/70 hover:text-white">
                <IconX size={20} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {/* Photos */}
              <div>
                <p className="text-xs text-gray-medium mb-1.5">Фотографії</p>
                <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-border rounded-xl p-4 text-center cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-colors">
                  <IconPhoto size={24} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs font-medium text-foreground">Натисніть або перетягніть</p>
                  <p className="text-[11px] text-gray-medium">JPG, PNG до 5 МБ</p>
                  {uploading && <p className="text-[11px] text-red-400 mt-1">Завантаження...</p>}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={async (e) => {
                  const files = e.target.files;
                  if (!files) return;
                  setUploading(true);
                  for (const file of Array.from(files)) {
                    const fd = new FormData();
                    fd.append("file", file);
                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                    if (res.ok) {
                      const { url } = await res.json();
                      setFormData((prev) => ({ ...prev, photos: [...prev.photos, url] }));
                    }
                  }
                  setUploading(false);
                  if (fileRef.current) fileRef.current.value = "";
                }} className="hidden" />
                {formData.photos.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.photos.map((url, i) => (
                      <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden group">
                        <Image src={url} alt="" fill className="object-cover" sizes="56px" />
                        <button type="button" onClick={() => setFormData({ ...formData, photos: formData.photos.filter((_, j) => j !== i) })} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-lg">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status toggle (edit mode) */}
              {editingId && (
                <div>
                  <p className="text-xs text-gray-medium mb-1.5">Статус</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setFormData({ ...formData, type: "lost" })} className={`py-2 rounded-xl text-sm font-medium transition-all border ${formData.type === "lost" ? "bg-red-50 border-red-300 text-red-700" : "bg-white border-gray-border hover:border-red-200"}`}>
                      🔴 Загублено
                    </button>
                    <button type="button" onClick={() => setFormData({ ...formData, type: "found" })} className={`py-2 rounded-xl text-sm font-medium transition-all border ${formData.type === "found" ? "bg-green-50 border-green-300 text-green-700" : "bg-white border-gray-border hover:border-green-200"}`}>
                      🟢 Знайдено
                    </button>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <p className="text-xs text-gray-medium mb-1.5">Хто загубився? *</p>
                <input type="text" placeholder="Наприклад: Рудий кіт Мурчик" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-red-200/50 outline-none text-sm" />
              </div>

              {/* Type — buttons */}
              <div>
                <p className="text-xs text-gray-medium mb-1.5">Вид</p>
                <div className="grid grid-cols-3 gap-2">
                  {[{ value: "Собака", icon: "🐕" }, { value: "Кіт", icon: "🐈" }, { value: "Інше", icon: "🐾" }].map((t) => (
                    <button key={t.value} type="button" onClick={() => setFormData({ ...formData, animal_type: t.value, breed: "" })} className={`py-2 rounded-xl text-sm font-medium transition-all border ${formData.animal_type === t.value ? "bg-red-50 border-red-300 text-red-700" : "bg-white border-gray-border hover:border-red-200"}`}>
                      {t.icon} {t.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Breed — dropdown with search */}
              {formData.animal_type && formData.animal_type !== "Інше" && (
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs text-gray-medium mb-1.5">Порода</p>
                  <button type="button" onClick={() => setOpenDropdown(openDropdown === "breed" ? "" : "breed")} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm text-left transition-colors ${openDropdown === "breed" ? "border-red-300 ring-2 ring-red-200/50 bg-white" : formData.breed ? "border-red-300 bg-red-50/30" : "border-gray-border bg-gray-light hover:border-gray-400"}`}>
                    <span className={formData.breed ? "text-foreground font-medium" : "text-gray-medium"}>{formData.breed || "Оберіть породу"}</span>
                    <IconChevronDown size={14} className={`text-gray-400 transition-transform ${openDropdown === "breed" ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === "breed" && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-border shadow-lg z-30 py-1 max-h-48 overflow-auto animate-modal-in">
                      <div className="p-2 border-b border-gray-border">
                        <input type="text" placeholder="Пошук породи..." value={breedSearch} onChange={(e) => setBreedSearch(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-light border-none outline-none text-sm" autoFocus />
                      </div>
                      {filteredBreeds.map((b) => (
                        <button key={b} type="button" onClick={() => { setFormData({ ...formData, breed: b }); setBreedSearch(""); setOpenDropdown(""); }} className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-light">
                          <span className={formData.breed === b ? "font-medium" : ""}>{b}</span>
                          {formData.breed === b && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </button>
                      ))}
                      {filteredBreeds.length === 0 && <p className="px-4 py-2 text-xs text-gray-medium">Не знайдено</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Sex — buttons */}
              <div>
                <p className="text-xs text-gray-medium mb-1.5">Стать</p>
                <div className="grid grid-cols-2 gap-2">
                  {[{ value: "male", label: "Хлопчик", icon: "♂️" }, { value: "female", label: "Дівчинка", icon: "♀️" }].map((s) => (
                    <button key={s.value} type="button" onClick={() => setFormData({ ...formData, sex: s.value })} className={`py-2 rounded-xl text-sm font-medium transition-all border ${formData.sex === s.value ? "bg-red-50 border-red-300 text-red-700" : "bg-white border-gray-border hover:border-red-200"}`}>
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color — picker */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <p className="text-xs text-gray-medium mb-1.5">Колір</p>
                <button type="button" onClick={() => setOpenDropdown(openDropdown === "color" ? "" : "color")} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm text-left transition-colors ${openDropdown === "color" ? "border-red-300 ring-2 ring-red-200/50 bg-white" : formData.color ? "border-red-300 bg-red-50/30" : "border-gray-border bg-gray-light hover:border-gray-400"}`}>
                  <span className={formData.color ? "text-foreground font-medium flex items-center gap-2" : "text-gray-medium"}>
                    {formData.color ? (
                      <>
                        {formData.color.split(", ").map((c) => {
                          const opt = colorOptions.find((o) => o.value === c);
                          return opt ? <span key={c} className="w-4 h-4 rounded-full border border-gray-border inline-block" style={opt.color.includes("gradient") ? { background: opt.color } : { backgroundColor: opt.color }} /> : null;
                        })}
                        {formData.color}
                      </>
                    ) : "Оберіть колір"}
                  </span>
                  <IconChevronDown size={14} className={`text-gray-400 transition-transform ${openDropdown === "color" ? "rotate-180" : ""}`} />
                </button>
                {openDropdown === "color" && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-border shadow-lg z-30 py-1 max-h-48 overflow-auto animate-modal-in">
                    {colorOptions.map((c) => {
                      const selected = formData.color.split(", ").includes(c.value);
                      const isGradient = c.color.includes("gradient");
                      return (
                        <button key={c.value} type="button" onClick={() => {
                          const current = formData.color ? formData.color.split(", ").filter(Boolean) : [];
                          const next = selected ? current.filter((v) => v !== c.value) : [...current, c.value];
                          setFormData({ ...formData, color: next.join(", ") });
                        }} className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-light">
                          <span className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full border border-gray-border flex-shrink-0" style={isGradient ? { background: c.color } : { backgroundColor: c.color }} />
                            <span className={selected ? "font-medium" : ""}>{c.value}</span>
                          </span>
                          {selected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Size — buttons */}
              <div>
                <p className="text-xs text-gray-medium mb-1.5">Розмір</p>
                <div className="grid grid-cols-3 gap-2">
                  {[{ value: "small", label: "Малий" }, { value: "medium", label: "Середній" }, { value: "large", label: "Великий" }].map((s) => (
                    <button key={s.value} type="button" onClick={() => setFormData({ ...formData, size: s.value })} className={`py-2 rounded-xl text-sm font-medium transition-all border ${formData.size === s.value ? "bg-red-50 border-red-300 text-red-700" : "bg-white border-gray-border hover:border-red-200"}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Where */}
              <div>
                <p className="text-xs text-gray-medium mb-1.5">Де востаннє бачили? *</p>
                <div className="relative">
                  <IconMapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Адреса або район" required value={formData.last_seen_location || formData.location} onChange={(e) => setFormData({ ...formData, last_seen_location: e.target.value, location: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-red-200/50 outline-none text-sm" />
                </div>
              </div>

              {/* When */}
              <div>
                <p className="text-xs text-gray-medium mb-1.5">Коли?</p>
                <input type="date" value={formData.last_seen_date} onChange={(e) => setFormData({ ...formData, last_seen_date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-red-200/50 outline-none text-sm" />
              </div>

              {/* Description */}
              <div>
                <p className="text-xs text-gray-medium mb-1.5">Опис та прикмети *</p>
                <textarea placeholder="Зовнішність, нашийник, особливі прикмети..." required rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-red-200/50 outline-none text-sm resize-none" />
              </div>

              {/* Contact */}
              <div className="pt-1 border-t border-gray-border">
                <p className="text-xs text-gray-medium mb-1.5 mt-2">Ваші контакти *</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <IconUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Ім'я" required value={formData.contact_name} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-red-200/50 outline-none text-sm" />
                  </div>
                  <div className="relative">
                    <IconPhone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" placeholder="Телефон" required value={formData.contact_phone} onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-red-200/50 outline-none text-sm" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={submitting} className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">
                {submitting ? "Збереження..." : editingId ? "Зберегти зміни" : "Опублікувати оголошення"}
              </button>
            </div>
          </form>
        </div>
        );
      })()}

      {/* Detail modal */}
      {selectedItem && (() => {
        const detailPhotos: string[] = JSON.parse(selectedItem.photos || "[]");
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-modal-overlay" onClick={() => { setSelectedItem(null); setDetailPhoto(0); }}>
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-3xl shadow-xl animate-modal-in overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="md:flex">
                {/* Left — Gallery */}
                {detailPhotos.length > 0 && (
                  <div className="md:w-1/2 p-5 md:p-6 md:pr-0">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-light group/photo">
                      <ImageFallback src={detailPhotos[detailPhoto]} alt={selectedItem.title} fill className="object-cover" sizes="400px" />
                      {detailPhotos.length > 1 && (
                        <>
                          <button onClick={() => setDetailPhoto((p) => (p - 1 + detailPhotos.length) % detailPhotos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-white">
                            <IconChevronLeft size={16} color="#1a1a1a" stroke={2.5} />
                          </button>
                          <button onClick={() => setDetailPhoto((p) => (p + 1) % detailPhotos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-white">
                            <IconChevronRight size={16} color="#1a1a1a" stroke={2.5} />
                          </button>
                          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded-full">
                            {detailPhoto + 1}/{detailPhotos.length}
                          </div>
                        </>
                      )}
                    </div>
                    {detailPhotos.length > 1 && (
                      <div className="flex gap-1.5 mt-2">
                        {detailPhotos.map((p, i) => (
                          <button key={i} onClick={() => setDetailPhoto(i)} className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === detailPhoto ? "border-[#ced48c]" : "border-transparent opacity-60 hover:opacity-100"}`}>
                            <ImageFallback src={p} alt="" fill className="object-cover" sizes="56px" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Right — Info */}
                <div className={`p-5 md:p-6 ${detailPhotos.length > 0 ? "md:w-1/2" : "w-full"}`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-lg font-bold">{selectedItem.title}</h2>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${selectedItem.type === "lost" ? "bg-red-500 text-white" : "bg-green-accent text-white"}`}>
                        {selectedItem.type === "lost" ? "Загублено" : "Знайдено"}
                      </span>
                    </div>
                    <button onClick={() => { setSelectedItem(null); setDetailPhoto(0); }} className="text-gray-400 hover:text-foreground transition-colors flex-shrink-0 mt-0.5">
                      <IconX size={20} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{selectedItem.description}</p>

                  {/* Actions */}
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => openEditForm(selectedItem)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-border text-sm font-medium hover:border-[#ced48c] hover:bg-[#ced48c]/5 transition-colors">
                      <IconEdit size={15} />
                      Редагувати
                    </button>
                    {selectedItem.type === "lost" && (
                      <button onClick={() => handleMarkFound(selectedItem)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors">
                        <IconCheck size={15} />
                        Знайдено
                      </button>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="divide-y divide-gray-border mb-4">
                    {selectedItem.animal_type && (
                      <div className="flex items-center gap-2.5 py-2">
                        <IconPaw size={15} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium">Вид</span>
                        <span className="text-sm text-gray-medium ml-auto">{selectedItem.animal_type}</span>
                      </div>
                    )}
                    {selectedItem.breed && (
                      <div className="flex items-center gap-2.5 py-2">
                        <IconTag size={15} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium">Порода</span>
                        <span className="text-sm text-gray-medium ml-auto">{selectedItem.breed}</span>
                      </div>
                    )}
                    {selectedItem.sex && (
                      <div className="flex items-center gap-2.5 py-2">
                        <IconUser size={15} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium">Стать</span>
                        <span className="text-sm text-gray-medium ml-auto">{selectedItem.sex === "male" ? "Хлопчик" : "Дівчинка"}</span>
                      </div>
                    )}
                    {selectedItem.color && (
                      <div className="flex items-center gap-2.5 py-2">
                        <IconPalette size={15} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium">Колір</span>
                        <span className="text-sm text-gray-medium ml-auto">{selectedItem.color}</span>
                      </div>
                    )}
                    {selectedItem.size && (
                      <div className="flex items-center gap-2.5 py-2">
                        <IconPackage size={15} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium">Розмір</span>
                        <span className="text-sm text-gray-medium ml-auto">{selectedItem.size === "small" ? "Малий" : selectedItem.size === "medium" ? "Середній" : "Великий"}</span>
                      </div>
                    )}
                    {selectedItem.location && (
                      <div className="flex items-center gap-2.5 py-2">
                        <IconMapPin size={15} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium">Місцезнаходження</span>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedItem.location)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-medium ml-auto hover:underline">{selectedItem.location}</a>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 py-2">
                      <IconCalendar size={15} className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium">Опубліковано</span>
                      <span className="text-sm text-gray-medium ml-auto">{new Date(selectedItem.created_at).toLocaleDateString("uk-UA")}</span>
                    </div>
                  </div>

                  {/* Last seen */}
                  {(selectedItem.last_seen_location || selectedItem.last_seen_date) && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-2">Востаннє бачили</p>
                      <div className="bg-red-50 rounded-xl p-3 space-y-1.5">
                        {selectedItem.last_seen_location && (
                          <div className="flex items-center gap-2 text-sm">
                            <IconEye size={14} className="text-red-400 flex-shrink-0" />
                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedItem.last_seen_location)}`} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">{selectedItem.last_seen_location}</a>
                          </div>
                        )}
                        {selectedItem.last_seen_date && (
                          <div className="flex items-center gap-2 text-sm">
                            <IconCalendar size={14} className="text-red-400 flex-shrink-0" />
                            <span className="text-foreground">{new Date(selectedItem.last_seen_date).toLocaleDateString("uk-UA")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact */}
                  <div>
                    <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-2">Контакти</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 text-sm">
                        <IconUser size={15} className="text-gray-400 flex-shrink-0" />
                        <span className="font-medium">{selectedItem.contact_name}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm">
                        <IconPhone size={15} className="text-gray-400 flex-shrink-0" />
                        <a href={`tel:${selectedItem.contact_phone}`} className="hover:underline">{selectedItem.contact_phone}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
