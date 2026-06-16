"use client";
import {
  useGoogleLoginMutation,
  useRegisterMutation,
} from "@/shared/query-hooks";
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

  const onAuthSuccess = (data: { role: string; orgId: number | null }) => {
    queryClient.setQueryData([endpoints.auth.me()], data);
    if (data.role === "superadmin") router.push("/admin");
    else if (data.orgId) router.push("/dashboard");
    else router.push("/onboarding");
  };

  const registerMutation = useRegisterMutation({
    onSuccess: () => {
      router.push("/verify-email");
    },
    onError: (err) => setErrorMessage(err.message || "Помилка"),
  });

  const googleLoginMutation = useGoogleLoginMutation({
    onSuccess: onAuthSuccess,
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
        onGoogleLogin={(idToken) => {
          setErrorMessage("");
          googleLoginMutation.mutate({ idToken });
        }}
        submitting={registerMutation.isPending || googleLoginMutation.isPending}
        errorMessage={errorMessage}
      />
    </>
  );
}
