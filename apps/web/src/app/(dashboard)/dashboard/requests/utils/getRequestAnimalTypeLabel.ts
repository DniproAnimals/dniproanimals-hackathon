import { ANIMAL_TYPE_EMOJI, getAnimalTypeLabel } from "@/shared/constants";
import type { AnimalType } from "@dniproanimals/contracts";

export function getRequestAnimalTypeLabel(type: string | null): string {
  const emoji =
    (type && ANIMAL_TYPE_EMOJI[type as AnimalType]) ?? ANIMAL_TYPE_EMOJI.other;
  return `${emoji} ${getAnimalTypeLabel(type)}`;
}
