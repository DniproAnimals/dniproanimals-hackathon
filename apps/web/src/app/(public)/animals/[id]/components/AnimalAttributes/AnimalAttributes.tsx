import {
  getAnimalAgeLabel,
  getAnimalColorHex,
  getAnimalSexLabel,
  getAnimalSizeLabel,
  getAnimalTypeLabel,
} from "@/shared/constants";
import type { Animal } from "@dniproanimals/contracts";
import {
  IconBook,
  IconCalendar,
  IconCircleCheck,
  IconCircleOff,
  IconPackage,
  IconPalette,
  IconPaw,
  IconTag,
  IconUser,
  IconWeight,
} from "@dniproanimals/icons";
import { AnimalAttributeRow } from "./components/AnimalAttributeRow";

interface AnimalAttributesProps {
  animal: Animal;
}

export function AnimalAttributes({ animal }: AnimalAttributesProps) {
  return (
    <div className="divide-y divide-gray-border mb-6">
      <AnimalAttributeRow
        icon={<IconPaw />}
        label="Вид"
        value={getAnimalTypeLabel(animal.type)}
      />
      {animal.breed && (
        <AnimalAttributeRow
          icon={<IconTag />}
          label="Порода"
          value={animal.breed}
        />
      )}
      {animal.sex && (
        <AnimalAttributeRow
          icon={<IconUser />}
          label="Стать"
          value={getAnimalSexLabel(animal.sex)}
        />
      )}
      <AnimalAttributeRow
        icon={<IconCalendar />}
        label="Вік"
        value={getAnimalAgeLabel(animal.ageMonths)}
      />
      <AnimalAttributeRow
        icon={<IconPackage />}
        label="Розмір"
        value={getAnimalSizeLabel(animal.size)}
      />
      {animal.weightKg && (
        <AnimalAttributeRow
          icon={<IconWeight />}
          label="Вага"
          value={`${animal.weightKg} кг`}
        />
      )}
      {animal.color && (
        <AnimalAttributeRow
          icon={<IconPalette />}
          label="Колір"
          value={
            <span className="flex items-center gap-2">
              {animal.color}
              <span
                className="inline-block size-4 rounded-full border border-gray-border shrink-0"
                style={{ backgroundColor: getAnimalColorHex(animal.color) }}
              />
            </span>
          }
        />
      )}
      <AnimalAttributeRow
        icon={<IconCircleCheck />}
        label="Вакцинація"
        value={animal.vaccinated ? "Так" : "Ні"}
      />
      <AnimalAttributeRow
        icon={<IconCircleOff />}
        label="Стерилізація"
        value={animal.sterilized ? "Так" : "Ні"}
      />
      <AnimalAttributeRow
        icon={<IconBook />}
        label="Навчено"
        value={animal.trained ? "Так" : "Ні"}
      />
    </div>
  );
}
