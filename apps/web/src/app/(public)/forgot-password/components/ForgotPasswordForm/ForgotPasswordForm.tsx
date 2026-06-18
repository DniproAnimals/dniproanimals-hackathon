"use client";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import Link from "next/link";
import { useForgotPasswordForm } from "../../hooks";
import type { ForgotPasswordFormValues } from "./schema";

interface ForgotPasswordFormProps {
  onSubmit: (values: ForgotPasswordFormValues) => void;
  submitting?: boolean;
}

export function ForgotPasswordForm({
  onSubmit,
  submitting,
}: ForgotPasswordFormProps) {
  const form = useForgotPasswordForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  disabled={submitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Надсилаємо..." : "Надіслати посилання"}
        </Button>

        <p className="text-xs text-center text-gray-medium pt-2">
          Згадали пароль?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-foreground hover:underline"
          >
            Повернутися до входу
          </Link>
        </p>
      </form>
    </Form>
  );
}
