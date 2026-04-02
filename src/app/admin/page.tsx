"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Animal, AdoptionRequest } from "@/lib/db";

type Tab = "animals" | "requests" | "add";

type AnimalForm = {
  name: string;
  description: string;
  type: "dog" | "cat" | "other";
  breed: string;
  sex: "male" | "female";
  age_months: string;
  weight_kg: string;
  size: "small" | "medium" | "large";
  color: string;
  vaccinated: boolean;
  sterilized: boolean;
  trained: boolean;
  photos: string[];
  status: "available" | "adopted" | "reserved";
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  contact_instagram: string;
  contact_telegram: string;
  contact_facebook: string;
  contact_location: string;
};

const emptyAnimal: AnimalForm = {
  name: "",
  description: "",
  type: "dog",
  breed: "",
  sex: "male",
  age_months: "",
  weight_kg: "",
  size: "medium",
  color: "",
  vaccinated: false,
  sterilized: false,
  trained: false,
  photos: [],
  status: "available",
  contact_name: "",
  contact_phone: "",
  contact_email: "",
  contact_instagram: "",
  contact_telegram: "",
  contact_facebook: "",
  contact_location: "",
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("animals");
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [requests, setRequests] = useState<(AdoptionRequest & { animal_name: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyAnimal);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchAnimals = () => {
    fetch("/api/animals")
      .then((r) => r.json())
      .then(setAnimals)
      .finally(() => setLoading(false));
  };

  const fetchRequests = () => {
    fetch("/api/adoption")
      .then((r) => r.json())
      .then(setRequests);
  };

  useEffect(() => {
    fetchAnimals();
    fetchRequests();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setForm({ ...form, photos: [...form.photos, url] });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const body = {
      ...form,
      age_months: form.age_months ? Number(form.age_months) : null,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
    };

    const url = editingId ? `/api/animals/${editingId}` : "/api/animals";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setForm(emptyAnimal);
      setEditingId(null);
      setTab("animals");
      fetchAnimals();
    }
    setSubmitting(false);
  };

  const handleEdit = (animal: Animal) => {
    setForm({
      name: animal.name,
      description: animal.description || "",
      type: animal.type,
      breed: animal.breed || "",
      sex: animal.sex || "male",
      age_months: animal.age_months?.toString() || "",
      weight_kg: animal.weight_kg?.toString() || "",
      size: animal.size || "medium",
      color: animal.color || "",
      vaccinated: animal.vaccinated === 1,
      sterilized: animal.sterilized === 1,
      trained: animal.trained === 1,
      photos: JSON.parse(animal.photos || "[]"),
      status: animal.status,
      contact_name: animal.contact_name || "",
      contact_phone: animal.contact_phone || "",
      contact_email: animal.contact_email || "",
      contact_instagram: animal.contact_instagram || "",
      contact_telegram: animal.contact_telegram || "",
      contact_facebook: animal.contact_facebook || "",
      contact_location: animal.contact_location || "",
    });
    setEditingId(animal.id);
    setTab("add");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити цю тварину?")) return;
    await fetch(`/api/animals/${id}`, { method: "DELETE" });
    fetchAnimals();
  };

  const handleSeed = async () => {
    await fetch("/api/seed", { method: "POST" });
    fetchAnimals();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">Панель адміністратора</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { id: "animals" as const, label: "Тварини", count: animals.length },
          { id: "requests" as const, label: "Заявки", count: requests.length },
          {
            id: "add" as const,
            label: editingId ? "Редагувати" : "+ Додати",
          },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              if (t.id === "add" && !editingId) {
                setForm(emptyAnimal);
              }
              setTab(t.id);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-[#ced48c] text-foreground"
                : "text-foreground bg-gray-light"
            }`}
          >
            {t.label}
            {"count" in t && t.count !== undefined && (
              <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                {t.count}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={handleSeed}
          className="ml-auto px-3 py-2 rounded-full text-xs text-gray-400 hover:text-green-primary hover:bg-green-light transition-colors"
        >
          🌱 Демо-дані
        </button>
      </div>

      {/* Animals list */}
      {tab === "animals" && (
        <div>
          {loading ? (
            <p className="text-gray-500">Завантаження...</p>
          ) : animals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Тварин ще немає</p>
              <button
                onClick={() => setTab("add")}
                className="bg-[#ced48c] text-foreground px-4 py-2 rounded-xl"
              >
                Додати першу тварину
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {animals.map((animal) => {
                const photos: string[] = JSON.parse(animal.photos || "[]");
                return (
                  <div
                    key={animal.id}
                    className="flex items-center gap-3.5 bg-white rounded-3xl border border-gray-border p-3.5"
                  >
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gray-light flex-shrink-0">
                      {photos[0] ? (
                        <Image
                          src={photos[0]}
                          alt={animal.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full text-2xl">
                          {animal.type === "dog" ? "🐕" : "🐈"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{animal.name}</p>
                      <p className="text-xs text-gray-500">
                        {animal.breed || "Мікс"} · {animal.sex === "male" ? "♂" : "♀"} ·{" "}
                        {animal.status === "available"
                          ? "Доступний"
                          : animal.status === "adopted"
                            ? "Прилаштовано"
                            : "Зарезервовано"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(animal)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm hover:bg-blue-100 transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(animal.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Adoption Requests */}
      {tab === "requests" && (
        <div>
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Заявок ще немає</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-gray-border p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{req.name}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "approved"
                            ? "bg-green-light text-green-primary"
                            : "bg-red-100 text-red-600"
                      }`}
                    >
                      {req.status === "pending"
                        ? "Очікує"
                        : req.status === "approved"
                          ? "Схвалено"
                          : "Відхилено"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    Тварина: <span className="font-medium">{req.animal_name}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    📧 {req.email} · 📞 {req.phone}
                  </p>
                  {req.message && (
                    <p className="text-sm text-gray-600 mt-2 bg-gray-light rounded-lg p-2">
                      {req.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(req.created_at).toLocaleDateString("uk-UA")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit form */}
      {tab === "add" && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <h2 className="text-xl font-semibold">
            {editingId ? "Редагувати тварину" : "Додати нову тварину"}
          </h2>

          <input
            type="text"
            placeholder="Ім'я *"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
          />

          <textarea
            placeholder="Опис"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none resize-none"
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as "dog" | "cat" | "other",
                })
              }
              className="px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
            >
              <option value="dog">🐕 Собака</option>
              <option value="cat">🐈 Кіт</option>
              <option value="other">🐾 Інше</option>
            </select>
            <select
              value={form.sex}
              onChange={(e) =>
                setForm({
                  ...form,
                  sex: e.target.value as "male" | "female",
                })
              }
              className="px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
            >
              <option value="male">♂ Хлопчик</option>
              <option value="female">♀ Дівчинка</option>
            </select>
            <select
              value={form.size}
              onChange={(e) =>
                setForm({
                  ...form,
                  size: e.target.value as "small" | "medium" | "large",
                })
              }
              className="px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
            >
              <option value="small">Малий</option>
              <option value="medium">Середній</option>
              <option value="large">Великий</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Порода"
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
              className="px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
            />
            <input
              type="number"
              placeholder="Вік (міс.)"
              value={form.age_months}
              onChange={(e) =>
                setForm({ ...form, age_months: e.target.value })
              }
              className="px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Вага (кг)"
              value={form.weight_kg}
              onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
              className="px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
            />
            <input
              type="text"
              placeholder="Колір"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.vaccinated}
                onChange={(e) =>
                  setForm({ ...form, vaccinated: e.target.checked })
                }
                className="w-4 h-4 accent-green-600"
              />
              💉 Вакциновано
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.sterilized}
                onChange={(e) =>
                  setForm({ ...form, sterilized: e.target.checked })
                }
                className="w-4 h-4 accent-green-600"
              />
              ✂️ Стерилізовано
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.trained}
                onChange={(e) =>
                  setForm({ ...form, trained: e.target.checked })
                }
                className="w-4 h-4 accent-green-600"
              />
              🎓 Навчено
            </label>
          </div>

          {editingId && (
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as "available" | "adopted" | "reserved",
                })
              }
              className="px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
            >
              <option value="available">Доступний</option>
              <option value="reserved">Зарезервовано</option>
              <option value="adopted">Прилаштовано</option>
            </select>
          )}

          {/* Contact info */}
          <div>
            <label className="block text-sm font-medium mb-2">Контакти</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="👤 Ім'я контакту"
                value={form.contact_name}
                onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                className="px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
              />
              <input
                type="tel"
                placeholder="📞 Телефон"
                value={form.contact_phone}
                onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                className="px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
              />
              <input
                type="email"
                placeholder="📧 Email"
                value={form.contact_email}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                className="px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
              />
              <input
                type="text"
                placeholder="📸 Instagram"
                value={form.contact_instagram}
                onChange={(e) => setForm({ ...form, contact_instagram: e.target.value })}
                className="px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
              />
              <input
                type="text"
                placeholder="✈️ Telegram"
                value={form.contact_telegram}
                onChange={(e) => setForm({ ...form, contact_telegram: e.target.value })}
                className="px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
              />
              <input
                type="text"
                placeholder="📘 Facebook"
                value={form.contact_facebook}
                onChange={(e) => setForm({ ...form, contact_facebook: e.target.value })}
                className="px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="📍 Локація"
              value={form.contact_location}
              onChange={(e) => setForm({ ...form, contact_location: e.target.value })}
              className="w-full mt-3 px-3 py-2.5 rounded-2xl bg-gray-light border-none focus:ring-2 focus:ring-green-primary/20 outline-none"
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Фотографії
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.photos.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        photos: form.photos.filter((_, j) => j !== i),
                      })
                    }
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white w-5 h-5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="text-sm"
            />
            {uploading && (
              <p className="text-xs text-gray-500 mt-1">Завантаження...</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#ced48c] text-foreground px-6 py-3 rounded-xl font-medium hover:bg-[#b8be72] transition-colors disabled:opacity-50"
            >
              {submitting
                ? "Збереження..."
                : editingId
                  ? "Зберегти зміни"
                  : "Додати тварину"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setForm(emptyAnimal);
                  setEditingId(null);
                }}
                className="px-4 py-3 rounded-2xl bg-gray-light transition-colors"
              >
                Скасувати
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
