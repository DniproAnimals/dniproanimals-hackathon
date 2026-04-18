"use client";
import { Button, Form } from "@dniproanimals/ui";
import { VolunteerDescriptionField } from "./components/VolunteerDescriptionField";
import { VolunteerEmailField } from "./components/VolunteerEmailField";
import { VolunteerInstagramField } from "./components/VolunteerInstagramField";
import { VolunteerNameField } from "./components/VolunteerNameField";
import { VolunteerPhoneField } from "./components/VolunteerPhoneField";
import { VolunteerPhotoField } from "./components/VolunteerPhotoField";
import { VolunteerSurnameField } from "./components/VolunteerSurnameField";
import { VolunteerTelegramField } from "./components/VolunteerTelegramField";
import { useVolunteerForm } from "./hooks/useVolunteerForm";
import { type VolunteerFormValues } from "./schema";

interface VolunteerFormProps {
  defaultValues: VolunteerFormValues;
  onSubmit: (values: VolunteerFormValues) => void;
  submitting?: boolean;
  submitLabel: string;
}

export function VolunteerForm({
  defaultValues,
  onSubmit,
  submitting,
  submitLabel,
}: VolunteerFormProps) {
  const form = useVolunteerForm(defaultValues);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <VolunteerPhotoField />
        <div className="grid grid-cols-2 gap-3">
          <VolunteerNameField />
          <VolunteerSurnameField />
        </div>
        <VolunteerDescriptionField />
        <div className="grid grid-cols-2 gap-3">
          <VolunteerPhoneField />
          <VolunteerEmailField />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <VolunteerInstagramField />
          <VolunteerTelegramField />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Зачекайте..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
