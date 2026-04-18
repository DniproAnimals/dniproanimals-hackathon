"use client";
import { useDeleteAnimalMutation, useMeQuery } from "@/shared/query-hooks";
import { endpoints } from "@dniproanimals/endpoints";
import { IconPencil, IconTrash } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AnimalAdminActions({ animalId }: { animalId: number }) {
  const { data: user } = useMeQuery();
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteMut = useDeleteAnimalMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoints.animals.list()] });
      router.push("/");
    },
  });

  if (user?.role !== "admin") return null;

  const handleDelete = () => {
    if (!confirm("Видалити цю тварину?")) return;
    deleteMut.mutate(animalId);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        asChild
        className="bg-blue-50 text-blue-600 hover:bg-blue-100"
        title="Редагувати"
      >
        <Link href={`/dashboard/animals/${animalId}/edit`}>
          <IconPencil size={14} />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleDelete}
        className="bg-red-50 text-red-600 hover:bg-red-100"
        title="Видалити"
      >
        <IconTrash size={14} />
      </Button>
    </>
  );
}
