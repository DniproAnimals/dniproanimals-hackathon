"use client";

import { useEffect, useState, useCallback } from "react";
import ImageFallback from "@/components/ImageFallback";
import { IconX } from "@tabler/icons-react";
import Link from "next/link";

type Animal = {
  id: number;
  name: string;
  type: "dog" | "cat" | "other";
  breed: string | null;
  sex: "male" | "female" | null;
  age_months: number | null;
  size: "small" | "medium" | "large" | null;
  status: "available" | "adopted" | "reserved";
  photos: string;
  created_at: string;
};

const emptyForm = {
  name: "",
  description: "",
  type: "dog" as string,
  breed: "",
  sex: "",
  age_months: "",
  weight_kg: "",
  size: "",
  color: "",
  vaccinated: false,
  sterilized: false,
  trained: false,
  photos: "[]",
  status: "available",
  contact_name: "",
  contact_phone: "",
  contact_email: "",
  contact_instagram: "",
  contact_telegram: "",
  contact_facebook: "",
  contact_location: "",
};

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchAnimals = useCallback(() => {
    const params = new URLSearchParams();
    if (typeFilter) params.set("type", typeFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("q", search);
    fetch(`/api/animals?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAnimals(data);
      });
  }, [typeFilter, statusFilter, search]);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const body = {
      ...form,
      age_months: form.age_months ? Number(form.age_months) : null,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      photos: JSON.parse(form.photos || "[]"),
    };
    const url = editingId ? `/api/animals/${editingId}` : "/api/animals";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchAnimals();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити тварину?")) return;
    const res = await fetch(`/api/animals/${id}`, { method: "DELETE" });
    if (res.ok) setAnimals((prev) => prev.filter((a) => a.id !== id));
  };

  const typeLabel = (t: string) =>
    t === "dog" ? "Собака" : t === "cat" ? "Кіт" : "Інше";
  const statusLabel = (s: string) =>
    s === "available"
      ? "Шукає дім"
      : s === "adopted"
        ? "Усиновлено"
        : "Заброньовано";
  const statusColor = (s: string) =>
    s === "available"
      ? "bg-green-100 text-green-700"
      : s === "adopted"
        ? "bg-blue-100 text-blue-700"
        : "bg-yellow-100 text-yellow-700";
  const sexLabel = (s: string | null) =>
    s === "male" ? "Хлопчик" : s === "female" ? "Дівчинка" : "";

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm";
  const selectClass = `${inputClass} appearance-none`;

  const getPhoto = (photos: string) => {
    try {
      const arr = JSON.parse(photos);
      return Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Тварини</h1>
        <Link
          href="/dashboard/animals/edit"
          className="px-4 py-2 rounded-xl text-sm font-medium bg-[#ced48c] text-foreground hover:bg-[#b8be72] transition-colors"
        >
          Додати тварину
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Пошук..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#ced48c]/30 w-56"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none"
        >
          <option value="">Усі види</option>
          <option value="dog">Собаки</option>
          <option value="cat">Коти</option>
          <option value="other">Інше</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none"
        >
          <option value="">Усі статуси</option>
          <option value="available">Шукає дім</option>
          <option value="reserved">Заброньовано</option>
          <option value="adopted">Усиновлено</option>
        </select>
        <span className="text-xs text-gray-400">{animals.length} тварин</span>
      </div>

      {/* Table */}
      {animals.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
          Немає тварин
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
                <th className="px-4 py-3">Тварина</th>
                <th className="px-4 py-3 hidden sm:table-cell">Вид</th>
                <th className="px-4 py-3 hidden md:table-cell">Стать</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3 text-right">Дії</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((a) => {
                const photo = getPhoto(a.photos);
                return (
                  <Link
                    href={`/animals/${a.id}`}
                    key={a.id}
                    className="border-b table-row border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {photo ? (
                          <ImageFallback
                            src={photo}
                            alt={a.name}
                            width={36}
                            height={36}
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                            {a.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {a.name}
                          </p>
                          {a.breed && (
                            <p className="text-xs text-gray-400">{a.breed}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500">
                      {typeLabel(a.type)}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                      {sexLabel(a.sex)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(a.status)}`}
                      >
                        {statusLabel(a.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/dashboard/animals/edit?edit=${a.id}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          Редагувати
                        </Link>
                        <button
                          onClick={(event) => {
                            event.stopPropagation()
                            event.preventDefault()
                            handleDelete(a.id)
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Видалити
                        </button>
                      </div>
                    </td>
                  </Link>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
