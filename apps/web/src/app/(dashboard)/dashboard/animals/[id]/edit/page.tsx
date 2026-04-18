"use client";
import { useAnimalQuery, useUpdateAnimalMutation } from "@/shared/query-hooks";
import type { Animal } from "@dniproanimals/contracts";
import { useParams, useRouter } from "next/navigation";
import {
  AnimalForm,
  animalFormValuesToBody,
  type AnimalFormValues,
} from "../../components/AnimalForm";

function animalToFormValues(animal: Animal): AnimalFormValues {
  return {
    name: animal.name,
    description: animal.description ?? "",
    type: animal.type,
    breed: animal.breed ?? "",
    sex: animal.sex ?? "",
    ageMonths: animal.ageMonths,
    weightKg: animal.weightKg,
    size: animal.size ?? "",
    color: animal.color ?? "",
    vaccinated: !!animal.vaccinated,
    sterilized: !!animal.sterilized,
    trained: !!animal.trained,
    photos: animal.photos,
    contactName: animal.contactName ?? "",
    contactPhone: animal.contactPhone ?? "",
    contactEmail: animal.contactEmail ?? "",
    contactLocation: animal.contactLocation ?? "",
  };
}

export default function EditAnimalPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const router = useRouter();
  const { data: animal } = useAnimalQuery(numericId);
  const updateMutation = useUpdateAnimalMutation({
    onSuccess: (updated) => router.push(`/animals/${updated.id}`),
  });

  if (!animal) return null;

  return (
    <AnimalForm
      defaultValues={animalToFormValues(animal)}
      onSubmit={(values) =>
        updateMutation.mutate({
          id: numericId,
          body: animalFormValuesToBody(values),
        })
      }
      submitting={updateMutation.isPending}
      submitLabel="Зберегти зміни"
    />
  );
}
