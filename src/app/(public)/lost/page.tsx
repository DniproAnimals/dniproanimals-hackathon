"use client";

import { useEffect, useState } from "react";
import ImageFallback from "@/components/ImageFallback";
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
  IconPackage,
} from "@tabler/icons-react";

export default function LostAnimalsPage() {
  const [items, setItems] = useState<LostAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const filter = "lost";
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LostAnimal | null>(null);
  const [detailPhoto, setDetailPhoto] = useState(0);
  const [submitting, setSubmitting] = useState(false);
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/lost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setShowForm(false);
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
      });
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
          onClick={() => { setFormData({ ...formData, type: "lost" }); setShowForm(true); }}
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
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-modal-overlay" onClick={() => setShowForm(false)}>
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-modal-in overflow-hidden"
          >
            {/* Header */}
            <div className="bg-red-500 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <IconSearch size={18} />
                <h3 className="font-semibold">Загубив тварину</h3>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="text-white/70 hover:text-white">
                <IconX size={20} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {/* What */}
              <div>
                <p className="text-xs text-gray-medium mb-1.5">Хто загубився? *</p>
                <input type="text" placeholder="Наприклад: Рудий кіт Мурчик" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
              </div>

              {/* Type + Color */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-medium mb-1.5">Вид</p>
                  <select value={formData.animal_type} onChange={(e) => setFormData({ ...formData, animal_type: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm">
                    <option value="">Оберіть</option>
                    <option value="Собака">🐕 Собака</option>
                    <option value="Кіт">🐈 Кіт</option>
                    <option value="Інше">🐾 Інше</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-medium mb-1.5">Колір</p>
                  <input type="text" placeholder="Рудий, сірий..." value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
                </div>
              </div>

              {/* Where */}
              <div>
                <p className="text-xs text-gray-medium mb-1.5">Де востаннє бачили? *</p>
                <div className="relative">
                  <IconMapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Адреса або район" required value={formData.last_seen_location || formData.location} onChange={(e) => setFormData({ ...formData, last_seen_location: e.target.value, location: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
                </div>
              </div>

              {/* When */}
              <div>
                <p className="text-xs text-gray-medium mb-1.5">Коли?</p>
                <input type="date" value={formData.last_seen_date} onChange={(e) => setFormData({ ...formData, last_seen_date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
              </div>

              {/* Description */}
              <div>
                <p className="text-xs text-gray-medium mb-1.5">Опис та прикмети *</p>
                <textarea placeholder="Зовнішність, нашийник, особливі прикмети..." required rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm resize-none" />
              </div>

              {/* Contact */}
              <div className="pt-1 border-t border-gray-border">
                <p className="text-xs text-gray-medium mb-1.5 mt-2">Ваші контакти *</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <IconUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Ім'я" required value={formData.contact_name} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
                  </div>
                  <div className="relative">
                    <IconPhone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" placeholder="Телефон" required value={formData.contact_phone} onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={submitting} className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">
                {submitting ? "Публікація..." : "Опублікувати оголошення"}
              </button>
            </div>
          </form>
        </div>
      )}

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
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{selectedItem.description}</p>

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
