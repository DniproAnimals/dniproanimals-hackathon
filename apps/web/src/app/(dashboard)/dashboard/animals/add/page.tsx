"use client";
import { useCreateAnimalMutation } from "@/shared/query-hooks";
import { useRouter } from "next/navigation";
import {
  AnimalForm,
  animalFormValuesToBody,
  type AnimalFormValues,
} from "../components/AnimalForm";

export default function AddAnimalPage() {
  const router = useRouter();
  const createMutation = useCreateAnimalMutation({
    onSuccess: (animal) => router.push(`/animals/${animal.id}`),
  });

  const handleSubmit = (values: AnimalFormValues) => {
    createMutation.mutate({
      ...animalFormValuesToBody(values),
      status: "available",
    });
  };

  return (
    <AnimalForm
      onSubmit={handleSubmit}
      submitting={createMutation.isPending}
      submitLabel="Додати тварину"
    />
  );
}
