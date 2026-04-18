"use client";
import { type RegisterBody } from "@dniproanimals/contracts";
import { Button, Form } from "@dniproanimals/ui";
import Link from "next/link";
import { SignUpEmailField } from "./components/SignUpEmailField";
import { SignUpNameField } from "./components/SignUpNameField";
import { SignUpPasswordField } from "./components/SignUpPasswordField";
import { useSignUpForm } from "./hooks/useSignUpForm";

interface SignUpFormProps {
  onSubmit: (values: RegisterBody) => void;
  submitting?: boolean;
  errorMessage?: string;
}

export function SignUpForm({
  onSubmit,
  submitting,
  errorMessage,
}: SignUpFormProps) {
  const form = useSignUpForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-border space-y-3"
      >
        <SignUpNameField />
        <SignUpEmailField />
        <SignUpPasswordField />

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
          {submitting ? "Зачекайте..." : "Зареєструватися"}
        </Button>

        <p className="text-xs text-center text-gray-medium">
          Вже є акаунт?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-foreground hover:underline"
          >
            Увійти
          </Link>
        </p>
      </form>
    </Form>
  );
}
