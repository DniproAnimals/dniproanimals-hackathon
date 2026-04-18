"use client";
import { Button, Form } from "@dniproanimals/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimalAgeField } from "./components/AnimalAgeField";
import { AnimalBreedField } from "./components/AnimalBreedField";
import { AnimalColorField } from "./components/AnimalColorField";
import { AnimalContactsFields } from "./components/AnimalContactsFields";
import { AnimalDescriptionField } from "./components/AnimalDescriptionField";
import { AnimalHealthField } from "./components/AnimalHealthField";
import { AnimalNameField } from "./components/AnimalNameField";
import { AnimalPhotoField } from "./components/AnimalPhotoField";
import { AnimalSexField } from "./components/AnimalSexField";
import { AnimalSizeField } from "./components/AnimalSizeField";
import { AnimalTypeField } from "./components/AnimalTypeField";
import { AnimalWeightField } from "./components/AnimalWeightField";
import {
  ANIMAL_FORM_DEFAULTS,
  animalFormSchema,
  type AnimalFormValues,
} from "./schema";

interface AnimalFormProps {
  defaultValues?: AnimalFormValues;
  onSubmit: (values: AnimalFormValues) => void;
  submitting?: boolean;
  submitLabel: string;
}

export function AnimalForm({
  defaultValues = ANIMAL_FORM_DEFAULTS,
  onSubmit,
  submitting,
  submitLabel,
}: AnimalFormProps) {
  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(animalFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <AnimalPhotoField />
        <AnimalNameField />
        <AnimalDescriptionField />
        <AnimalTypeField />
        <AnimalBreedField />
        <AnimalSexField />
        <AnimalAgeField />
        <AnimalWeightField />
        <AnimalSizeField />
        <AnimalColorField />
        <AnimalHealthField />
        <AnimalContactsFields />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Збереження..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
