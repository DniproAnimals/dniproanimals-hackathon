"use client";
import { Button, Form } from "@dniproanimals/ui";
import { LostAnimalTypeField } from "./components/LostAnimalTypeField";
import { LostBreedField } from "./components/LostBreedField";
import { LostColorField } from "./components/LostColorField";
import { LostContactsFields } from "./components/LostContactsFields";
import { LostDescriptionField } from "./components/LostDescriptionField";
import { LostLastSeenDateField } from "./components/LostLastSeenDateField";
import { LostLastSeenLocationField } from "./components/LostLastSeenLocationField";
import { LostPhotosField } from "./components/LostPhotosField";
import { LostSexField } from "./components/LostSexField";
import { LostSizeField } from "./components/LostSizeField";
import { LostTitleField } from "./components/LostTitleField";
import { type LostFormValues } from "./constants/schema";
import { useLostForm } from "./hooks/useLostForm";

interface LostFormProps {
  defaultValues: LostFormValues;
  onSubmit: (values: LostFormValues) => void;
  submitting?: boolean;
  submitLabel: string;
}

export function LostForm({
  defaultValues,
  onSubmit,
  submitting,
  submitLabel,
}: LostFormProps) {
  const form = useLostForm(defaultValues);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-5 space-y-3">
        <LostPhotosField />
        <LostTitleField />
        <LostAnimalTypeField />
        <LostBreedField />
        <LostSexField />
        <LostColorField />
        <LostSizeField />
        <LostLastSeenLocationField />
        <LostLastSeenDateField />
        <LostDescriptionField />
        <LostContactsFields />
        <Button
          type="submit"
          variant="destructive"
          disabled={submitting}
          className="w-full py-3 h-auto"
        >
          {submitting ? "Збереження..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
