// TODO: candidate to move server-side (DB table + admin CRUD / i18n).
// See AGENTS.md §7.2: editable business data belongs on the server.

import type {
  AnimalSex,
  AnimalSize,
  AnimalType,
} from "@dniproanimals/contracts";

export const ANIMAL_TYPE_LABEL: Record<AnimalType, string> = {
  dog: "Собака",
  cat: "Кіт",
  other: "Інше",
};

export const ANIMAL_TYPE_EMOJI: Record<AnimalType, string> = {
  dog: "🐕",
  cat: "🐈",
  other: "🐾",
};

export const ANIMAL_TYPE_LABEL_PLURAL: Record<AnimalType, string> = {
  dog: "Собаки",
  cat: "Коти",
  other: "Інші тварини",
};

export const ANIMAL_TYPE_GENITIVE_PLURAL: Record<AnimalType, string> = {
  dog: "собак",
  cat: "котів",
  other: "тварин",
};

export const ANIMAL_SEX_LABEL: Record<AnimalSex, string> = {
  male: "Хлопчик",
  female: "Дівчинка",
};

export const ANIMAL_SEX_LABEL_PLURAL: Record<AnimalSex, string> = {
  male: "хлопчики",
  female: "дівчинки",
};

export const ANIMAL_SEX_TYPE_ADJECTIVE_PLURAL: Record<
  AnimalType,
  Record<AnimalSex, string>
> = {
  dog: { male: "собаки-хлопчики", female: "собаки-дівчинки" },
  cat: { male: "коти-хлопчики", female: "коти-дівчинки" },
  other: { male: "тварини-хлопчики", female: "тварини-дівчинки" },
};

export const ANIMAL_SIZE_LABEL: Record<AnimalSize, string> = {
  small: "Малий",
  medium: "Середній",
  large: "Великий",
};

export const ANIMAL_SIZE_LABEL_PLURAL: Record<AnimalSize, string> = {
  small: "маленькі",
  medium: "середні",
  large: "великі",
};

export const ANIMAL_SIZE_LABEL_PLURAL_CAP: Record<AnimalSize, string> = {
  small: "Маленькі",
  medium: "Середні",
  large: "Великі",
};

const UNKNOWN_LABEL = "Невідомо";

export function getAnimalTypeLabel(
  type: AnimalType | string | null | undefined,
): string {
  if (!type) return UNKNOWN_LABEL;
  return ANIMAL_TYPE_LABEL[type as AnimalType] ?? UNKNOWN_LABEL;
}

export function getAnimalSizeLabel(
  size: AnimalSize | string | null | undefined,
): string {
  if (!size) return UNKNOWN_LABEL;
  return ANIMAL_SIZE_LABEL[size as AnimalSize] ?? UNKNOWN_LABEL;
}

export function getAnimalSexLabel(
  sex: AnimalSex | string | null | undefined,
): string {
  if (!sex) return UNKNOWN_LABEL;
  return ANIMAL_SEX_LABEL[sex as AnimalSex] ?? UNKNOWN_LABEL;
}

export function getAnimalAgeLabel(months: number | null | undefined): string {
  if (!months) return UNKNOWN_LABEL;
  if (months < 12) return `${months} міс.`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const yWord = years === 1 ? "рік" : years < 5 ? "роки" : "років";
  if (rem === 0) return `${years} ${yWord}`;
  return `${years} ${yWord} ${rem} міс.`;
}
