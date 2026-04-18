"use client";
import { useRegisterMutation } from "@/shared/query-hooks";
import type { RegisterBody } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignUpForm } from "./components/SignUpForm";

export default function SignUpPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");

  const registerMutation = useRegisterMutation({
    onSuccess: (data) => {
      queryClient.setQueryData([endpoints.auth.me()], data);
      router.push("/onboarding");
    },
    onError: (err) => setErrorMessage(err.message || "Помилка"),
  });

  const handleSubmit = (values: RegisterBody) => {
    setErrorMessage("");
    registerMutation.mutate(values);
  };

  return (
    <>
      <h1 className="text-xl font-bold text-foreground text-center mb-6">
        Створити акаунт
      </h1>
      <SignUpForm
        onSubmit={handleSubmit}
        submitting={registerMutation.isPending}
        errorMessage={errorMessage}
      />
    </>
  );
}
