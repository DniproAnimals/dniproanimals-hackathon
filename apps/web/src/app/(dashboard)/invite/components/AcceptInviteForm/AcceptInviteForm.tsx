"use client";
import { Button, Form } from "@dniproanimals/ui";
import { AcceptInviteEmailField } from "./components/AcceptInviteEmailField";
import { AcceptInvitePasswordField } from "./components/AcceptInvitePasswordField";
import { useAcceptInviteForm } from "./hooks/useAcceptInviteForm";
import { type AcceptInviteFormValues } from "./schema";

interface AcceptInviteFormProps {
  onSubmit: (values: AcceptInviteFormValues) => void;
  submitting?: boolean;
  errorMessage?: string;
}

export function AcceptInviteForm({
  onSubmit,
  submitting,
  errorMessage,
}: AcceptInviteFormProps) {
  const form = useAcceptInviteForm();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-border space-y-3"
      >
        <p className="text-xs text-gray-medium mb-1">
          Створіть облікові дані для входу:
        </p>
        <AcceptInviteEmailField />
        <AcceptInvitePasswordField />

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
          {submitting ? "Зачекайте..." : "Приєднатися"}
        </Button>
      </form>
    </Form>
  );
}
