import type { AdoptionRequestWithAnimal } from "@dniproanimals/contracts";
import { IconPawFilled } from "@dniproanimals/icons";
import Link from "next/link";
import { getRequestAnimalTypeLabel } from "../../../../utils/getRequestAnimalTypeLabel";

interface RequestAnimalCardProps {
  request: AdoptionRequestWithAnimal;
}

export function RequestAnimalCard({ request }: RequestAnimalCardProps) {
  return (
    <div className="bg-primary/10 rounded-xl p-3.5 flex items-center gap-3 mb-5">
      <IconPawFilled size={20} className="text-primary" />
      <div>
        <p className="text-xs text-gray-medium">Тварина</p>
        <p className="text-sm font-semibold">
          {request.animalName} · {getRequestAnimalTypeLabel(request.animalType)}
        </p>
      </div>
      <Link
        href={`/animals/${request.animalId}`}
        target="_blank"
        className="ml-auto text-xs text-green-secondary font-medium hover:underline"
      >
        Переглянути →
      </Link>
    </div>
  );
}
