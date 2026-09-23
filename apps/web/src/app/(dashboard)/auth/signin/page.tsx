"use client";
import { useGoogleLoginMutation, useLoginMutation } from "@/shared/query-hooks";
import { getAuthErrorMessage } from "@/shared/utils";
import type { LoginBody, User } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignInForm } from "./components/SignInForm";

export default function SignInPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");

  const onAuthSuccess = (user: User) => {
    queryClient.setQueryData([endpoints.auth.me()], user);
    const returnTo = new URLSearchParams(window.location.search).get(
      "returnTo",
    );
    if (returnTo?.startsWith("/")) {
      const returnUrl = new URL(returnTo, window.location.origin);
      if (returnUrl.origin === window.location.origin) {
        router.push(
          `${returnUrl.pathname}${returnUrl.search}${returnUrl.hash}`,
        );
        return;
      }
    }

    if (user.role === "admin" || user.role === "superadmin")
      router.push("/dashboard");
    else router.push("/profile");
  };

  const loginMutation = useLoginMutation({
    onSuccess: onAuthSuccess,
    onError: (err) => setErrorMessage(getAuthErrorMessage(err, "login")),
  });

  const googleLoginMutation = useGoogleLoginMutation({
    onSuccess: onAuthSuccess,
    onError: (err) => setErrorMessage(getAuthErrorMessage(err, "google")),
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
        submitting={loginMutation.isPending || googleLoginMutation.isPending}
        errorMessage={errorMessage}
      />
    </>
  );
}
