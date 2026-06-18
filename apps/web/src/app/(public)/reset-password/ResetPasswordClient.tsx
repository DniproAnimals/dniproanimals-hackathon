"use client";
import { useResetPasswordMutation } from "@/shared/query-hooks";
import { Button } from "@dniproanimals/ui";
import Link from "next/link";
import { useState } from "react";
import {
  ResetPasswordForm,
  ResetPasswordFormValues,
} from "./components/ResetPasswordForm";

export function ResetPasswordClient({ token }: { token: string }) {
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useResetPasswordMutation({
    onSuccess: () => setIsSuccess(true),
  });

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-border text-center space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Пароль змінено!</h1>
        <p className="text-sm text-gray-medium">
          Ви можете увійти, використовуючи новий пароль.
        </p>
        <Button asChild className="w-full" size="lg">
          <Link href="/auth/signin">Увійти</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-border space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Новий пароль</h1>
        <p className="text-sm text-gray-medium">
          Придумайте надійний пароль для вашого акаунта.
        </p>
      </div>

      <ResetPasswordForm
        onSubmit={(values: ResetPasswordFormValues) =>
          mutation.mutate({ token, newPassword: values.newPassword })
        }
        submitting={mutation.isPending}
      />

      {mutation.isError && (
        <p className="text-xs text-destructive text-center">
          {mutation.error.message}
        </p>
      )}
    </div>
  );
}
