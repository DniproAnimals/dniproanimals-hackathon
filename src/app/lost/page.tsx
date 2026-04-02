"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { LostAnimal } from "@/lib/db";

export default function LostAnimalsPage() {
  const [items, setItems] = useState<LostAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const filter = "lost";
  const [animalTypeFilter, setAnimalTypeFilter] = useState("");
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

  const filteredItems = animalTypeFilter
    ? items.filter((item) => item.animal_type?.toLowerCase().includes(animalTypeFilter.toLowerCase()))
    : items;

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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
          Загубив тварину
        </button>
      </div>

      {/* Filters + count */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex gap-2">
          {["", "Собака", "Кішка", "Кіт"].map((t) => (
            <button
              key={t}
              onClick={() => setAnimalTypeFilter(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                animalTypeFilter === t
                  ? "bg-[#ced48c] text-foreground"
                  : "bg-gray-light text-foreground"
              }`}
            >
              {t || "Всі"}
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-medium">
          {!loading && `${filteredItems.length} оголошень`}
        </span>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-light rounded-2xl animate-pulse h-48" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-gray-light mx-auto flex items-center justify-center mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-lg font-semibold">Оголошень поки немає</p>
          <p className="text-sm text-gray-medium mt-1">Будьте першим — додайте оголошення</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const photos: string[] = JSON.parse(item.photos || "[]");
            return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-2xl border border-gray-border overflow-hidden text-left hover:border-[#ced48c] hover:shadow-md transition-all"
              >
                {photos[0] && (
                  <div className="relative w-full h-40 bg-gray-light">
                    <Image
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
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {item.location}
                      </span>
                    )}
                    {item.animal_type && (
                      <span className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20"/></svg>
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
            className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3 shadow-xl animate-modal-in"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <h3 className="font-semibold text-lg">Загубив тварину</h3>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-foreground transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <input type="text" placeholder="Заголовок *" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
            </div>

            {/* Animal info */}
            <div className="grid grid-cols-2 gap-2">
              <select value={formData.animal_type} onChange={(e) => setFormData({ ...formData, animal_type: e.target.value })} className="px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm text-foreground">
                <option value="">Вид тварини</option>
                <option value="Собака">Собака</option>
                <option value="Кішка">Кішка</option>
                <option value="Інше">Інше</option>
              </select>
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                <input type="text" placeholder="Порода" value={formData.breed} onChange={(e) => setFormData({ ...formData, breed: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select value={formData.sex} onChange={(e) => setFormData({ ...formData, sex: e.target.value })} className="px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm text-foreground">
                <option value="">Стать</option>
                <option value="male">Хлопчик</option>
                <option value="female">Дівчинка</option>
              </select>
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20"/></svg>
                <input type="text" placeholder="Колір" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
              </div>
              <select value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} className="px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm text-foreground">
                <option value="">Розмір</option>
                <option value="small">Малий</option>
                <option value="medium">Середній</option>
                <option value="large">Великий</option>
              </select>
            </div>

            {/* Location */}
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <input type="text" placeholder="Район проживання *" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
            </div>

            {/* Last seen */}
            <p className="text-xs font-medium text-gray-medium pt-1">Де востаннє бачили?</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <input type="text" placeholder="Місце" value={formData.last_seen_location} onChange={(e) => setFormData({ ...formData, last_seen_location: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
              </div>
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <input type="date" value={formData.last_seen_date} onChange={(e) => setFormData({ ...formData, last_seen_date: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
              </div>
            </div>

            <textarea placeholder="Опис (зовнішність, особливі прикмети) *" required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm resize-none" />

            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" placeholder="Ваше ім'я *" required value={formData.contact_name} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
              </div>
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                <input type="tel" placeholder="Телефон *" required value={formData.contact_phone} onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-[#ced48c] text-foreground py-3 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50">
              {submitting ? "Публікація..." : "Опублікувати"}
            </button>
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
                      <Image src={detailPhotos[detailPhoto]} alt={selectedItem.title} fill className="object-cover" sizes="400px" />
                      {detailPhotos.length > 1 && (
                        <>
                          <button onClick={() => setDetailPhoto((p) => (p - 1 + detailPhotos.length) % detailPhotos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-white">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                          </button>
                          <button onClick={() => setDetailPhoto((p) => (p + 1) % detailPhotos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-white">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
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
                            <Image src={p} alt="" fill className="object-cover" sizes="56px" />
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
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{selectedItem.description}</p>

                  {/* Meta */}
                  <div className="divide-y divide-gray-border mb-4">
                    {selectedItem.animal_type && (
                      <div className="flex items-center gap-2.5 py-2">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                        <span className="text-sm font-medium">Вид</span>
                        <span className="text-sm text-gray-medium ml-auto">{selectedItem.animal_type}</span>
                      </div>
                    )}
                    {selectedItem.breed && (
                      <div className="flex items-center gap-2.5 py-2">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                        <span className="text-sm font-medium">Порода</span>
                        <span className="text-sm text-gray-medium ml-auto">{selectedItem.breed}</span>
                      </div>
                    )}
                    {selectedItem.sex && (
                      <div className="flex items-center gap-2.5 py-2">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span className="text-sm font-medium">Стать</span>
                        <span className="text-sm text-gray-medium ml-auto">{selectedItem.sex === "male" ? "Хлопчик" : "Дівчинка"}</span>
                      </div>
                    )}
                    {selectedItem.color && (
                      <div className="flex items-center gap-2.5 py-2">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20"/></svg>
                        <span className="text-sm font-medium">Колір</span>
                        <span className="text-sm text-gray-medium ml-auto">{selectedItem.color}</span>
                      </div>
                    )}
                    {selectedItem.size && (
                      <div className="flex items-center gap-2.5 py-2">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
                        <span className="text-sm font-medium">Розмір</span>
                        <span className="text-sm text-gray-medium ml-auto">{selectedItem.size === "small" ? "Малий" : selectedItem.size === "medium" ? "Середній" : "Великий"}</span>
                      </div>
                    )}
                    {selectedItem.location && (
                      <div className="flex items-center gap-2.5 py-2">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span className="text-sm font-medium">Місцезнаходження</span>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedItem.location)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-medium ml-auto hover:underline">{selectedItem.location}</a>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 py-2">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
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
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 flex-shrink-0"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedItem.last_seen_location)}`} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">{selectedItem.last_seen_location}</a>
                          </div>
                        )}
                        {selectedItem.last_seen_date && (
                          <div className="flex items-center gap-2 text-sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 flex-shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
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
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span className="font-medium">{selectedItem.contact_name}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
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
