"use client";
import { ImageFallback } from "@/shared/components/ImageFallback";
import {
  ANIMAL_STATUS_BADGE_VARIANT,
  ANIMAL_STATUS_LABEL,
  getAnimalSexLabel,
  getAnimalTypeLabel,
} from "@/shared/constants";
import { useDeleteAnimalMutation } from "@/shared/query-hooks";
import type { Animal } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { Badge, Button, TableCell, TableRow } from "@dniproanimals/ui";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface AnimalsTableRowProps {
  animal: Animal;
}

export function AnimalsTableRow({ animal }: AnimalsTableRowProps) {
  const queryClient = useQueryClient();
  const deleteMut = useDeleteAnimalMutation({
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [endpoints.animals.list()] }),
  });

  const handleDelete = () => {
    if (!confirm("Видалити тварину?")) return;
    deleteMut.mutate(animal.id);
  };

  const photo = animal.photos[0];
  return (
    <TableRow>
      <TableCell>
        <Link
          href={`/animals/${animal.id}`}
          className="flex items-center gap-3"
        >
          {photo ? (
            <ImageFallback
              src={photo}
              alt={animal.name}
              width={36}
              height={36}
              className="size-9 rounded-lg object-cover"
            />
          ) : (
            <div className="size-9 rounded-lg bg-muted flex items-center justify-center text-xs text-gray-medium">
              {animal.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">{animal.name}</p>
            {animal.breed && (
              <p className="text-xs text-gray-medium">{animal.breed}</p>
            )}
          </div>
        </Link>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-gray-medium">
        {getAnimalTypeLabel(animal.type)}
      </TableCell>
      <TableCell className="hidden md:table-cell text-gray-medium">
        {animal.sex ? getAnimalSexLabel(animal.sex) : ""}
      </TableCell>
      <TableCell>
        <Badge variant={ANIMAL_STATUS_BADGE_VARIANT[animal.status]} size="sm">
          {ANIMAL_STATUS_LABEL[animal.status]}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link href={`/dashboard/animals/${animal.id}/edit`}>
              Редагувати
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-destructive hover:bg-red-50"
            onClick={handleDelete}
            disabled={deleteMut.isPending}
          >
            Видалити
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
