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
import { useResetPasswordForm } from "../../hooks/useResetPasswordForm";
import type { ResetPasswordFormValues } from "./schema";

interface ResetPasswordFormProps {
  onSubmit: (values: ResetPasswordFormValues) => void;
  submitting?: boolean;
}

export function ResetPasswordForm({
  onSubmit,
  submitting,
}: ResetPasswordFormProps) {
  const form = useResetPasswordForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Новий пароль</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Мінімум 8 символів"
                  disabled={submitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Підтвердження пароля</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Повторіть пароль"
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
          className="w-full mt-2"
        >
          {submitting ? "Зберігаємо..." : "Оновити пароль"}
        </Button>
      </form>
    </Form>
  );
}
