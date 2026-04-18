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

const ICON_CLS = "text-gray-400 shrink-0";

export function AnimalAttributes({ animal }: AnimalAttributesProps) {
  return (
    <div className="divide-y divide-gray-border mb-6">
      <AnimalAttributeRow
        icon={<IconPaw size={16} className={ICON_CLS} />}
        label="Вид"
        value={getAnimalTypeLabel(animal.type)}
      />
      {animal.breed && (
        <AnimalAttributeRow
          icon={<IconTag size={16} className={ICON_CLS} />}
          label="Порода"
          value={animal.breed}
        />
      )}
      {animal.sex && (
        <AnimalAttributeRow
          icon={<IconUser size={16} className={ICON_CLS} />}
          label="Стать"
          value={getAnimalSexLabel(animal.sex)}
        />
      )}
      <AnimalAttributeRow
        icon={<IconCalendar size={16} className={ICON_CLS} />}
        label="Вік"
        value={getAnimalAgeLabel(animal.ageMonths)}
      />
      <AnimalAttributeRow
        icon={<IconPackage size={16} className={ICON_CLS} />}
        label="Розмір"
        value={getAnimalSizeLabel(animal.size)}
      />
      {animal.weightKg && (
        <AnimalAttributeRow
          icon={<IconWeight size={16} className={ICON_CLS} />}
          label="Вага"
          value={`${animal.weightKg} кг`}
        />
      )}
      {animal.color && (
        <AnimalAttributeRow
          icon={<IconPalette size={16} className={ICON_CLS} />}
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
        icon={<IconCircleCheck size={16} className={ICON_CLS} />}
        label="Вакцинація"
        value={animal.vaccinated ? "Так" : "Ні"}
      />
      <AnimalAttributeRow
        icon={<IconCircleOff size={16} className={ICON_CLS} />}
        label="Стерилізація"
        value={animal.sterilized ? "Так" : "Ні"}
      />
      <AnimalAttributeRow
        icon={<IconBook size={16} className={ICON_CLS} />}
        label="Навчено"
        value={animal.trained ? "Так" : "Ні"}
      />
    </div>
  );
}
