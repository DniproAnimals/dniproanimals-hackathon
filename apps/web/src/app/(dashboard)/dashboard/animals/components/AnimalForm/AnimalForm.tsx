"use client";

import { Button, Form } from "@dniproanimals/ui";
import { AnimalAgeField } from "./components/AnimalAgeField";
import { AnimalBreedField } from "./components/AnimalBreedField";
import { AnimalColorField } from "./components/AnimalColorField";
import { AnimalContactsFields } from "./components/AnimalContactsFields";
import { AnimalCustomBreedField } from "./components/AnimalCustomBreedField";
import { AnimalCustomTypeField } from "./components/AnimalCustomTypeField";
import { AnimalDescriptionField } from "./components/AnimalDescriptionField";
import { AnimalDonationField } from "./components/AnimalDonationField";
import { AnimalNameField } from "./components/AnimalNameField";
import { AnimalOtherBreedField } from "./components/AnimalOtherBreedField";
import { AnimalPhotoField } from "./components/AnimalPhotoField";
import { AnimalSexField } from "./components/AnimalSexField";
import { AnimalSizeField } from "./components/AnimalSizeField";
import { AnimalTypeField } from "./components/AnimalTypeField";
import { AnimalWeightField } from "./components/AnimalWeightField";
import { useAnimalForm } from "./hooks/useAnimalForm";
import { ANIMAL_FORM_DEFAULTS, type AnimalFormValues } from "./schema";

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
  const form = useAnimalForm(defaultValues);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <AnimalPhotoField />
        <AnimalNameField />
        <AnimalDescriptionField />
        <AnimalTypeField />
        <AnimalCustomTypeField />
        <AnimalBreedField />
        <AnimalCustomBreedField />
        <AnimalOtherBreedField />
        <AnimalAgeField />
        <AnimalSexField />
        <AnimalWeightField />
        <AnimalSizeField />
        <AnimalColorField />
        <AnimalDonationField />
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
