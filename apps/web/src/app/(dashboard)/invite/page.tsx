"use client";
import {
  useAcceptInviteMutation,
  useInviteInfoQuery,
} from "@/shared/query-hooks";
import { endpoints } from "@dniproanimals/endpoints";
import { IconLockFilled, IconMailFilled } from "@dniproanimals/icons";
import { Button, Input, InputWithIcon, Skeleton } from "@dniproanimals/ui";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

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
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const {
    data: info,
    isLoading,
    error: queryError,
  } = useInviteInfoQuery(token, { enabled: !!token });
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(() => (token ? "" : "Посилання недійсне"));

  const acceptMutation = useAcceptInviteMutation({
    onSuccess: (user) => {
      queryClient.setQueryData([endpoints.auth.me()], user);
      router.push("/dashboard");
    },
    onError: (err) => setError(err.message || "Помилка"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError("");
    acceptMutation.mutate({ token, email: form.email, password: form.password });
  };

  if (isLoading) {
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
            {error || queryError?.message || "Запрошення недійсне"}
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
              {info.volunteerName}
              {info.volunteerSurname ? ` ${info.volunteerSurname}` : ""}
            </strong>{" "}
            до організації <strong>{info.orgName}</strong>
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
            disabled={acceptMutation.isPending}
            className="w-full"
          >
            {acceptMutation.isPending ? "Зачекайте..." : "Приєднатися"}
          </Button>
        </form>
      </div>
    </div>
  );
}
