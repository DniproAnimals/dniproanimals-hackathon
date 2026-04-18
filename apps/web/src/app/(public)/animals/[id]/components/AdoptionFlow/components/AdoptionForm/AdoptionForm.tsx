"use client";
import { useCreateAdoptionMutation } from "@/shared/query-hooks";
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
} from "@dniproanimals/ui";
import { AdoptionContactFieldsGroup } from "./components/AdoptionContactFieldsGroup";
import { AdoptionLocationField } from "./components/AdoptionLocationField";
import { AdoptionMessageField } from "./components/AdoptionMessageField";
import { AdoptionNameField } from "./components/AdoptionNameField";
import { AdoptionPhoneField } from "./components/AdoptionPhoneField";
import { useAdoptionForm } from "./hooks/useAdoptionForm";
import { adoptionFormValuesToBody, type AdoptionFormValues } from "./schema";

interface AdoptionFormProps {
  animalId: number;
  onSuccess: () => void;
}

export function AdoptionForm({ animalId, onSuccess }: AdoptionFormProps) {
  const form = useAdoptionForm();
  const mutation = useCreateAdoptionMutation({ onSuccess });

  const handleSubmit = (values: AdoptionFormValues) => {
    mutation.mutate(adoptionFormValuesToBody(values, animalId));
  };

  return (
    <DialogContent className="max-w-md space-y-3">
      <DialogHeader>
        <DialogTitle>Заявка на усиновлення</DialogTitle>
        <DialogDescription>Вкажіть як з вами зв&apos;язатися</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <AdoptionNameField />
          <AdoptionPhoneField />
          <AdoptionLocationField />
          <AdoptionMessageField />
          <AdoptionContactFieldsGroup />
          <Button
            type="submit"
            variant="primary"
            disabled={mutation.isPending}
            className="w-full py-3 h-auto"
          >
            {mutation.isPending ? "Надсилання..." : "Надіслати заявку"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
