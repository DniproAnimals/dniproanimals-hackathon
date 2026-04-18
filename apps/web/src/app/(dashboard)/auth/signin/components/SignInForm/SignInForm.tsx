"use client";
import { type LoginBody } from "@dniproanimals/contracts";
import { Button, Form } from "@dniproanimals/ui";
import Link from "next/link";
import { SignInEmailField } from "./components/SignInEmailField";
import { SignInPasswordField } from "./components/SignInPasswordField";
import { useSignInForm } from "./hooks/useSignInForm";

interface SignInFormProps {
  onSubmit: (values: LoginBody) => void;
  submitting?: boolean;
  errorMessage?: string;
}

export function SignInForm({
  onSubmit,
  submitting,
  errorMessage,
}: SignInFormProps) {
  const form = useSignInForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-border space-y-3"
      >
        <SignInEmailField />
        <SignInPasswordField />

        {errorMessage && (
          <p className="text-xs text-destructive">{errorMessage}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Зачекайте..." : "Увійти"}
        </Button>

        <p className="text-xs text-center text-gray-medium">
          Немає акаунту?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-foreground hover:underline"
          >
            Зареєструватися
          </Link>
        </p>
      </form>
    </Form>
  );
}
