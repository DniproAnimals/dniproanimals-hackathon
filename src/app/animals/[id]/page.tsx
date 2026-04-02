"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/lib/UserContext";
import type { Animal } from "@/lib/db";

function getAgeLabel(months: number | null): string {
  if (!months) return "Невідомо";
  if (months < 12) return `${months} міс.`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const yWord = years === 1 ? "рік" : years < 5 ? "роки" : "років";
  if (rem === 0) return `${years} ${yWord}`;
  return `${years} ${yWord} ${rem} міс.`;
}

function getSizeLabel(size: string | null): string {
  if (size === "small") return "Малий";
  if (size === "medium") return "Середній";
  if (size === "large") return "Великий";
  return "Невідомо";
}

function getTypeLabel(type: string): string {
  if (type === "dog") return "Собака";
  if (type === "cat") return "Кіт";
  return "Інше";
}

// Maps common color names to CSS colors for the circle
const colorMap: Record<string, string> = {
  "білий": "#ffffff",
  "чорний": "#1a1a1a",
  "рудий": "#c45e1a",
  "сірий": "#9e9e9e",
  "коричневий": "#6d4c2e",
  "рижий": "#d4762c",
  "кремовий": "#f5deb3",
  "золотий": "#d4a017",
  "триколірний": "linear-gradient(135deg, #1a1a1a 33%, #c45e1a 33%, #c45e1a 66%, #fff 66%)",
  "чорно-білий": "linear-gradient(135deg, #1a1a1a 50%, #fff 50%)",
  "тигровий": "#8B6914",
  "плямистий": "linear-gradient(135deg, #fff 40%, #6d4c2e 40%)",
  "white": "#ffffff",
  "black": "#1a1a1a",
  "brown": "#6d4c2e",
  "golden": "#d4a017",
  "gray": "#9e9e9e",
  "grey": "#9e9e9e",
  "red": "#c45e1a",
  "cream": "#f5deb3",
  "orange": "#d4762c",
};

function getColorStyle(color: string): string {
  const lower = color.toLowerCase().trim();
  return colorMap[lower] || "#ced48c";
}

export default function AnimalDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showAdoptForm, setShowAdoptForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    instagram: "",
    telegram: "",
    facebook: "",
    location: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [visibleContacts, setVisibleContacts] = useState<string[]>([]);
  const { user, favoriteIds, toggleFavorite } = useUser();
  const isFav = animal ? favoriteIds.includes(animal.id) : false;

  useEffect(() => {
    fetch(`/api/animals/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setAnimal(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/adoption", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animal_id: Number(id), ...formData }),
    });
    if (res.ok) setSubmitted(true);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="animate-pulse md:grid md:grid-cols-2 md:gap-10">
          <div className="bg-gray-light rounded-2xl aspect-square" />
          <div className="mt-6 md:mt-0">
            <div className="h-8 bg-gray-light rounded-lg w-1/3 mb-4" />
            <div className="h-4 bg-gray-light rounded-lg w-2/3 mb-3" />
            <div className="h-4 bg-gray-light rounded-lg w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-light mx-auto flex items-center justify-center mb-4">
          <span className="text-4xl">😿</span>
        </div>
        <p className="text-lg font-semibold mb-1">Тварину не знайдено</p>
        <button
          onClick={() => router.push("/")}
          className="mt-3 text-green-accent text-sm font-medium"
        >
          ← Повернутися до каталогу
        </button>
      </div>
    );
  }

  const photos: string[] = JSON.parse(animal.photos || "[]");
  const colorStyle = animal.color ? getColorStyle(animal.color) : null;
  const isGradient = colorStyle?.includes("gradient");

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-10">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-medium hover:text-foreground mb-5 transition-colors text-sm"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        Назад
      </button>

      <div className="md:grid md:grid-cols-2 md:gap-10">
        {/* Photos */}
        <div>
          {photos.length > 0 ? (
            <>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-light group/photo">
                <Image
                  src={photos[activePhoto]}
                  alt={animal.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePhoto((prev) => (prev - 1 + photos.length) % photos.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-white"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button
                      onClick={() => setActivePhoto((prev) => (prev + 1) % photos.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-white"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                    <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded-full">
                      {activePhoto + 1}/{photos.length}
                    </div>
                  </>
                )}
              </div>
              {photos.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {photos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        i === activePhoto
                          ? "border-green-primary"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={photo} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square rounded-2xl bg-gray-light flex items-center justify-center text-7xl">
              {animal.type === "dog" ? "🐕" : animal.type === "cat" ? "🐈" : "🐾"}
            </div>
          )}

          {/* Description — under photos */}
          {animal.description && (
            <div className="mt-5">
              <h2 className="text-sm font-semibold mb-2">Інформація</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{animal.description}</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 md:mt-0">
          {/* Name + adopt button */}
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{animal.name}</h1>
              <span className={`text-xl ${animal.sex === "male" ? "text-blue-400" : "text-pink-400"}`}>
                {animal.sex === "male" ? "♂" : "♀"}
              </span>
              {user && (
                <button
                  onClick={() => toggleFavorite(animal.id)}
                  className="p-1 transition-colors"
                  aria-label={isFav ? "Прибрати з обраного" : "Додати до обраного"}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill={isFav ? "#ced48c" : "none"} stroke={isFav ? "#ced48c" : "#ccc"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21c-1.5 0-5-2.5-7.5-6C2 11 2 7.5 4 5.5S9 3 12 6c3-3 6-2.5 8-0.5s2 5.5-.5 9.5C17 19 13.5 21 12 21z"/>
                    <circle cx="7.5" cy="7" r="1.5"/><circle cx="16.5" cy="7" r="1.5"/><circle cx="10" cy="4.5" r="1.5"/><circle cx="14" cy="4.5" r="1.5"/>
                  </svg>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {user?.role === "admin" && (
                <>
                  <a href={`/admin/add?edit=${animal.id}`} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center" title="Редагувати">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </a>
                  <button
                    onClick={async () => {
                      if (!confirm("Видалити цю тварину?")) return;
                      const res = await fetch(`/api/animals/${animal.id}`, { method: "DELETE" });
                      if (res.ok) router.push("/");
                    }}
                    className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
                    title="Видалити"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </>
              )}
              {animal.status === "available" && !showAdoptForm && !submitted && (
                <button
                  onClick={() => setShowAdoptForm(true)}
                  className="bg-[#ced48c] text-foreground px-5 py-2 rounded-xl font-semibold text-sm hover:bg-[#b8be72] transition-colors"
                >
                  Забрати додому
                </button>
              )}
              {animal.status !== "available" && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  animal.status === "adopted"
                    ? "bg-green-light text-green-accent"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {animal.status === "adopted" ? "Прилаштовано" : "Зарезервовано"}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-medium mb-5">
            {animal.breed || "Мікс порід"}
          </p>

          {/* Metadata — list */}
          <div className="divide-y divide-gray-border mb-6">
            <div className="flex items-center gap-2.5 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
              <span className="text-sm font-medium text-foreground">Вид</span>
              <span className="text-sm text-gray-medium ml-auto">{getTypeLabel(animal.type)}</span>
            </div>
            {animal.breed && (
              <div className="flex items-center gap-2.5 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                <span className="text-sm font-medium text-foreground">Порода</span>
                <span className="text-sm text-gray-medium ml-auto">{animal.breed}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span className="text-sm font-medium text-foreground">Стать</span>
              <span className="text-sm text-gray-medium ml-auto">{animal.sex === "male" ? "Хлопчик" : "Дівчинка"}</span>
            </div>
            <div className="flex items-center gap-2.5 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span className="text-sm font-medium text-foreground">Вік</span>
              <span className="text-sm text-gray-medium ml-auto">{getAgeLabel(animal.age_months)}</span>
            </div>
            <div className="flex items-center gap-2.5 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span className="text-sm font-medium text-foreground">Розмір</span>
              <span className="text-sm text-gray-medium ml-auto">{getSizeLabel(animal.size)}</span>
            </div>
            {animal.weight_kg && (
              <div className="flex items-center gap-2.5 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
                <span className="text-sm font-medium text-foreground">Вага</span>
                <span className="text-sm text-gray-medium ml-auto">{animal.weight_kg} кг</span>
              </div>
            )}
            {animal.color && (
              <div className="flex items-center gap-2.5 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20"/></svg>
                <span className="text-sm font-medium text-foreground">Колір</span>
                <span className="flex items-center gap-2 text-sm text-gray-medium ml-auto">
                  {animal.color}
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-gray-border flex-shrink-0"
                    style={isGradient ? { background: colorStyle! } : { backgroundColor: colorStyle! }}
                  />
                </span>
              </div>
            )}
            <div className="flex items-center gap-2.5 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span className="text-sm font-medium text-foreground">Вакцинація</span>
              <span className="text-sm text-gray-medium ml-auto">{animal.vaccinated ? "Так" : "Ні"}</span>
            </div>
            <div className="flex items-center gap-2.5 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
              <span className="text-sm font-medium text-foreground">Стерилізація</span>
              <span className="text-sm text-gray-medium ml-auto">{animal.sterilized ? "Так" : "Ні"}</span>
            </div>
            <div className="flex items-center gap-2.5 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              <span className="text-sm font-medium text-foreground">Навчено</span>
              <span className="text-sm text-gray-medium ml-auto">{animal.trained ? "Так" : "Ні"}</span>
            </div>
          </div>

          {/* Contact info */}
          {(animal.contact_name || animal.contact_phone || animal.contact_email || animal.contact_instagram || animal.contact_telegram || animal.contact_facebook || animal.contact_location) && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-3">Контакти</h2>
              <div className="space-y-2.5">
                {animal.contact_name && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span className="text-foreground font-medium">{animal.contact_name}</span>
                  </div>
                )}
                {animal.contact_phone && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                    <a href={`tel:${animal.contact_phone}`} className="text-foreground hover:underline">{animal.contact_phone}</a>
                  </div>
                )}
                {animal.contact_email && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <a href={`mailto:${animal.contact_email}`} className="text-foreground hover:underline">{animal.contact_email}</a>
                  </div>
                )}
                {animal.contact_instagram && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    <a href={`https://instagram.com/${animal.contact_instagram}`} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">@{animal.contact_instagram}</a>
                  </div>
                )}
                {animal.contact_telegram && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    <a href={`https://t.me/${animal.contact_telegram}`} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">@{animal.contact_telegram}</a>
                  </div>
                )}
                {animal.contact_facebook && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                    <a href={`https://facebook.com/${animal.contact_facebook}`} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">{animal.contact_facebook}</a>
                  </div>
                )}
                {animal.contact_location && (
                  <div className="pt-1">
                    <div className="flex items-center gap-2.5 text-sm mb-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(animal.contact_location)}`} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">{animal.contact_location}</a>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(animal.contact_location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl overflow-hidden border border-gray-border hover:border-[#ced48c] transition-colors"
                    >
                      <iframe
                        title="Карта"
                        width="100%"
                        height="120"
                        style={{ border: 0, pointerEvents: "none" }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(animal.contact_location)}&output=embed&z=13`}
                      />
                      <div className="px-3 py-1.5 flex items-center gap-1.5 text-xs text-gray-medium">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        Відкрити в Google Maps
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}


        </div>
      </div>

      {/* Adopt form — modal */}
      {showAdoptForm && !submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-modal-overlay" onClick={() => setShowAdoptForm(false)}>
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3 shadow-xl animate-modal-in"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-lg">Заявка на усиновлення</h3>
              <button type="button" onClick={() => setShowAdoptForm(false)} className="text-gray-400 hover:text-foreground transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <p className="text-sm text-gray-medium mb-2">Вкажіть як з вами зв&apos;язатися</p>

            {/* Name */}
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input
                type="text"
                placeholder="Ваше ім'я *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <input
                type="tel"
                placeholder="Телефон *"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm"
              />
            </div>

            {/* Місто */}
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <input
                type="text"
                placeholder="Місто / район"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm"
              />
            </div>

            <textarea
              placeholder="Розкажіть про себе та умови утримання... *"
              rows={3}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm resize-none"
            />

            {/* Dynamic extra contact fields */}
            {visibleContacts.map((type) => (
              <div key={type} className="relative animate-modal-in">
                {type === "email" && <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
                </>}
                {type === "instagram" && <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  <input type="text" placeholder="Instagram" value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
                </>}
                {type === "telegram" && <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  <input type="text" placeholder="Telegram" value={formData.telegram} onChange={(e) => setFormData({ ...formData, telegram: e.target.value })} className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
                </>}
                {type === "facebook" && <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                  <input type="text" placeholder="Facebook" value={formData.facebook} onChange={(e) => setFormData({ ...formData, facebook: e.target.value })} className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
                </>}
                <button type="button" onClick={() => setVisibleContacts(visibleContacts.filter((c) => c !== type))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}

            {/* Add contact button */}
            {visibleContacts.length < 4 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    const menu = btn.nextElementSibling as HTMLElement;
                    menu.classList.toggle("hidden");
                  }}
                  className="flex items-center gap-1.5 text-[13px] text-gray-medium hover:text-foreground transition-colors py-1"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  Додати спосіб зв&apos;язку
                </button>
                <div className="hidden absolute left-0 bottom-full mb-1 bg-white rounded-xl border border-gray-border shadow-lg z-10 py-1 w-48 animate-modal-in">
                  {!visibleContacts.includes("email") && (
                    <button type="button" onClick={(e) => { setVisibleContacts([...visibleContacts, "email"]); (e.currentTarget.parentElement as HTMLElement).classList.add("hidden"); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-gray-light transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      Email
                    </button>
                  )}
                  {!visibleContacts.includes("instagram") && (
                    <button type="button" onClick={(e) => { setVisibleContacts([...visibleContacts, "instagram"]); (e.currentTarget.parentElement as HTMLElement).classList.add("hidden"); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-gray-light transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                      Instagram
                    </button>
                  )}
                  {!visibleContacts.includes("telegram") && (
                    <button type="button" onClick={(e) => { setVisibleContacts([...visibleContacts, "telegram"]); (e.currentTarget.parentElement as HTMLElement).classList.add("hidden"); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-gray-light transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      Telegram
                    </button>
                  )}
                  {!visibleContacts.includes("facebook") && (
                    <button type="button" onClick={(e) => { setVisibleContacts([...visibleContacts, "facebook"]); (e.currentTarget.parentElement as HTMLElement).classList.add("hidden"); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-gray-light transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                      Facebook
                    </button>
                  )}
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#ced48c] text-foreground py-3 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50"
            >
              {submitting ? "Надсилання..." : "Надіслати заявку"}
            </button>
          </form>
        </div>
      )}

      {/* Success — modal */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-modal-overlay" onClick={() => setSubmitted(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl animate-modal-success">
            <p className="text-2xl mb-2">💚</p>
            <p className="text-lg font-semibold text-foreground mb-1">Дякуємо!</p>
            <p className="text-sm text-gray-medium mb-4">Вашу заявку отримано. Ми зв&apos;яжемося з вами найближчим часом.</p>
            <button onClick={() => setSubmitted(false)} className="bg-[#ced48c] text-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-[#b8be72] transition-colors text-sm">
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
