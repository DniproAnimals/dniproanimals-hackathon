"use client";
import ImageFallback from "@/components/ImageFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputWithIcon } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/shared/lib/UserContext";
import type { Animal } from "@/shared/lib/db";
import { cn } from "@/shared/lib/utils";
import {
  IconBook,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconBuildingCommunity,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCircleOff,
  IconCirclePlus,
  IconHeart,
  IconHeartFilled,
  IconMail,
  IconMapPin,
  IconPackage,
  IconPalette,
  IconPaw,
  IconPencil,
  IconPhone,
  IconTag,
  IconTrash,
  IconUser,
  IconWeight,
  IconX,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [org, setOrg] = useState<{
    id: number;
    name: string;
    photo: string | null;
    location: string | null;
  } | null>(null);
  const { user, favoriteIds, toggleFavorite } = useUser();
  const isFav = animal ? favoriteIds.includes(animal.id) : false;

  useEffect(() => {
    fetch(`/api/animals/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        const { org: orgData, ...animalData } = data;
        setAnimal(animalData);
        if (orgData) setOrg(orgData);
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
        <div className="size-20 rounded-full bg-gray-light mx-auto flex items-center justify-center mb-4">
          <span className="text-4xl">😿</span>
        </div>
        <p className="text-lg font-semibold mb-1">Тварину не знайдено</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="mt-3 text-green-accent font-medium"
        >
          ← Повернутися до каталогу
        </Button>
      </div>
    );
  }

  const photos: string[] = JSON.parse(animal.photos || "[]");
  const colorStyle = animal.color ? getColorStyle(animal.color) : null;
  const isGradient = colorStyle?.includes("gradient");

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-10">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-medium hover:text-foreground mb-5 -ml-3"
      >
        <IconChevronLeft size={18} />
        Назад
      </Button>

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
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      shape="pill"
                      onClick={() =>
                        setActivePhoto(
                          (prev) => (prev - 1 + photos.length) % photos.length,
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm shadow opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-white"
                    >
                      <IconChevronLeft size={18} color="#1a1a1a" stroke={2.5} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      shape="pill"
                      onClick={() =>
                        setActivePhoto((prev) => (prev + 1) % photos.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm shadow opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-white"
                    >
                      <IconChevronRight
                        size={18}
                        color="#1a1a1a"
                        stroke={2.5}
                      />
                    </Button>
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
                      className={cn(
                        "relative size-16 rounded-xl overflow-hidden border-2 transition-all",
                        i === activePhoto
                          ? "border-green-primary"
                          : "border-transparent opacity-60 hover:opacity-100",
                      )}
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
                className={cn(
                  "text-xl",
                  animal.sex === "male" ? "text-blue-400" : "text-pink-400",
                )}
              >
                {animal.sex === "male" ? "♂" : "♀"}
              </span>
              {user && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => toggleFavorite(animal.id)}
                  aria-label={
                    isFav ? "Прибрати з обраного" : "Додати до обраного"
                  }
                >
                  {isFav ? (
                    <IconHeartFilled size={22} color="#ced48c" />
                  ) : (
                    <IconHeart size={22} color="#ccc" />
                  )}
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {user?.role === "admin" && (
                <>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    asChild
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                    title="Редагувати"
                  >
                    <Link href={`/dashboard/animals/edit?edit=${animal.id}`}>
                      <IconPencil size={14} />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={async () => {
                      if (!confirm("Видалити цю тварину?")) return;
                      const res = await fetch(`/api/animals/${animal.id}`, {
                        method: "DELETE",
                      });
                      if (res.ok) router.push("/");
                    }}
                    className="bg-red-50 text-red-600 hover:bg-red-100"
                    title="Видалити"
                  >
                    <IconTrash size={14} />
                  </Button>
                </>
              )}
              {animal.status === "available" &&
                !showAdoptForm &&
                !submitted && (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={() => setShowAdoptForm(true)}
                  >
                    Забрати додому
                  </Button>
                )}
              {animal.status !== "available" && (
                <Badge
                  variant={animal.status === "adopted" ? "soft" : "warning"}
                  size="md"
                  className="font-semibold"
                >
                  {animal.status === "adopted"
                    ? "Прилаштовано"
                    : "Зарезервовано"}
                </Badge>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-medium mb-5">
            {animal.breed || "Мікс порід"}
          </p>

          {/* Metadata — list */}
          <div className="divide-y divide-gray-border mb-6">
            <div className="flex items-center gap-2.5 py-3">
              <IconPaw size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm font-medium text-foreground">Вид</span>
              <span className="text-sm text-gray-medium ml-auto">
                {getTypeLabel(animal.type)}
              </span>
            </div>
            {animal.breed && (
              <div className="flex items-center gap-2.5 py-3">
                <IconTag size={16} className="text-gray-400 shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  Порода
                </span>
                <span className="text-sm text-gray-medium ml-auto">
                  {animal.breed}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2.5 py-3">
              <IconUser size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm font-medium text-foreground">Стать</span>
              <span className="text-sm text-gray-medium ml-auto">
                {animal.sex === "male" ? "Хлопчик" : "Дівчинка"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 py-3">
              <IconCalendar size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm font-medium text-foreground">Вік</span>
              <span className="text-sm text-gray-medium ml-auto">
                {getAgeLabel(animal.age_months)}
              </span>
            </div>
            <div className="flex items-center gap-2.5 py-3">
              <IconPackage size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm font-medium text-foreground">
                Розмір
              </span>
              <span className="text-sm text-gray-medium ml-auto">
                {getSizeLabel(animal.size)}
              </span>
            </div>
            {animal.weight_kg && (
              <div className="flex items-center gap-2.5 py-3">
                <IconWeight size={16} className="text-gray-400 shrink-0" />
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
                <IconPalette size={16} className="text-gray-400 shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  Колір
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-medium ml-auto">
                  {animal.color}
                  <span
                    className="inline-block size-4 rounded-full border border-gray-border shrink-0"
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
              <IconCircleCheck size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm font-medium text-foreground">
                Вакцинація
              </span>
              <span className="text-sm text-gray-medium ml-auto">
                {animal.vaccinated ? "Так" : "Ні"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 py-3">
              <IconCircleOff size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm font-medium text-foreground">
                Стерилізація
              </span>
              <span className="text-sm text-gray-medium ml-auto">
                {animal.sterilized ? "Так" : "Ні"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 py-3">
              <IconBook size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm font-medium text-foreground">
                Навчено
              </span>
              <span className="text-sm text-gray-medium ml-auto">
                {animal.trained ? "Так" : "Ні"}
              </span>
            </div>
          </div>

          {/* Organization */}
          {org && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-3">Організація</h2>
              <Link
                href={`/organizations/${org.id}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                {org.photo ? (
                  <ImageFallback
                    src={org.photo}
                    alt={org.name}
                    width={40}
                    height={40}
                    className="size-10 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <IconBuildingCommunity
                      size={18}
                      className="text-green-secondary"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {org.name}
                  </p>
                  {org.location && (
                    <p className="text-xs text-gray-medium truncate">
                      {org.location}
                    </p>
                  )}
                </div>
                <IconChevronRight
                  size={16}
                  className="text-gray-400 ml-auto shrink-0"
                />
              </Link>
            </div>
          )}

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
                    <IconUser size={16} className="text-gray-400 shrink-0" />
                    <span className="text-foreground font-medium">
                      {animal.contact_name}
                    </span>
                  </div>
                )}
                {animal.contact_phone && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconPhone size={16} className="text-gray-400 shrink-0" />
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
                    <IconMail size={16} className="text-gray-400 shrink-0" />
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
                      className="text-gray-400 shrink-0"
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
                      className="text-gray-400 shrink-0"
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
                      className="text-gray-400 shrink-0"
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
                        className="text-gray-400 shrink-0"
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
                      className="block rounded-xl overflow-hidden border border-gray-border hover:border-primary transition-colors"
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
      <Dialog
        open={showAdoptForm && !submitted}
        onOpenChange={(open) => {
          if (!open) setShowAdoptForm(false);
        }}
      >
        <DialogContent className="max-w-md space-y-3">
          <DialogHeader>
            <DialogTitle>Заявка на усиновлення</DialogTitle>
            <DialogDescription>
              Вкажіть як з вами зв&apos;язатися
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name */}
            <InputWithIcon icon={<IconUser size={16} />}>
              <Input
                type="text"
                placeholder="Ваше ім'я *"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </InputWithIcon>

            {/* Phone */}
            <InputWithIcon icon={<IconPhone size={16} />}>
              <Input
                type="tel"
                placeholder="Телефон *"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </InputWithIcon>

            {/* Місто */}
            <InputWithIcon icon={<IconMapPin size={16} />}>
              <Input
                type="text"
                placeholder="Місто / район"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </InputWithIcon>

            <Textarea
              placeholder="Розкажіть про себе та умови утримання... *"
              rows={3}
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />

            {/* Dynamic extra contact fields */}
            {visibleContacts.map((type) => (
              <div key={type} className="relative animate-modal-in">
                {type === "email" && (
                  <InputWithIcon icon={<IconMail size={16} />}>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="pr-9"
                    />
                  </InputWithIcon>
                )}
                {type === "instagram" && (
                  <InputWithIcon icon={<IconBrandInstagram size={16} />}>
                    <Input
                      type="text"
                      placeholder="Instagram"
                      value={formData.instagram}
                      onChange={(e) =>
                        setFormData({ ...formData, instagram: e.target.value })
                      }
                      className="pr-9"
                    />
                  </InputWithIcon>
                )}
                {type === "telegram" && (
                  <InputWithIcon icon={<IconBrandTelegram size={16} />}>
                    <Input
                      type="text"
                      placeholder="Telegram"
                      value={formData.telegram}
                      onChange={(e) =>
                        setFormData({ ...formData, telegram: e.target.value })
                      }
                      className="pr-9"
                    />
                  </InputWithIcon>
                )}
                {type === "facebook" && (
                  <InputWithIcon icon={<IconBrandFacebook size={16} />}>
                    <Input
                      type="text"
                      placeholder="Facebook"
                      value={formData.facebook}
                      onChange={(e) =>
                        setFormData({ ...formData, facebook: e.target.value })
                      }
                      className="pr-9"
                    />
                  </InputWithIcon>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    setVisibleContacts(
                      visibleContacts.filter((c) => c !== type),
                    )
                  }
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground"
                >
                  <IconX size={14} />
                </Button>
              </div>
            ))}

            {/* Add contact button */}
            {visibleContacts.length < 4 && (
              <Popover open={addContactOpen} onOpenChange={setAddContactOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 text-[13px] text-gray-medium hover:text-foreground font-normal -ml-3"
                  >
                    <IconCirclePlus size={14} />
                    Додати спосіб зв&apos;язку
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-48 p-1">
                  {!visibleContacts.includes("email") && (
                    <button
                      type="button"
                      onClick={() => {
                        setVisibleContacts([...visibleContacts, "email"]);
                        setAddContactOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-gray-light rounded-lg transition-colors"
                    >
                      <IconMail size={14} className="text-gray-400" />
                      Email
                    </button>
                  )}
                  {!visibleContacts.includes("instagram") && (
                    <button
                      type="button"
                      onClick={() => {
                        setVisibleContacts([...visibleContacts, "instagram"]);
                        setAddContactOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-gray-light rounded-lg transition-colors"
                    >
                      <IconBrandInstagram size={14} className="text-gray-400" />
                      Instagram
                    </button>
                  )}
                  {!visibleContacts.includes("telegram") && (
                    <button
                      type="button"
                      onClick={() => {
                        setVisibleContacts([...visibleContacts, "telegram"]);
                        setAddContactOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-gray-light rounded-lg transition-colors"
                    >
                      <IconBrandTelegram size={14} className="text-gray-400" />
                      Telegram
                    </button>
                  )}
                  {!visibleContacts.includes("facebook") && (
                    <button
                      type="button"
                      onClick={() => {
                        setVisibleContacts([...visibleContacts, "facebook"]);
                        setAddContactOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-gray-light rounded-lg transition-colors"
                    >
                      <IconBrandFacebook size={14} className="text-gray-400" />
                      Facebook
                    </button>
                  )}
                </PopoverContent>
              </Popover>
            )}
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="w-full py-3 h-auto"
            >
              {submitting ? "Надсилання..." : "Надіслати заявку"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success — modal */}
      <Dialog
        open={submitted}
        onOpenChange={(open) => {
          if (!open) setSubmitted(false);
        }}
      >
        <DialogContent className="max-w-sm text-center">
          <div className="animate-modal-success">
            <p className="text-2xl mb-2">💚</p>
            <p className="text-lg font-semibold text-foreground mb-1">
              Дякуємо!
            </p>
            <p className="text-sm text-gray-medium mb-4">
              Вашу заявку отримано. Ми зв&apos;яжемося з вами найближчим часом.
            </p>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => setSubmitted(false)}
            >
              Закрити
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
