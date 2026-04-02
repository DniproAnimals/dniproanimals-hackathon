"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { LostAnimal } from "@/lib/db";

export default function LostAnimalsPage() {
  const [items, setItems] = useState<LostAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"" | "lost" | "found">("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "lost" as "lost" | "found",
    animal_type: "",
    location: "",
    contact_name: "",
    contact_phone: "",
  });

  const fetchItems = () => {
    const params = filter ? `?type=${filter}` : "";
    fetch(`/api/lost${params}`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, [filter]);

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
        location: "",
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
          onClick={() => setShowForm(!showForm)}
          className="bg-[#ced48c] text-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#b8be72] transition-colors"
        >
          + Додати оголошення
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-light rounded-2xl p-5 mb-6 space-y-3 max-w-2xl"
        >
          <div className="flex gap-2">
            {(["lost", "found"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  formData.type === t
                    ? t === "lost"
                      ? "bg-red-500 text-white"
                      : "bg-green-accent text-white"
                    : "bg-white text-foreground"
                }`}
              >
                {t === "lost" ? "Загубив" : "Знайшов"}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Заголовок"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-border focus:ring-2 focus:ring-green-primary/30 outline-none text-sm"
          />
          <textarea
            placeholder="Опис тварини (зовнішність, де загублено/знайдено)"
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-border focus:ring-2 focus:ring-green-primary/30 outline-none text-sm resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Вид тварини"
              value={formData.animal_type}
              onChange={(e) => setFormData({ ...formData, animal_type: e.target.value })}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-border focus:ring-2 focus:ring-green-primary/30 outline-none text-sm"
            />
            <input
              type="text"
              placeholder="Місце"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-border focus:ring-2 focus:ring-green-primary/30 outline-none text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Ваше ім'я"
              required
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-border focus:ring-2 focus:ring-green-primary/30 outline-none text-sm"
            />
            <input
              type="tel"
              placeholder="Телефон"
              required
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-border focus:ring-2 focus:ring-green-primary/30 outline-none text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#ced48c] text-foreground py-3 rounded-xl font-medium hover:bg-[#b8be72] transition-colors disabled:opacity-50 text-sm"
            >
              {submitting ? "Публікація..." : "Опублікувати"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-3 rounded-xl bg-white border border-gray-border text-sm"
            >
              Скасувати
            </button>
          </div>
        </form>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { value: "" as const, label: "Всі" },
          { value: "lost" as const, label: "Загублені" },
          { value: "found" as const, label: "Знайдені" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === tab.value
                ? "bg-[#ced48c] text-foreground"
                : "bg-gray-light text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-light rounded-2xl animate-pulse h-28" />
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
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => {
            const photos: string[] = JSON.parse(item.photos || "[]");
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-border p-4 flex gap-3.5"
              >
                {photos[0] && (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-light">
                    <Image
                      src={photos[0]}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        item.type === "lost"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-light text-green-accent"
                      }`}
                    >
                      {item.type === "lost" ? "Загублено" : "Знайдено"}
                    </span>
                    {item.animal_type && (
                      <span className="text-[10px] text-gray-medium">{item.animal_type}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                  <p className="text-xs text-gray-medium line-clamp-2 mt-0.5">{item.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                    {item.location && <span>📍 {item.location}</span>}
                    <span>📞 {item.contact_phone}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
