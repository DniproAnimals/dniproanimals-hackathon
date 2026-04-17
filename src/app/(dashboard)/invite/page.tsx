"use client";
import { Button, Input, InputWithIcon, Skeleton } from "@/components/ui";
import { useUser } from "@/shared/lib/UserContext";
import { IconLockFilled, IconMailFilled } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function InvitePageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <Skeleton className="size-10 rounded-full" />
        </div>
      }
    >
      <InvitePage />
    </Suspense>
  );
}

function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useUser();
  const token = searchParams.get("token");

  const [info, setInfo] = useState<{
    volunteer_name: string;
    volunteer_surname: string | null;
    org_name: string;
  } | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(() => (token ? "" : "Посилання недійсне"));
  const [loading, setLoading] = useState(() => Boolean(token));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
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
      body: JSON.stringify({
        token,
        email: form.email,
        password: form.password,
      }),
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
          <p className="text-destructive mb-4">
            {error || "Запрошення недійсне"}
          </p>
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            На головну
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.jpg"
            alt="DniproAnimals"
            width={48}
            height={48}
            className="rounded-full object-cover mb-3"
          />
          <h1 className="text-xl font-bold text-foreground mb-1">Запрошення</h1>
          <p className="text-sm text-gray-medium text-center">
            Вас запрошено як волонтера{" "}
            <strong>
              {info.volunteer_name}
              {info.volunteer_surname ? ` ${info.volunteer_surname}` : ""}
            </strong>{" "}
            до організації <strong>{info.org_name}</strong>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-border space-y-3"
        >
          <p className="text-xs text-gray-medium mb-1">
            Створіть облікові дані для входу:
          </p>
          <InputWithIcon icon={<IconMailFilled />}>
            <Input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </InputWithIcon>
          <InputWithIcon icon={<IconLockFilled />}>
            <Input
              type="password"
              placeholder="Пароль"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </InputWithIcon>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? "Зачекайте..." : "Приєднатися"}
          </Button>
        </form>
      </div>
    </div>
  );
}
