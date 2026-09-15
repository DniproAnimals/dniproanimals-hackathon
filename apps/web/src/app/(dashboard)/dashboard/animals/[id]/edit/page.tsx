"use client";
import { useAnimalQuery, useUpdateAnimalMutation } from "@/shared/query-hooks";
import type { Animal } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use } from "react";
import {
  AnimalForm,
  animalFormValuesToBody,
  type AnimalFormValues,
} from "../../components/AnimalForm";
import { AnimalSupportManager } from "./components/AnimalSupportManager";

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
    donationsEnabled: animal.donationsEnabled,
    photos: animal.photos,
    contactName: animal.contactName ?? "",
    contactPhone: animal.contactPhone ?? "",
    contactEmail: animal.contactEmail ?? "",
    contactLocation: animal.contactLocation ?? "",
  };
}

export default function EditAnimalPage(
  props: PageProps<"/dashboard/animals/[id]/edit">,
) {
  const { id } = use(props.params);
  const numericId = Number(id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: animal } = useAnimalQuery(numericId);
  const updateMutation = useUpdateAnimalMutation({
    onSuccess: (updated) => {
      queryClient.setQueryData(
        [endpoints.animals.get({ id: updated.id })],
        updated,
      );
      void queryClient.invalidateQueries({
        queryKey: [endpoints.animals.list()],
      });
      router.push(`/animals/${updated.id}`);
    },
  });

  if (!animal) return null;

  return (
    <>
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
      <AnimalSupportManager animal={animal} />
    </>
  );
}
