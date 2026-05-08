"use client";
import { useLoginMutation } from "@/shared/query-hooks";
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

  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      queryClient.setQueryData([endpoints.auth.me()], data);
      if (data.role === "superadmin") router.push("/admin");
      else if (data.role === "admin" || data.role === "volunteer")
        router.push("/dashboard");
      else router.push("/profile");
    },
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
        submitting={loginMutation.isPending}
        errorMessage={errorMessage}
      />
    </>
  );
}
