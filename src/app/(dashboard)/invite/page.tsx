"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import Image from "next/image";

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useUser();
  const token = searchParams.get("token");

  const [info, setInfo] = useState<{ volunteer_name: string; volunteer_surname: string | null; org_name: string } | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Посилання недійсне");
      setLoading(false);
      return;
    }
    fetch(`/api/volunteers/invite?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setInfo(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Помилка завантаження");
        setLoading(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/volunteers/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email: form.email, password: form.password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Помилка");
    } else {
      refresh();
      router.push("/dashboard");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-gray-medium">Завантаження...</p>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Запрошення недійсне"}</p>
          <button onClick={() => router.push("/")} className="text-sm text-gray-medium hover:text-foreground">
            На головну
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo.jpg" alt="DniproAnimals" width={48} height={48} className="rounded-full object-cover mb-3" />
          <h1 className="text-xl font-bold text-foreground mb-1">Запрошення</h1>
          <p className="text-sm text-gray-medium text-center">
            Вас запрошено як волонтера <strong>{info.volunteer_name}{info.volunteer_surname ? ` ${info.volunteer_surname}` : ""}</strong> до організації <strong>{info.org_name}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-border space-y-3">
          <p className="text-xs text-gray-medium mb-1">Створіть облікові дані для входу:</p>
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
          </div>
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <input type="password" placeholder="Пароль" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-light border border-gray-border focus:ring-2 focus:ring-[#ced48c]/30 outline-none text-sm" />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full bg-[#ced48c] text-foreground py-3 rounded-xl font-semibold hover:bg-[#b8be72] transition-colors disabled:opacity-50">
            {submitting ? "Зачекайте..." : "Приєднатися"}
          </button>
        </form>
      </div>
    </div>
  );
}
