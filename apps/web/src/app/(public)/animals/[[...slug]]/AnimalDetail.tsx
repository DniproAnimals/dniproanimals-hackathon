"use client";
import ImageFallback from "@/shared/components/ImageFallback";
import {
  useAnimalQuery,
  useCreateAdoptionMutation,
  useDeleteAnimalMutation,
  useFavoritesQuery,
  useMeQuery,
  useToggleFavoriteMutation,
} from "@/shared/query-hooks";
import { endpoints } from "@dniproanimals/endpoints";
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
} from "@dniproanimals/icons";
import {
  Badge,
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  InputWithIcon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@dniproanimals/ui";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

const colorMap: Record<string, string> = {
  білий: "#ffffff",
  чорний: "#1a1a1a",
  рудий: "#c45e1a",
  сірий: "#9e9e9e",
  коричневий: "#6d4c2e",
};

function getColorStyle(color: string): string {
  return colorMap[color.toLowerCase().trim()] || "#ced48c";
}

export default function AnimalDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const animalId = Number(id);
  const { data, isLoading: loading } = useAnimalQuery(animalId, {
    enabled: !!animalId,
  });
  const animal = data ?? null;
  const org = data?.org ?? null;
  const { data: user } = useMeQuery();
  const { data: favorites } = useFavoritesQuery({ enabled: !!user });
  const toggleFavMut = useToggleFavoriteMutation();
  const deleteMut = useDeleteAnimalMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoints.animals.list()] });
      router.push("/");
    },
  });
  const adoptionMut = useCreateAdoptionMutation({
    onSuccess: () => setSubmitted(true),
  });

  const [activePhoto, setActivePhoto] = useState(0);
  const [showAdoptForm, setShowAdoptForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
  const [visibleContacts, setVisibleContacts] = useState<string[]>(["email"]);
  const [addContactOpen, setAddContactOpen] = useState(false);

  const isFav = animal ? (favorites ?? []).some((f) => f.id === animal.id) : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!animal) return;
    adoptionMut.mutate({ animalId: animal.id, ...formData });
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

  const photos: string[] = animal.photos ?? [];
  const colorStyle = animal.color ? getColorStyle(animal.color) : null;
  const isGradient = colorStyle?.includes("gradient");

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-10">
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
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {photos.length > 0 ? (
            <>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-light group/photo">
                <ImageFallback
                  src={photos[activePhoto]!}
                  alt={animal.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {photos.length > 1 && (
                  <>
                    <Button
                      
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
              {animal.type === "dog" ? "🐕" : animal.type === "cat" ? "🐈" : "🐾"}
            </div>
          )}

          {animal.description && (
            <div className="mt-5">
              <h2 className="text-sm font-semibold mb-2">Інформація</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {animal.description}
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="mt-6 md:mt-0"
        >
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
                  
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => toggleFavMut.mutate({ animalId: animal.id })}
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
                    onClick={() => {
                      if (!confirm("Видалити цю тварину?")) return;
                      deleteMut.mutate(animal.id);
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
            {animal.sex && (
              <div className="flex items-center gap-2.5 py-3">
                <IconUser size={16} className="text-gray-400 shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  Стать
                </span>
                <span className="text-sm text-gray-medium ml-auto">
                  {animal.sex === "male" ? "Хлопчик" : "Дівчинка"}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2.5 py-3">
              <IconCalendar size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm font-medium text-foreground">Вік</span>
              <span className="text-sm text-gray-medium ml-auto">
                {getAgeLabel(animal.ageMonths)}
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
            {animal.weightKg && (
              <div className="flex items-center gap-2.5 py-3">
                <IconWeight size={16} className="text-gray-400 shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  Вага
                </span>
                <span className="text-sm text-gray-medium ml-auto">
                  {animal.weightKg} кг
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

          {(animal.contactName ||
            animal.contactPhone ||
            animal.contactEmail ||
            animal.contactInstagram ||
            animal.contactTelegram ||
            animal.contactFacebook ||
            animal.contactLocation) && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-3">Контакти</h2>
              <div className="space-y-2.5">
                {animal.contactName && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconUser size={16} className="text-gray-400 shrink-0" />
                    <span className="text-foreground font-medium">
                      {animal.contactName}
                    </span>
                  </div>
                )}
                {animal.contactPhone && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconPhone size={16} className="text-gray-400 shrink-0" />
                    <a
                      href={`tel:${animal.contactPhone}`}
                      className="text-foreground hover:underline"
                    >
                      {animal.contactPhone}
                    </a>
                  </div>
                )}
                {animal.contactEmail && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconMail size={16} className="text-gray-400 shrink-0" />
                    <a
                      href={`mailto:${animal.contactEmail}`}
                      className="text-foreground hover:underline"
                    >
                      {animal.contactEmail}
                    </a>
                  </div>
                )}
                {animal.contactInstagram && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconBrandInstagram
                      size={16}
                      className="text-gray-400 shrink-0"
                    />
                    <a
                      href={`https://instagram.com/${animal.contactInstagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline"
                    >
                      @{animal.contactInstagram}
                    </a>
                  </div>
                )}
                {animal.contactTelegram && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconBrandTelegram
                      size={16}
                      className="text-gray-400 shrink-0"
                    />
                    <a
                      href={`https://t.me/${animal.contactTelegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline"
                    >
                      @{animal.contactTelegram}
                    </a>
                  </div>
                )}
                {animal.contactFacebook && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <IconBrandFacebook
                      size={16}
                      className="text-gray-400 shrink-0"
                    />
                    <a
                      href={`https://facebook.com/${animal.contactFacebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline"
                    >
                      {animal.contactFacebook}
                    </a>
                  </div>
                )}
                {animal.contactLocation && (
                  <div className="pt-1">
                    <div className="flex items-center gap-2.5 text-sm mb-2">
                      <IconMapPin
                        size={16}
                        className="text-gray-400 shrink-0"
                      />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(animal.contactLocation)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:underline"
                      >
                        {animal.contactLocation}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

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

            {visibleContacts.length < 4 && (
              <Popover open={addContactOpen} onOpenChange={setAddContactOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 text-[13px] text-gray-medium hover:text-foreground font-normal -ml-3"
                  >
                    <IconCirclePlus size={14} />
                    Додати спосіб зв&apos;язку
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-48 p-1">
                  {(
                    ["email", "instagram", "telegram", "facebook"] as const
                  ).map((t) =>
                    visibleContacts.includes(t) ? null : (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setVisibleContacts([...visibleContacts, t]);
                          setAddContactOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-gray-light rounded-lg transition-colors"
                      >
                        {t}
                      </button>
                    ),
                  )}
                </PopoverContent>
              </Popover>
            )}
            <Button
              type="submit"
              variant="primary"
              disabled={adoptionMut.isPending}
              className="w-full py-3 h-auto"
            >
              {adoptionMut.isPending ? "Надсилання..." : "Надіслати заявку"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

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
