"use client";
import { useUser } from "@/shared/lib/UserContext";
import { useLoginMutation, useRegisterMutation } from "@/shared/query-hooks";
import {
  IconLockFilled,
  IconMailFilled,
  IconUserFilled,
} from "@dniproanimals/icons";
import { Button, Input, InputWithIcon } from "@dniproanimals/ui";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const router = useRouter();
  const { user } = useUser();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      if (user.role === "superadmin") router.replace("/admin");
      else if (user.orgId) router.replace("/dashboard");
      else router.replace("/onboarding");
    }
  }, [user, router]);

  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      if (data.role === "superadmin") router.push("/admin");
      else if (data.orgId) router.push("/dashboard");
      else router.push("/onboarding");
    },
    onError: (err) => setError(err.message || "Помилка"),
  });

  const registerMutation = useRegisterMutation({
    onSuccess: () => router.push("/onboarding"),
    onError: (err) => setError(err.message || "Помилка"),
  });

  if (user) return null;

  const loading = loginMutation.isPending || registerMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      loginMutation.mutate({ email: form.email, password: form.password });
    } else {
      registerMutation.mutate(form);
    }
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
