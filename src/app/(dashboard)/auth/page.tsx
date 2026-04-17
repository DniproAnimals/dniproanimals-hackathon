"use client";
import { Button, Input, InputWithIcon } from "@/components/ui";
import { useUser } from "@/shared/lib/UserContext";
import {
  IconLockFilled,
  IconMailFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const router = useRouter();
  const { user, refresh } = useUser();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "superadmin") router.replace("/admin");
      else if (user.org_id) router.replace("/dashboard");
      else router.replace("/onboarding");
    }
  }, [user, router]);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body =
      mode === "login" ? { email: form.email, password: form.password } : form;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Помилка");
    } else {
      if (mode === "register") {
        router.push("/onboarding");
        refresh();
      } else {
        refresh();
        const { role, org_id } = data;
        if (role === "superadmin") router.push("/admin");
        else if (org_id) router.push("/dashboard");
        else router.push("/onboarding");
      }
    }
    setLoading(false);
  };

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
          <h1 className="text-xl font-bold text-foreground">
            {mode === "login" ? "Увійти в акаунт" : "Створити акаунт"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-border space-y-3"
        >
          {mode === "register" && (
            <InputWithIcon icon={<IconUserFilled />}>
              <Input
                type="text"
                placeholder="Ім'я"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </InputWithIcon>
          )}
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
            disabled={loading}
            className="w-full"
          >
            {loading
              ? "Зачекайте..."
              : mode === "login"
                ? "Увійти"
                : "Зареєструватися"}
          </Button>

          <p className="text-xs text-center text-gray-medium">
            {mode === "login" ? "Немає акаунту? " : "Вже є акаунт? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="font-medium text-foreground hover:underline"
            >
              {mode === "login" ? "Зареєструватися" : "Увійти"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
