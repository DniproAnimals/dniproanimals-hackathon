"use client";
import ImageFallback from "@/components/ImageFallback";
import {
  Button,
  Input,
  InputWithIcon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@/components/ui";
import { cn } from "@/shared/lib/utils";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconCheck,
  IconChevronDown,
  IconMailFilled,
  IconMapPinFilled,
  IconPhoneFilled,
  IconPhoto,
  IconPlus,
  IconWorldWww,
  IconX,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useDashboard } from "../layout";

const contactTypes = [
  { key: "instagram", label: "Instagram", icon: IconBrandInstagram },
  { key: "telegram", label: "Telegram", icon: IconBrandTelegram },
  { key: "facebook", label: "Facebook", icon: IconBrandFacebook },
  { key: "website", label: "Вебсайт", icon: IconWorldWww },
];

export default function SettingsPage() {
  const { org, isOwner, refreshOrg } = useDashboard();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const buildVisibleContacts = (o: typeof org): string[] => {
    const contacts: string[] = [];
    if (!o) return contacts;
    if (o.instagram) contacts.push("instagram");
    if (o.telegram) contacts.push("telegram");
    if (o.facebook) contacts.push("facebook");
    if (o.website) contacts.push("website");
    return contacts;
  };

  const buildForm = (o: typeof org) => ({
    name: o?.name || "",
    description: o?.description || "",
    photo: o?.photo || "",
    location: o?.location || "",
    phone: o?.phone || "",
    email: o?.email || "",
    instagram: o?.instagram || "",
    telegram: o?.telegram || "",
    facebook: o?.facebook || "",
    website: o?.website || "",
  });

  const [visibleContacts, setVisibleContacts] = useState<string[]>(() =>
    buildVisibleContacts(org),
  );
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [form, setForm] = useState(() => buildForm(org));
  const [syncedOrgId, setSyncedOrgId] = useState(org?.id);

  if (org?.id !== syncedOrgId) {
    setSyncedOrgId(org?.id);
    setVisibleContacts(buildVisibleContacts(org));
    setForm(buildForm(org));
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSaved(false);
    const res = await fetch("/api/organizations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSaved(true);
      refreshOrg();
      setTimeout(() => setSaved(false), 3000);
    }
    setSubmitting(false);
  };

  if (!isOwner) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Налаштування
        </h1>
        <p className="text-gray-medium">
          Тільки власник організації може змінювати налаштування.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Налаштування організації
      </h1>

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
              <button
                type="button"
                onClick={() => setForm({ ...form, photo: "" })}
                className="absolute top-2 right-2 size-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IconX size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-gray-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <IconPhoto size={32} className="text-gray-medium mb-2" />
              <p className="text-sm text-gray-medium font-medium">
                {uploading ? "Завантаження..." : "Натисніть, щоб додати фото"}
              </p>
              <p className="text-xs text-gray-medium mt-0.5">
                JPG, PNG до 5 МБ
              </p>
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
            placeholder="Назва"
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
          <p className="text-xs text-gray-medium mb-1.5">Місцезнаходження</p>
          <InputWithIcon icon={<IconMapPinFilled />}>
            <Input
              type="text"
              placeholder="Місто / адреса"
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
            <InputWithIcon icon={<IconPhoneFilled />}>
              <Input
                type="tel"
                placeholder="Телефон"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </InputWithIcon>
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
                <InputWithIcon key={type} icon={<Icon />}>
                  <div className="relative">
                    <Input
                      type={type === "website" ? "url" : "text"}
                      placeholder={ct.label}
                      value={form[type as keyof typeof form]}
                      onChange={(e) =>
                        setForm({ ...form, [type]: e.target.value })
                      }
                      className="pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setVisibleContacts(
                          visibleContacts.filter((c) => c !== type),
                        );
                        setForm({ ...form, [type]: "" });
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-foreground"
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                </InputWithIcon>
              );
            })}

            {/* Add contact picker */}
            {visibleContacts.length < contactTypes.length && (
              <Popover
                open={showContactPicker}
                onOpenChange={setShowContactPicker}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-[13px] text-gray-medium hover:text-foreground transition-colors py-1"
                  >
                    <IconPlus size={14} />
                    Додати спосіб зв&apos;язку
                    <IconChevronDown
                      size={12}
                      className={cn(
                        "transition-transform",
                        showContactPicker && "rotate-180",
                      )}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-52 p-1">
                  {contactTypes
                    .filter((ct) => !visibleContacts.includes(ct.key))
                    .map((ct) => {
                      const Icon = ct.icon;
                      return (
                        <button
                          key={ct.key}
                          type="button"
                          onClick={() => {
                            setVisibleContacts([...visibleContacts, ct.key]);
                            setShowContactPicker(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-gray-light rounded-lg transition-colors"
                        >
                          <Icon size={16} className="text-gray-medium" />
                          {ct.label}
                        </button>
                      );
                    })}
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
          >
            {submitting ? "Зачекайте..." : "Зберегти зміни"}
          </Button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <IconCheck size={16} />
              Збережено!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
