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
  name: "", description: "", type: "dog" as string, breed: "", sex: "", age_months: "", weight_kg: "",
  size: "", color: "", vaccinated: false, sterilized: false, trained: false, photos: "[]", status: "available",
  contact_name: "", contact_phone: "", contact_email: "", contact_instagram: "", contact_telegram: "", contact_facebook: "", contact_location: "",
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
    fetch(`/api/animals?${params}`).then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setAnimals(data);
    });
  }, [typeFilter, statusFilter, search]);

  useEffect(() => { fetchAnimals(); }, [fetchAnimals]);

  const openEdit = async (id: number) => {
    const res = await fetch(`/api/animals/${id}`);
    const data = await res.json();
    if (data) {
      setForm({
        name: data.name || "", description: data.description || "", type: data.type || "dog", breed: data.breed || "",
        sex: data.sex || "", age_months: data.age_months?.toString() || "", weight_kg: data.weight_kg?.toString() || "",
        size: data.size || "", color: data.color || "", vaccinated: !!data.vaccinated, sterilized: !!data.sterilized,
        trained: !!data.trained, photos: data.photos || "[]", status: data.status || "available",
        contact_name: data.contact_name || "", contact_phone: data.contact_phone || "", contact_email: data.contact_email || "",
        contact_instagram: data.contact_instagram || "", contact_telegram: data.contact_telegram || "",
        contact_facebook: data.contact_facebook || "", contact_location: data.contact_location || "",
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

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
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
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

  const typeLabel = (t: string) => t === "dog" ? "Собака" : t === "cat" ? "Кіт" : "Інше";
  const statusLabel = (s: string) => s === "available" ? "Шукає дім" : s === "adopted" ? "Усиновлено" : "Заброньовано";
  const statusColor = (s: string) => s === "available" ? "bg-green-100 text-green-700" : s === "adopted" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700";
  const sexLabel = (s: string | null) => s === "male" ? "Хлопчик" : s === "female" ? "Дівчинка" : "";

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm";
  const selectClass = `${inputClass} appearance-none`;

  const getPhoto = (photos: string) => {
    try {
      const arr = JSON.parse(photos);
      return Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
    } catch { return null; }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Тварини</h1>
        <Link href='/dashboard/animals/add' className="px-4 py-2 rounded-xl text-sm font-medium bg-[#ced48c] text-foreground hover:bg-[#b8be72] transition-colors">
          Додати тварину
        </Link>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm px-4 pt-10 pb-10 overflow-y-auto" onClick={() => { setShowForm(false); setEditingId(null); }}>
          <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">{editingId ? "Редагувати" : "Додати тварину"}</h2>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="text-gray-400 hover:text-foreground">
                <IconX size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Ім&#39;я *</p>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Вид *</p>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={selectClass}>
                  <option value="dog">Собака</option>
                  <option value="cat">Кіт</option>
                  <option value="other">Інше</option>
                </select>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Опис</p>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} rows={3} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Порода</p>
                <input type="text" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className={inputClass} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Стать</p>
                <select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} className={selectClass}>
                  <option value="">—</option>
                  <option value="male">Хлопчик</option>
                  <option value="female">Дівчинка</option>
                </select>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Розмір</p>
                <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className={selectClass}>
                  <option value="">—</option>
                  <option value="small">Маленький</option>
                  <option value="medium">Середній</option>
                  <option value="large">Великий</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Вік (місяці)</p>
                <input type="number" value={form.age_months} onChange={(e) => setForm({ ...form, age_months: e.target.value })} className={inputClass} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Вага (кг)</p>
                <input type="number" step="0.1" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} className={inputClass} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Колір</p>
                <input type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="flex gap-5">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.vaccinated} onChange={(e) => setForm({ ...form, vaccinated: e.target.checked })} className="rounded" /> Вакциновано</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.sterilized} onChange={(e) => setForm({ ...form, sterilized: e.target.checked })} className="rounded" /> Стерилізовано</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.trained} onChange={(e) => setForm({ ...form, trained: e.target.checked })} className="rounded" /> Дресировано</label>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Статус</p>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={selectClass}>
                <option value="available">Шукає дім</option>
                <option value="reserved">Заброньовано</option>
                <option value="adopted">Усиновлено</option>
              </select>
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-[#ced48c] text-foreground py-3 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50">
              {submitting ? "Зачекайте..." : editingId ? "Зберегти" : "Додати"}
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Пошук..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#ced48c]/30 w-56"
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none">
          <option value="">Усі види</option>
          <option value="dog">Собаки</option>
          <option value="cat">Коти</option>
          <option value="other">Інше</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none">
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
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {photo ? (
                          <ImageFallback src={photo} alt={a.name} width={36} height={36} className="w-9 h-9 rounded-lg object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                            {a.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{a.name}</p>
                          {a.breed && <p className="text-xs text-gray-400">{a.breed}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500">{typeLabel(a.type)}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">{sexLabel(a.sex)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(a.status)}`}>
                        {statusLabel(a.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(a.id)} className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                          Редагувати
                        </button>
                        <button onClick={() => handleDelete(a.id)} className="px-2.5 py-1 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">
                          Видалити
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
