"use client";
import { Button, Form } from "@dniproanimals/ui";
import { OrganizationContactsFields } from "./components/OrganizationContactsFields";
import { OrganizationDescriptionField } from "./components/OrganizationDescriptionField";
import { OrganizationLocationField } from "./components/OrganizationLocationField";
import { OrganizationNameField } from "./components/OrganizationNameField";
import { OrganizationPhotoField } from "./components/OrganizationPhotoField";
import { useOrganizationForm } from "./hooks/useOrganizationForm";
import {
  ORGANIZATION_FORM_DEFAULTS,
  type OrganizationFormValues,
} from "./schema";

interface OrganizationFormProps {
  defaultValues?: OrganizationFormValues;
  onSubmit: (values: OrganizationFormValues) => void;
  submitting?: boolean;
  submitLabel: string;
}

export function OrganizationForm({
  defaultValues = ORGANIZATION_FORM_DEFAULTS,
  onSubmit,
  submitting,
  submitLabel,
}: OrganizationFormProps) {
  const form = useOrganizationForm(defaultValues);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <OrganizationPhotoField />
        <OrganizationNameField />
        <OrganizationDescriptionField />
        <OrganizationLocationField />
        <OrganizationContactsFields />
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
