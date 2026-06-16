"use client";
import { useForgotPasswordMutation } from "@/shared/query-hooks";
import { useState } from "react";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm/ForgotPasswordForm";
import type { ForgotPasswordFormValues } from "./components/ForgotPasswordForm/schema";

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useForgotPasswordMutation({
    onSuccess: () => setIsSuccess(true),
  });

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">
          Перевірте вашу пошту
        </h1>
        <p className="text-sm text-gray-medium">
          Якщо акаунт із такою адресою існує, ми надіслали інструкції для
          відновлення пароля.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Відновлення пароля
        </h1>
        <p className="text-sm text-gray-medium">
          Введіть email, і ми надішлемо вам посилання для зміни пароля.
        </p>
      </div>

      <ForgotPasswordForm
        onSubmit={(values: ForgotPasswordFormValues) => mutation.mutate(values)}
        submitting={mutation.isPending}
      />

      {mutation.isError && (
        <p className="text-xs text-destructive text-center">
          Сталася помилка. Спробуйте пізніше.
        </p>
      )}
    </div>
  );
}
