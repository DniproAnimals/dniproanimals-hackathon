"use client";
import { useGoogleLoginMutation, useLoginMutation } from "@/shared/query-hooks";
import type { LoginBody } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignInForm } from "./components/SignInForm";

export default function SignInPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");

  const onAuthSuccess = (data: { role: string; orgId: number | null }) => {
    queryClient.setQueryData([endpoints.auth.me()], data);
    if (data.role === "superadmin") router.push("/admin");
    else if (data.orgId) router.push("/dashboard");
    else router.push("/onboarding");
  };

  const loginMutation = useLoginMutation({
    onSuccess: onAuthSuccess,
    onError: (err) => setErrorMessage(err.message || "Помилка"),
  });

  const googleLoginMutation = useGoogleLoginMutation({
    onSuccess: onAuthSuccess,
    onError: (err) => setErrorMessage(err.message || "Помилка"),
  });

  const handleSubmit = (values: LoginBody) => {
    setErrorMessage("");
    loginMutation.mutate(values);
  };

  return (
    <>
      <h1 className="text-xl font-bold text-foreground text-center mb-6">
        Увійти в акаунт
      </h1>
      <SignInForm
        onSubmit={handleSubmit}
        onGoogleLogin={(idToken) => {
          setErrorMessage("");
          googleLoginMutation.mutate({ idToken });
        }}
        submitting={loginMutation.isPending}
        googleSubmitting={googleLoginMutation.isPending}
        errorMessage={errorMessage}
      />
    </>
  );
}
