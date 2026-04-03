"use client";

import { useEffect, useState, useRef } from "react";
import { useDashboard } from "../layout";
import ImageFallback from "@/components/ImageFallback";
import {
  IconMapPinFilled, IconPhoneFilled, IconMailFilled,
  IconBrandInstagram, IconBrandTelegram, IconBrandFacebook,
  IconWorldWww, IconX, IconPhoto, IconPlus, IconChevronDown,
  IconCheck,
} from "@tabler/icons-react";

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
  const [visibleContacts, setVisibleContacts] = useState<string[]>([]);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", photo: "", location: "",
    phone: "", email: "", instagram: "", telegram: "", facebook: "", website: "",
  });

  useEffect(() => {
    if (org) {
      const contacts: string[] = [];
      if (org.instagram) contacts.push("instagram");
      if (org.telegram) contacts.push("telegram");
      if (org.facebook) contacts.push("facebook");
      if (org.website) contacts.push("website");
      setVisibleContacts(contacts);
      setForm({
        name: org.name || "",
        description: org.description || "",
        photo: org.photo || "",
        location: org.location || "",
        phone: org.phone || "",
        email: org.email || "",
        instagram: org.instagram || "",
        telegram: org.telegram || "",
        facebook: org.facebook || "",
        website: org.website || "",
      });
    }
  }, [org]);

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
        <h1 className="text-2xl font-bold text-foreground mb-4">Налаштування</h1>
        <p className="text-gray-500">Тільки власник організації може змінювати налаштування.</p>
      </div>
    );
  }

  const iconInput = "w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm";

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Налаштування організації</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
        </div>

        {/* Name */}
        <div>
          <p className="text-xs text-gray-medium mb-1.5">Назва організації *</p>
          <input type="text" placeholder="Назва" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
        </div>

        {/* Description */}
        <div>
          <p className="text-xs text-gray-medium mb-1.5">Опис</p>
          <textarea placeholder="Розкажіть про діяльність, місію та особливості..." rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm resize-none" />
        </div>

        {/* Location */}
        <div>
          <p className="text-xs text-gray-medium mb-1.5">Місцезнаходження</p>
          <div className="relative">
            <IconMapPinFilled size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Місто / адреса" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={iconInput} />
          </div>
        </div>

        {/* Contacts */}
        <div>
          <p className="text-sm font-semibold text-gray-medium uppercase tracking-wider mb-3">Контакти</p>
          <div className="space-y-2.5">
            <div className="relative">
              <IconPhoneFilled size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" placeholder="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={iconInput} />
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
                <div key={type} className="relative">
                  <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={type === "website" ? "url" : "text"}
                    placeholder={ct.label}
                    value={form[type as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [type]: e.target.value })}
                    className={`${iconInput} pr-9`}
                  />
                  <button type="button" onClick={() => { setVisibleContacts(visibleContacts.filter((c) => c !== type)); setForm({ ...form, [type]: "" }); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground">
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

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={submitting} className="px-6 py-3 rounded-xl text-sm font-semibold bg-[#ced48c] text-foreground hover:bg-[#b8be72] transition-colors disabled:opacity-50">
            {submitting ? "Зачекайте..." : "Зберегти зміни"}
          </button>
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
