import type { LostAnimal } from "@dniproanimals/contracts";
import {
  IconCalendar,
  IconPackage,
  IconPalette,
  IconPaw,
  IconTag,
  IconUser,
} from "@dniproanimals/icons";
import { LostAttributeRow } from "./components/LostAttributeRow";

interface LostDetailAttributesProps {
  item: LostAnimal;
}

const SIZE_LABELS: Record<string, string> = {
  small: "Малий",
  medium: "Середній",
  large: "Великий",
};

const ICON_CLS = "text-gray-400";

export function LostDetailAttributes({ item }: LostDetailAttributesProps) {
  return (
    <div className="divide-y divide-gray-border mb-4">
      {item.animalType && (
        <LostAttributeRow
          icon={<IconPaw size={15} className={ICON_CLS} />}
          label="Вид"
          value={item.animalType}
        />
      )}
      {item.breed && (
        <LostAttributeRow
          icon={<IconTag size={15} className={ICON_CLS} />}
          label="Порода"
          value={item.breed}
        />
      )}
      {item.sex && (
        <LostAttributeRow
          icon={<IconUser size={15} className={ICON_CLS} />}
          label="Стать"
          value={item.sex === "male" ? "Хлопчик" : "Дівчинка"}
        />
      )}
      {item.color && (
        <LostAttributeRow
          icon={<IconPalette size={15} className={ICON_CLS} />}
          label="Колір"
          value={item.color}
        />
      )}
      {item.size && (
        <LostAttributeRow
          icon={<IconPackage size={15} className={ICON_CLS} />}
          label="Розмір"
          value={SIZE_LABELS[item.size] ?? item.size}
        />
      )}
      <LostAttributeRow
        icon={<IconCalendar size={15} className={ICON_CLS} />}
        label="Опубліковано"
        value={new Date(item.createdAt).toLocaleDateString("uk-UA")}
      />
    </div>
  );
}
