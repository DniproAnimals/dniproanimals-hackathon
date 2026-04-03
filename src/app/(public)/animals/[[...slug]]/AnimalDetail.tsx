"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import ImageFallback from "@/components/ImageFallback";
import { useUser } from "@/lib/UserContext";
import type { Animal } from "@/lib/db";
import {
  IconChevronLeft,
  IconChevronRight,
  IconHeart,
  IconHeartFilled,
  IconPencil,
  IconTrash,
  IconPaw,
  IconTag,
  IconUser,
  IconCalendar,
  IconMapPin,
  IconPackage,
  IconPalette,
  IconCircleCheck,
  IconCircleOff,
  IconBook,
  IconPhone,
  IconMail,
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandFacebook,
  IconX,
  IconCirclePlus,
  IconWeight,
} from "@tabler/icons-react";
import Link from "next/link";

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
  білий: "#ffffff",
  чорний: "#1a1a1a",
  рудий: "#c45e1a",
  сірий: "#9e9e9e",
  коричневий: "#6d4c2e",
  рижий: "#d4762c",
  кремовий: "#f5deb3",
  золотий: "#d4a017",
  триколірний:
    "linear-gradient(135deg, #1a1a1a 33%, #c45e1a 33%, #c45e1a 66%, #fff 66%)",
  "чорно-білий": "linear-gradient(135deg, #1a1a1a 50%, #fff 50%)",
  тигровий: "#8B6914",
  плямистий: "linear-gradient(135deg, #fff 40%, #6d4c2e 40%)",
  white: "#ffffff",
  black: "#1a1a1a",
  brown: "#6d4c2e",
  golden: "#d4a017",
  gray: "#9e9e9e",
  grey: "#9e9e9e",
  red: "#c45e1a",
  cream: "#f5deb3",
  orange: "#d4762c",
};

function getColorStyle(color: string): string {
  const lower = color.toLowerCase().trim();
  return colorMap[lower] || "#ced48c";
}

export default function AnimalDetailPage({ id }: { id: string }) {
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
  const [visibleContacts, setVisibleContacts] = useState<string[]>(["email"]);
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
        <IconChevronLeft size={18} />
        Назад
      </button>

      <div className="md:grid md:grid-cols-2 md:gap-10">
        {/* Photos */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {photos.length > 0 ? (
            <>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-light group/photo">
                <ImageFallback
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
                      onClick={() =>
                        setActivePhoto(
                          (prev) => (prev - 1 + photos.length) % photos.length,
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-white"
                    >
                      <IconChevronLeft size={18} color="#1a1a1a" stroke={2.5} />
                    </button>
                    <button
                      onClick={() =>
                        setActivePhoto((prev) => (prev + 1) % photos.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-white"
                    >
                      <IconChevronRight
                        size={18}
                        color="#1a1a1a"
                        stroke={2.5}
                      />
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
                      <ImageFallback
                        src={photo}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square rounded-2xl bg-gray-light flex items-center justify-center text-7xl">
              {animal.type === "dog"
                ? "🐕"
                : animal.type === "cat"
                  ? "🐈"
                  : "🐾"}
            </div>
          )}

          {/* Description — under photos */}
          {animal.description && (
            <div className="mt-5">
              <h2 className="text-sm font-semibold mb-2">Інформація</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {animal.description}
              </p>
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="mt-6 md:mt-0"
        >
          {/* Name + adopt button */}
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {animal.name}
              </h1>
              <span
                className={`text-xl ${animal.sex === "male" ? "text-blue-400" : "text-pink-400"}`}
              >
                {animal.sex === "male" ? "♂" : "♀"}
              </span>
              {user && (
                <button
                  onClick={() => toggleFavorite(animal.id)}
                  className="p-1 transition-colors"
                  aria-label={
                    isFav ? "Прибрати з обраного" : "Додати до обраного"
                  }
                >
                  {isFav ? (
                    <IconHeartFilled size={22} color="#ced48c" />
                  ) : (
                    <IconHeart size={22} color="#ccc" />
                  )}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {user?.role === "admin" && (
                <>
                  <Link
                    href={`/dashboard/animals/edit?edit=${animal.id}`}
                    className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center"
                    title="Редагувати"
                  >
                    <IconPencil size={14} />
                  </Link>
                  <button
                    onClick={async () => {
                      if (!confirm("Видалити цю тварину?")) return;
                      const res = await fetch(`/api/animals/${animal.id}`, {
                        method: "DELETE",
                      });
                      if (res.ok) router.push("/");
                    }}
                    className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
                    title="Видалити"
                  >
                    <IconTrash size={14} />
                  </button>
                </>
              )}
              {animal.status === "available" &&
                !showAdoptForm &&
                !submitted && (
                  <button
                    onClick={() => setShowAdoptForm(true)}
                    className="bg-[#ced48c] text-foreground px-5 py-2 rounded-xl font-semibold text-sm hover:bg-[#b8be72] transition-colors"
                  >
                    Забрати додому
                  </button>
                )}
              {animal.status !== "available" && (
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    animal.status === "adopted"
                      ? "bg-green-light text-green-accent"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {animal.status === "adopted"
                    ? "Прилаштовано"
                    : "Зарезервовано"}
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
              <IconPaw size={16} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">Вид</span>
              <span className="text-sm text-gray-medium ml-auto">
                {getTypeLabel(animal.type)}
              </span>
            </div>
            {animal.breed && (
              <div className="flex items-center gap-2.5 py-3">
                <IconTag size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  Порода
                </span>
                <span className="text-sm text-gray-medium ml-auto">
                  {animal.breed}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2.5 py-3">
              <IconUser size={16} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">Стать</span>
              <span className="text-sm text-gray-medium ml-auto">
                {animal.sex === "male" ? "Хлопчик" : "Дівчинка"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 py-3">
              <IconCalendar size={16} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">Вік</span>
              <span className="text-sm text-gray-medium ml-auto">
                {getAgeLabel(animal.age_months)}
              </span>
            </div>
            <div className="flex items-center gap-2.5 py-3">
              <IconPackage size={16} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">
                Розмір
              </span>
              <span className="text-sm text-gray-medium ml-auto">
                {getSizeLabel(animal.size)}
              </span>
            </div>
            {animal.weight_kg && (
              <div className="flex items-center gap-2.5 py-3">
                <IconWeight size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  Вага
                </span>
                <span className="text-sm text-gray-medium ml-auto">
                  {animal.weight_kg} кг
                </span>
              </div>
            )}
            {animal.color && (
              <div className="flex items-center gap-2.5 py-3">
                <IconPalette
                  size={16}
                  className="text-gray-400 flex-shrink-0"
                />
                <span className="text-sm font-medium text-foreground">
                  Колір
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-medium ml-auto">
                  {animal.color}
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-gray-border flex-shrink-0"
                    style={
                      isGradient
                        ? { background: colorStyle! }
                        : { backgroundColor: colorStyle! }
                    }
                  />
                </span>
              </div>
            )}
            <div className="flex items-center gap-2.5 py-3">
              <IconCircleCheck
                size={16}
                className="text-gray-400 flex-shrink-0"
              />
              <span className="text-sm font-medium text-foreground">
                Вакцинація
              </span>
              <span className="text-sm text-gray-medium ml-auto">
                {animal.vaccinated ? "Так" : "Ні"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 py-3">
              <IconCircleOff
                size={16}
                className="text-gray-400 flex-shrink-0"
              />
              <span className="text-sm font-medium text-foreground">
                Стерилізація
              </span>
              <span className="text-sm text-gray-medium ml-auto">
                {animal.sterilized ? "Так" : "Ні"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 py-3">
              <IconBook size={16} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">
                Навчено
              </span>
              <span className="text-sm text-gray-medium ml-auto">
                {animal.trained ? "Так" : "Ні"}
              </span>
            </div>
          </div>

          {/* Contact info */}
          {(animal.contact_name ||
            animal.contact_phone ||
            animal.contact_email ||
            animal.contact_instagram ||
            animal.contact_telegram ||
            animal.contact_facebook ||
            animal.contact_location) && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-3">Контакти</h2>
              <div className="space-y-2.5">
                {animal.contact_name && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconUser
                      size={16}
                      className="text-gray-400 flex-shrink-0"
                    />
                    <span className="text-foreground font-medium">
                      {animal.contact_name}
                    </span>
                  </div>
                )}
                {animal.contact_phone && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconPhone
                      size={16}
                      className="text-gray-400 flex-shrink-0"
                    />
                    <a
                      href={`tel:${animal.contact_phone}`}
                      className="text-foreground hover:underline"
                    >
                      {animal.contact_phone}
                    </a>
                  </div>
                )}
                {animal.contact_email && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconMail
                      size={16}
                      className="text-gray-400 flex-shrink-0"
                    />
                    <a
                      href={`mailto:${animal.contact_email}`}
                      className="text-foreground hover:underline"
                    >
                      {animal.contact_email}
                    </a>
                  </div>
                )}
                {animal.contact_instagram && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconBrandInstagram
                      size={16}
                      className="text-gray-400 flex-shrink-0"
                    />
                    <a
                      href={`https://instagram.com/${animal.contact_instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline"
                    >
                      @{animal.contact_instagram}
                    </a>
                  </div>
                )}
                {animal.contact_telegram && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconBrandTelegram
                      size={16}
                      className="text-gray-400 flex-shrink-0"
                    />
                    <a
                      href={`https://t.me/${animal.contact_telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline"
                    >
                      @{animal.contact_telegram}
                    </a>
                  </div>
                )}
                {animal.contact_facebook && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconBrandFacebook
                      size={16}
                      className="text-gray-400 flex-shrink-0"
                    />
                    <a
                      href={`https://facebook.com/${animal.contact_facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline"
                    >
                      {animal.contact_facebook}
                    </a>
                  </div>
                )}
                {animal.contact_location && (
                  <div className="pt-1">
                    <div className="flex items-center gap-2.5 text-sm mb-2">
                      <IconMapPin
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(animal.contact_location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:underline"
                      >
                        {animal.contact_location}
                      </a>
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
                        <IconMapPin size={12} />
                        Відкрити в Google Maps
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Adopt form — modal */}
      {showAdoptForm && !submitted && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-modal-overlay"
          onClick={() => setShowAdoptForm(false)}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3 shadow-xl animate-modal-in"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-lg">Заявка на усиновлення</h3>
              <button
                type="button"
                onClick={() => setShowAdoptForm(false)}
                className="text-gray-400 hover:text-foreground transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-medium mb-2">
              Вкажіть як з вами зв&apos;язатися
            </p>

            {/* Name */}
            <div className="relative">
              <IconUser
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Ваше ім'я *"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <IconPhone
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="tel"
                placeholder="Телефон *"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm"
              />
            </div>

            {/* Місто */}
            <div className="relative">
              <IconMapPin
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Місто / район"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm"
              />
            </div>

            <textarea
              placeholder="Розкажіть про себе та умови утримання... *"
              rows={3}
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm resize-none"
            />

            {/* Dynamic extra contact fields */}
            {visibleContacts.map((type) => (
              <div key={type} className="relative animate-modal-in">
                {type === "email" && (
                  <>
                    <IconMail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm"
                    />
                  </>
                )}
                {type === "instagram" && (
                  <>
                    <IconBrandInstagram
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Instagram"
                      value={formData.instagram}
                      onChange={(e) =>
                        setFormData({ ...formData, instagram: e.target.value })
                      }
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm"
                    />
                  </>
                )}
                {type === "telegram" && (
                  <>
                    <IconBrandTelegram
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Telegram"
                      value={formData.telegram}
                      onChange={(e) =>
                        setFormData({ ...formData, telegram: e.target.value })
                      }
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm"
                    />
                  </>
                )}
                {type === "facebook" && (
                  <>
                    <IconBrandFacebook
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Facebook"
                      value={formData.facebook}
                      onChange={(e) =>
                        setFormData({ ...formData, facebook: e.target.value })
                      }
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm"
                    />
                  </>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setVisibleContacts(
                      visibleContacts.filter((c) => c !== type),
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground"
                >
                  <IconX size={14} />
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
                  <IconCirclePlus size={14} />
                  Додати спосіб зв&apos;язку
                </button>
                <div className="hidden absolute left-0 bottom-full mb-1 bg-white rounded-xl border border-gray-border shadow-lg z-10 py-1 w-48 animate-modal-in">
                  {!visibleContacts.includes("email") && (
                    <button
                      type="button"
                      onClick={(e) => {
                        setVisibleContacts([...visibleContacts, "email"]);
                        (
                          e.currentTarget.parentElement as HTMLElement
                        ).classList.add("hidden");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-gray-light transition-colors"
                    >
                      <IconMail size={14} className="text-gray-400" />
                      Email
                    </button>
                  )}
                  {!visibleContacts.includes("instagram") && (
                    <button
                      type="button"
                      onClick={(e) => {
                        setVisibleContacts([...visibleContacts, "instagram"]);
                        (
                          e.currentTarget.parentElement as HTMLElement
                        ).classList.add("hidden");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-gray-light transition-colors"
                    >
                      <IconBrandInstagram size={14} className="text-gray-400" />
                      Instagram
                    </button>
                  )}
                  {!visibleContacts.includes("telegram") && (
                    <button
                      type="button"
                      onClick={(e) => {
                        setVisibleContacts([...visibleContacts, "telegram"]);
                        (
                          e.currentTarget.parentElement as HTMLElement
                        ).classList.add("hidden");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-gray-light transition-colors"
                    >
                      <IconBrandTelegram size={14} className="text-gray-400" />
                      Telegram
                    </button>
                  )}
                  {!visibleContacts.includes("facebook") && (
                    <button
                      type="button"
                      onClick={(e) => {
                        setVisibleContacts([...visibleContacts, "facebook"]);
                        (
                          e.currentTarget.parentElement as HTMLElement
                        ).classList.add("hidden");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-gray-light transition-colors"
                    >
                      <IconBrandFacebook size={14} className="text-gray-400" />
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-modal-overlay"
          onClick={() => setSubmitted(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl animate-modal-success"
          >
            <p className="text-2xl mb-2">💚</p>
            <p className="text-lg font-semibold text-foreground mb-1">
              Дякуємо!
            </p>
            <p className="text-sm text-gray-medium mb-4">
              Вашу заявку отримано. Ми зв&apos;яжемося з вами найближчим часом.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-[#ced48c] text-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-[#b8be72] transition-colors text-sm"
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
