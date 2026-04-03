"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import Image from "next/image";
import ImageFallback from "@/components/ImageFallback";
import {
  IconUserFilled, IconHomeFilled, IconChevronLeft,
  IconMapPinFilled, IconPhoneFilled, IconMailFilled,
  IconBrandInstagram, IconBrandTelegram, IconBrandFacebook,
  IconWorldWww, IconX, IconPhoto, IconPlus, IconChevronDown,
} from "@tabler/icons-react";

const contactTypes = [
  { key: "instagram", label: "Instagram", icon: IconBrandInstagram },
  { key: "telegram", label: "Telegram", icon: IconBrandTelegram },
  { key: "facebook", label: "Facebook", icon: IconBrandFacebook },
  { key: "website", label: "Вебсайт", icon: IconWorldWww },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading, refresh } = useUser();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"choose" | "org">("choose");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [visibleContacts, setVisibleContacts] = useState<string[]>([]);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", photo: "", location: "",
    phone: "", email: "", instagram: "", telegram: "", facebook: "", website: "",
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

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
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

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  if (!user) {
    router.replace("/auth");
    return null;
  }

  // Step 1: Choose path
  if (step === "choose") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Image src="/logo.jpg" alt="DniproAnimals" width={48} height={48} className="rounded-full object-cover mb-3" />
            <h1 className="text-xl font-bold text-foreground mb-1">Вітаємо, {user.name}!</h1>
            <p className="text-sm text-gray-medium text-center">Як ви плануєте використовувати платформу?</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-white rounded-2xl border border-gray-border p-5 text-left hover:border-[#ced48c] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-light flex items-center justify-center shrink-0 group-hover:bg-[#ced48c]/20 transition-colors">
                  <IconUserFilled size={24} className="text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Особисте використання</p>
                  <p className="text-xs text-gray-medium mt-0.5">Шукати тварин, додавати в обране, допомагати</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setStep("org")}
              className="w-full bg-white rounded-2xl border border-gray-border p-5 text-left hover:border-[#ced48c] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-light flex items-center justify-center shrink-0 group-hover:bg-[#ced48c]/20 transition-colors">
                  <IconHomeFilled size={24} className="text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Створити організацію</p>
                  <p className="text-xs text-gray-medium mt-0.5">Зареєструвати притулок або волонтерську організацію</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const iconInput = "w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm";

  // Step 2: Create org form (same style as /organizations/create)
  return (
    <div className="max-w-2xl mx-auto px-6 py-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setStep("choose")} className="flex items-center gap-1.5 text-gray-medium hover:text-foreground transition-colors text-sm">
          <IconChevronLeft size={18} />
          Назад
        </button>
        <Image src="/logo.jpg" alt="DniproAnimals" width={36} height={36} className="rounded-full object-cover" />
        <div className="w-16" />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-1">Створити організацію</h1>
        <p className="text-sm text-gray-medium">Зареєструйте свій притулок на платформі DniproAnimals</p>
      </div>

      <form onSubmit={handleCreateOrg} className="space-y-5">
        {/* Photo */}
        <div>
          <p className="text-xs text-gray-medium mb-2">Фото організації</p>
          {form.photo ? (
            <div className="relative w-full h-40 rounded-2xl overflow-hidden group">
              <ImageFallback src={form.photo} alt="" fill className="object-cover" sizes="100vw" />
              <button type="button" onClick={() => setForm({ ...form, photo: "" })} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <IconX size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-gray-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#ced48c] hover:bg-[#ced48c]/5 transition-colors"
            >
              <IconPhoto size={32} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-medium font-medium">{uploading ? "Завантаження..." : "Натисніть, щоб додати фото"}</p>
              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG до 5 МБ</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handlePhotoUpload} className="hidden" />
        </div>

        {/* Name */}
        <div>
          <p className="text-xs text-gray-medium mb-1.5">Назва організації *</p>
          <input type="text" placeholder="Наприклад: Притулок «Друг»" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
        </div>

        {/* Description */}
        <div>
          <p className="text-xs text-gray-medium mb-1.5">Опис</p>
          <textarea placeholder="Розкажіть про діяльність, місію та особливості..." rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm resize-none" />
        </div>

        {/* Location */}
        <div>
          <p className="text-xs text-gray-medium mb-1.5">Місцезнаходження *</p>
          <div className="relative">
            <IconMapPinFilled size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Місто / адреса" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={iconInput} />
          </div>
        </div>

        {/* Contacts */}
        <div>
          <p className="text-sm font-semibold text-gray-medium uppercase tracking-wider mb-3">Контакти</p>
          <div className="space-y-2.5">
            <div className="relative">
              <IconPhoneFilled size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" placeholder="Телефон *" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={iconInput} />
            </div>
            <div className="relative">
              <IconMailFilled size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={iconInput} />
            </div>

            {/* Dynamic contacts */}
            {visibleContacts.map((type) => {
              const ct = contactTypes.find((c) => c.key === type);
              if (!ct) return null;
              const Icon = ct.icon;
              return (
                <div key={type} className="relative animate-modal-in">
                  <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={type === "website" ? "url" : "text"}
                    placeholder={ct.label}
                    value={form[type as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [type]: e.target.value })}
                    className={`${iconInput} pr-9`}
                  />
                  <button type="button" onClick={() => setVisibleContacts(visibleContacts.filter((c) => c !== type))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground">
                    <IconX size={14} />
                  </button>
                </div>
              );
            })}

            {/* Add contact picker */}
            {visibleContacts.length < contactTypes.length && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowContactPicker(!showContactPicker)}
                  className="flex items-center gap-1.5 text-[13px] text-gray-medium hover:text-foreground transition-colors py-1"
                >
                  <IconPlus size={14} />
                  Додати спосіб зв&apos;язку
                  <IconChevronDown size={12} className={`transition-transform ${showContactPicker ? "rotate-180" : ""}`} />
                </button>
                {showContactPicker && (
                  <div className="absolute left-0 top-full mt-1 bg-white rounded-xl border border-gray-border shadow-lg z-20 py-1 w-52 animate-modal-in">
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
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-gray-light transition-colors"
                          >
                            <Icon size={16} className="text-gray-400" />
                            {ct.label}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={submitting} className="w-full bg-[#ced48c] text-foreground py-3.5 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50 text-base">
          {submitting ? "Створення..." : "Створити організацію"}
        </button>

        <p className="text-xs text-gray-medium text-center">Після створення організація потрапить на модерацію</p>
      </form>
    </div>
  );
}
