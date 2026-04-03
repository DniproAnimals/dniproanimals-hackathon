"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useDashboard } from "../layout";
import ImageFallback from "@/components/ImageFallback";
import {
  IconX, IconPlus, IconSearch, IconLink, IconTrash, IconEdit,
  IconPhoneFilled, IconMailFilled, IconBrandInstagram, IconBrandTelegram,
  IconUsersGroup, IconCircleCheckFilled, IconClockFilled, IconPhoto,
} from "@tabler/icons-react";

type Volunteer = {
  id: number; name: string; surname: string | null; photo: string | null;
  description: string | null; phone: string | null; email: string | null;
  instagram: string | null; telegram: string | null; user_id: number | null; invite_token: string;
};

const emptyForm = { name: "", surname: "", photo: "", description: "", phone: "", email: "", instagram: "", telegram: "" };

export default function VolunteersPage() {
  const { isOwner } = useDashboard();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingVol, setEditingVol] = useState<Volunteer | null>(null);
  const [selectedVol, setSelectedVol] = useState<Volunteer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchVolunteers = useCallback(() => {
    fetch("/api/volunteers").then((r) => r.json()).then((data) => { if (Array.isArray(data)) setVolunteers(data); });
  }, []);

  useEffect(() => { fetchVolunteers(); }, [fetchVolunteers]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) { const { url } = await res.json(); setForm((prev) => ({ ...prev, photo: url })); }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const isEdit = !!editingVol;
    const body = isEdit ? { ...form, id: editingVol.id } : form;
    const res = await fetch("/api/volunteers", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { setForm(emptyForm); setShowForm(false); setEditingVol(null); fetchVolunteers(); }
    setSubmitting(false);
  };

  const openEdit = (vol: Volunteer) => {
    setEditingVol(vol);
    setForm({ name: vol.name, surname: vol.surname || "", photo: vol.photo || "", description: vol.description || "", phone: vol.phone || "", email: vol.email || "", instagram: vol.instagram || "", telegram: vol.telegram || "" });
    setShowForm(true);
  };

  const openAdd = () => { setEditingVol(null); setForm(emptyForm); setShowForm(true); };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити волонтера?")) return;
    await fetch("/api/volunteers", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setVolunteers((prev) => prev.filter((v) => v.id !== id));
    setSelectedVol(null);
  };

  const copyInviteLink = (vol: Volunteer) => {
    navigator.clipboard.writeText(`${window.location.origin}/invite?token=${vol.invite_token}`);
    setCopiedId(vol.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = volunteers.filter((v) => {
    const matchSearch = !search || `${v.name} ${v.surname || ""} ${v.email || ""}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (statusFilter === "active" ? v.user_id : !v.user_id);
    return matchSearch && matchStatus;
  });

  const activeCount = volunteers.filter((v) => v.user_id).length;
  const pendingCount = volunteers.length - activeCount;
  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm";

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Волонтери</h1>
          <p className="text-sm text-gray-400 mt-0.5">{volunteers.length} у команді</p>
        </div>
        {isOwner && (
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#ced48c] text-foreground hover:bg-[#b8be72] transition-colors">
            <IconPlus size={16} /> Додати
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: IconUsersGroup, color: "bg-blue-50 text-blue-500", value: volunteers.length, label: "Всього" },
          { icon: IconCircleCheckFilled, color: "bg-green-50 text-green-500", value: activeCount, label: "Активних" },
          { icon: IconClockFilled, color: "bg-yellow-50 text-yellow-500", value: pendingCount, label: "Очікують" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><s.icon size={20} /></div>
            <div><p className="text-xl font-bold">{s.value}</p><p className="text-[11px] text-gray-400">{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input type="text" placeholder="Пошук..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#ced48c]/30" />
        </div>
        <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
          {(["all", "active", "pending"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? "bg-white text-foreground shadow-sm" : "text-gray-500"}`}>
              {s === "all" ? `Усі (${volunteers.length})` : s === "active" ? `Активні (${activeCount})` : `Очікують (${pendingCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <IconUsersGroup size={24} className="text-gray-300 mx-auto mb-3" />
          <p className="font-medium mb-1">{volunteers.length === 0 ? "Ще немає волонтерів" : "Нікого не знайдено"}</p>
          {volunteers.length === 0 && isOwner && (
            <button onClick={openAdd} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#ced48c] text-foreground">
              <IconPlus size={14} /> Додати
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((vol) => (
            <button key={vol.id} onClick={() => setSelectedVol(vol)} className="bg-white rounded-2xl border border-gray-200 p-4 text-left hover:border-[#ced48c] transition-all flex gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                {vol.photo ? (
                  <ImageFallback src={vol.photo} alt={vol.name} fill className="object-cover" sizes="56px" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-base font-bold ${vol.user_id ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {vol.name.charAt(0)}{vol.surname ? vol.surname.charAt(0) : ""}
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-sm truncate">{vol.name}{vol.surname ? ` ${vol.surname}` : ""}</p>
                  {vol.user_id ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-green-600"><IconCircleCheckFilled size={10} />Активний</span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-yellow-600"><IconClockFilled size={10} />Очікує</span>
                  )}
                </div>
                {vol.description && <p className="text-xs text-gray-500 line-clamp-1 mb-1">{vol.description}</p>}
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  {vol.phone && <span className="flex items-center gap-0.5"><IconPhoneFilled size={10} />{vol.phone}</span>}
                  {vol.instagram && <span className="flex items-center gap-0.5"><IconBrandInstagram size={10} />@{vol.instagram}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedVol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setSelectedVol(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            {/* Header with photo */}
            <div className="relative h-20 bg-[#ced48c]/30">
              <button onClick={() => setSelectedVol(null)} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-gray-400 hover:text-foreground">
                <IconX size={16} />
              </button>
            </div>
            <div className="px-5 -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-sm bg-gray-100 relative">
                {selectedVol.photo ? (
                  <ImageFallback src={selectedVol.photo} alt={selectedVol.name} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-xl font-bold ${selectedVol.user_id ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {selectedVol.name.charAt(0)}{selectedVol.surname ? selectedVol.surname.charAt(0) : ""}
                  </div>
                )}
              </div>
            </div>
            <div className="px-5 pb-5">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold">{selectedVol.name}{selectedVol.surname ? ` ${selectedVol.surname}` : ""}</h2>
                {selectedVol.user_id ? (
                  <span className="text-[10px] font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Активний</span>
                ) : (
                  <span className="text-[10px] font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">Очікує</span>
                )}
              </div>
              {selectedVol.description && <p className="text-sm text-gray-500 mb-4">{selectedVol.description}</p>}

              {/* Contacts */}
              {(selectedVol.phone || selectedVol.email || selectedVol.instagram || selectedVol.telegram) && (
                <div className="space-y-2 mb-4">
                  {selectedVol.phone && <div className="flex items-center gap-2.5 text-sm"><IconPhoneFilled size={14} className="text-gray-400" /><a href={`tel:${selectedVol.phone}`} className="hover:underline">{selectedVol.phone}</a></div>}
                  {selectedVol.email && <div className="flex items-center gap-2.5 text-sm"><IconMailFilled size={14} className="text-gray-400" /><a href={`mailto:${selectedVol.email}`} className="hover:underline">{selectedVol.email}</a></div>}
                  {selectedVol.instagram && <div className="flex items-center gap-2.5 text-sm"><IconBrandInstagram size={14} className="text-gray-400" /><a href={`https://instagram.com/${selectedVol.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:underline">@{selectedVol.instagram}</a></div>}
                  {selectedVol.telegram && <div className="flex items-center gap-2.5 text-sm"><IconBrandTelegram size={14} className="text-gray-400" /><a href={`https://t.me/${selectedVol.telegram}`} target="_blank" rel="noopener noreferrer" className="hover:underline">@{selectedVol.telegram}</a></div>}
                </div>
              )}

              {/* Actions */}
              {isOwner && (
                <div className="flex gap-2">
                  <button onClick={() => { openEdit(selectedVol); setSelectedVol(null); }} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <IconEdit size={14} /> Редагувати
                  </button>
                  {!selectedVol.user_id && (
                    <button onClick={() => copyInviteLink(selectedVol)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-gray-50 text-foreground hover:bg-gray-100 transition-colors">
                      <IconLink size={14} /> {copiedId === selectedVol.id ? "Скопійовано!" : "Запрошення"}
                    </button>
                  )}
                  <button onClick={() => handleDelete(selectedVol.id)} className="py-2.5 px-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                    <IconTrash size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => { setShowForm(false); setEditingVol(null); }}>
          <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-lg">{editingVol ? "Редагувати волонтера" : "Додати волонтера"}</h3>
              <button type="button" onClick={() => { setShowForm(false); setEditingVol(null); }} className="text-gray-400 hover:text-foreground"><IconX size={20} /></button>
            </div>

            {/* Photo */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                {form.photo ? (
                  <ImageFallback src={form.photo} alt="" fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><IconPhoto size={24} /></div>
                )}
              </div>
              <div>
                <button type="button" onClick={() => fileRef.current?.click()} className="text-sm font-medium text-[#5b7765] hover:underline">
                  {uploading ? "Завантаження..." : form.photo ? "Змінити фото" : "Додати фото"}
                </button>
                {form.photo && <button type="button" onClick={() => setForm({ ...form, photo: "" })} className="block text-xs text-red-500 mt-0.5">Видалити</button>}
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handlePhotoUpload} className="hidden" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-gray-500 mb-1">Ім&apos;я *</p><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Ім'я" /></div>
              <div><p className="text-xs text-gray-500 mb-1">Прізвище</p><input type="text" value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} className={inputClass} placeholder="Прізвище" /></div>
            </div>
            <div><p className="text-xs text-gray-500 mb-1">Опис / роль</p><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} rows={2} placeholder="Чим займається" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-gray-500 mb-1">Телефон</p><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+380..." /></div>
              <div><p className="text-xs text-gray-500 mb-1">Email</p><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-gray-500 mb-1">Instagram</p><input type="text" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className={inputClass} placeholder="@username" /></div>
              <div><p className="text-xs text-gray-500 mb-1">Telegram</p><input type="text" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} className={inputClass} placeholder="@username" /></div>
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-[#ced48c] text-foreground py-2.5 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50 text-sm">
              {submitting ? "Зачекайте..." : editingVol ? "Зберегти зміни" : "Додати волонтера"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
