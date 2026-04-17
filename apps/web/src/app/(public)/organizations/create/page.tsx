"use client";
import ImageFallback from "@/components/ImageFallback";
import { useUser } from "@/shared/lib/UserContext";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconChevronDown,
  IconChevronLeft,
  IconLockFilled,
  IconMailFilled,
  IconMapPinFilled,
  IconPhoneFilled,
  IconPhoto,
  IconPlus,
  IconUserFilled,
  IconWorldWww,
  IconX,
} from "@dniproanimals/icons";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  InputWithIcon,
  Textarea,
} from "@dniproanimals/ui";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const contactTypes = [
  { key: "instagram", label: "Instagram", icon: IconBrandInstagram },
  { key: "telegram", label: "Telegram", icon: IconBrandTelegram },
  { key: "facebook", label: "Facebook", icon: IconBrandFacebook },
  { key: "website", label: "Вебсайт", icon: IconWorldWww },
];

export default function CreateOrgPage() {
  const router = useRouter();
  const { user, refresh } = useUser();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [visibleContacts, setVisibleContacts] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    photo: "",
    location: "",
    phone: "",
    email: "",
    instagram: "",
    telegram: "",
    facebook: "",
    website: "",
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, photo: url }));
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setAuthError("");
    const url = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body =
      authMode === "login"
        ? { email: authForm.email, password: authForm.password }
        : authForm;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) setAuthError(data.error || "Помилка");
    else {
      refresh();
      setShowAuth(false);
    }
    setSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuth(true);
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      refresh();
      router.push("/dashboard");
    }
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto px-6 py-6 pb-24 md:pb-6"
    >
      {/* Header — back + logo */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-gray-medium"
        >
          <IconChevronLeft size={18} />
          Назад
        </Button>
        <Image
          src="/logo.jpg"
          alt="DniproAnimals"
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
        <div className="w-16" /> {/* spacer */}
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-1">Створити організацію</h1>
        <p className="text-sm text-gray-medium">
          Зареєструйте свій притулок на платформі DniproAnimals
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Photo */}
        <div>
          <p className="text-xs text-gray-medium mb-2">Фото організації</p>
          {form.photo ? (
            <div className="relative w-full h-40 rounded-2xl overflow-hidden group">
              <ImageFallback
                src={form.photo}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                shape="pill"
                onClick={() => setForm({ ...form, photo: "" })}
                className="absolute top-2 right-2 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IconX size={14} />
              </Button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-gray-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-green-light/40 transition-colors"
            >
              <IconPhoto size={32} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-medium font-medium">
                {uploading ? "Завантаження..." : "Натисніть, щоб додати фото"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG до 5 МБ</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        {/* Name */}
        <div>
          <p className="text-xs text-gray-medium mb-1.5">Назва організації *</p>
          <Input
            type="text"
            placeholder="Наприклад: Притулок «Друг»"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <p className="text-xs text-gray-medium mb-1.5">Опис</p>
          <Textarea
            placeholder="Розкажіть про діяльність, місію та особливості..."
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Location */}
        <div>
          <p className="text-xs text-gray-medium mb-1.5">Місцезнаходження *</p>
          <InputWithIcon icon={<IconMapPinFilled />}>
            <Input
              type="text"
              placeholder="Місто / адреса"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </InputWithIcon>
        </div>

        {/* Contacts */}
        <div>
          <p className="text-sm font-semibold text-gray-medium uppercase tracking-wider mb-3">
            Контакти
          </p>
          <div className="space-y-2.5">
            {/* Phone */}
            <InputWithIcon icon={<IconPhoneFilled />}>
              <Input
                type="tel"
                placeholder="Телефон *"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </InputWithIcon>

            {/* Email */}
            <InputWithIcon icon={<IconMailFilled />}>
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </InputWithIcon>

            {/* Dynamic contacts */}
            {visibleContacts.map((type) => {
              const ct = contactTypes.find((c) => c.key === type);
              if (!ct) return null;
              const Icon = ct.icon;
              return (
                <div key={type} className="relative animate-modal-in">
                  <InputWithIcon icon={<Icon />}>
                    <Input
                      type={type === "website" ? "url" : "text"}
                      placeholder={ct.label}
                      value={form[type as keyof typeof form]}
                      onChange={(e) =>
                        setForm({ ...form, [type]: e.target.value })
                      }
                      className="pr-9"
                    />
                  </InputWithIcon>
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleContacts(
                        visibleContacts.filter((c) => c !== type),
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground z-10"
                  >
                    <IconX size={14} />
                  </button>
                </div>
              );
            })}

            {/* Add contact — dropdown picker */}
            {visibleContacts.length < contactTypes.length && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-[13px] text-gray-medium hover:text-foreground transition-colors py-1 data-[state=open]:text-foreground [&[data-state=open]_.chevron]:rotate-180"
                  >
                    <IconPlus size={14} />
                    Додати спосіб зв&apos;язку
                    <IconChevronDown
                      size={12}
                      className="chevron transition-transform"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                  {contactTypes
                    .filter((ct) => !visibleContacts.includes(ct.key))
                    .map((ct) => {
                      const Icon = ct.icon;
                      return (
                        <DropdownMenuItem
                          key={ct.key}
                          onSelect={() =>
                            setVisibleContacts([...visibleContacts, ct.key])
                          }
                          className="gap-2.5"
                        >
                          <Icon size={16} className="text-gray-400" />
                          {ct.label}
                        </DropdownMenuItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Auth warning */}
        {!user && (
          <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700 border border-amber-200">
            <p className="font-medium mb-1">Потрібен акаунт</p>
            <p className="text-xs">
              Щоб створити організацію, потрібно увійти або зареєструватися. Вас
              буде призначено власником.
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
          className="w-full text-base py-3.5 h-auto"
        >
          {submitting
            ? "Створення..."
            : user
              ? "Створити організацію"
              : "Увійти та створити"}
        </Button>

        <p className="text-xs text-gray-medium text-center">
          Після створення організація потрапить на модерацію
        </p>
      </form>

      {/* Auth modal */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="max-w-sm">
          <form onSubmit={handleAuth} className="space-y-3">
            <DialogHeader>
              <DialogTitle>
                {authMode === "login" ? "Увійти" : "Реєстрація"}
              </DialogTitle>
              <DialogDescription>
                {authMode === "register"
                  ? "Створіть акаунт, щоб стати власником організації"
                  : "Увійдіть в існуючий акаунт"}
              </DialogDescription>
            </DialogHeader>
            {authMode === "register" && (
              <InputWithIcon icon={<IconUserFilled />}>
                <Input
                  type="text"
                  placeholder="Ваше ім'я"
                  required
                  value={authForm.name}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, name: e.target.value })
                  }
                />
              </InputWithIcon>
            )}
            <InputWithIcon icon={<IconMailFilled />}>
              <Input
                type="email"
                placeholder="Email"
                required
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm({ ...authForm, email: e.target.value })
                }
              />
            </InputWithIcon>
            <InputWithIcon icon={<IconLockFilled />}>
              <Input
                type="password"
                placeholder="Пароль"
                required
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm({ ...authForm, password: e.target.value })
                }
              />
            </InputWithIcon>
            {authError && <p className="text-xs text-red-500">{authError}</p>}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              className="w-full"
            >
              {submitting
                ? "Зачекайте..."
                : authMode === "login"
                  ? "Увійти"
                  : "Зареєструватися"}
            </Button>
            <p className="text-xs text-center text-gray-medium">
              {authMode === "login" ? "Немає акаунту? " : "Вже є акаунт? "}
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === "login" ? "register" : "login");
                  setAuthError("");
                }}
                className="font-medium text-foreground hover:underline"
              >
                {authMode === "login" ? "Зареєструватися" : "Увійти"}
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
