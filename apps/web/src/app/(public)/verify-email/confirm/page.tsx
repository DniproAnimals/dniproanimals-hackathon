"use client";
import { useVerifyEmailMutation } from "@/shared/query-hooks";
import { Button, Spinner } from "@dniproanimals/ui";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const token = searchParams.get("token") ?? "";
  const hasToken = Boolean(token);

  const verifyMutation = useVerifyEmailMutation({
    onSuccess: () => {
      router.replace("/verify-email/success");
    },
    onError: (err) => {
      setErrorMessage(err.message || "Помилка підтвердження");
    },
  });

  useEffect(() => {
    if (!token) return;
    verifyMutation.mutate(token);
  }, [token, verifyMutation]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center space-y-6">
        <h1 className="text-2xl font-bold text-foreground">
          Підтверджуємо пошту…
        </h1>
        {verifyMutation.isPending && (
          <div className="flex items-center justify-center gap-3 text-gray-medium">
            <Spinner size="sm" />
            <span>Зачекайте кілька секунд</span>
          </div>
        )}
        {(!hasToken || errorMessage) && !verifyMutation.isPending && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {errorMessage ?? "Невірне посилання підтвердження"}
          </div>
        )}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="outline">
            <Link href="/verify-email">Назад</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signin">Увійти</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
