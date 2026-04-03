"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import Image from "next/image";
import { IconUserFilled, IconHomeFilled, IconChevronLeft } from "@tabler/icons-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading, refresh } = useUser();
  const [step, setStep] = useState<"choose" | "org">("choose");
  const [form, setForm] = useState({
    name: "", description: "", location: "", phone: "", email: "",
    instagram: "", telegram: "", facebook: "", website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-gray-medium">Завантаження...</p>
      </div>
    );
  }

  if (!user) {
    router.replace("/auth");
    return null;
  }

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      refresh();
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Помилка");
    }
    setSubmitting(false);
  };

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

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep("choose")} className="p-1.5 rounded-lg hover:bg-gray-light transition-colors">
            <IconChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-foreground">Створити організацію</h1>
        </div>

        <form onSubmit={handleCreateOrg} className="bg-white rounded-2xl border border-gray-border p-6 space-y-4">
          <div>
            <p className="text-xs text-gray-medium mb-1.5">Назва організації *</p>
            <input type="text" placeholder="Наприклад: Притулок 'Друг'" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </div>

          <div>
            <p className="text-xs text-gray-medium mb-1.5">Опис</p>
            <textarea placeholder="Розкажіть про діяльність організації..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-medium mb-1.5">Місто / Адреса</p>
              <input type="text" placeholder="м. Дніпро" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
            </div>
            <div>
              <p className="text-xs text-gray-medium mb-1.5">Телефон</p>
              <input type="tel" placeholder="+380..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-medium mb-1.5">Email</p>
            <input type="email" placeholder="org@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>

          <div>
            <p className="text-xs text-gray-medium mb-1.5">Вебсайт</p>
            <input type="url" placeholder="https://..." value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className={inputClass} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-gray-medium mb-1.5">Instagram</p>
              <input type="text" placeholder="@username" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className={inputClass} />
            </div>
            <div>
              <p className="text-xs text-gray-medium mb-1.5">Telegram</p>
              <input type="text" placeholder="@username" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} className={inputClass} />
            </div>
            <div>
              <p className="text-xs text-gray-medium mb-1.5">Facebook</p>
              <input type="text" placeholder="facebook.com/..." value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} className={inputClass} />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full bg-[#ced48c] text-foreground py-3 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50">
            {submitting ? "Зачекайте..." : "Створити організацію"}
          </button>
        </form>
      </div>
    </div>
  );
}
