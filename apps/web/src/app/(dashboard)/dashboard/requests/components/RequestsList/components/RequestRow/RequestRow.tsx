import {
  ADOPTION_STATUS_BADGE_VARIANT,
  ADOPTION_STATUS_LABEL,
} from "@/shared/constants";
import type { AdoptionRequestWithAnimal } from "@dniproanimals/contracts";
import { Badge } from "@dniproanimals/ui";
import { getRequestAnimalTypeLabel } from "../../../../utils/getRequestAnimalTypeLabel";

interface RequestRowProps {
  request: AdoptionRequestWithAnimal;
  onClick: () => void;
}

export function RequestRow({ request, onClick }: RequestRowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl border border-gray-border p-4 flex items-center justify-between gap-4 text-left hover:border-primary transition-colors"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-green-secondary shrink-0">
          {request.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground text-sm truncate">
              {request.name}
            </p>
            <Badge
              variant={ADOPTION_STATUS_BADGE_VARIANT[request.status]}
              size="sm"
            >
              {ADOPTION_STATUS_LABEL[request.status]}
            </Badge>
          </div>
          <p className="text-xs text-gray-medium mt-0.5">
            {getRequestAnimalTypeLabel(request.animalType)}:{" "}
            <span className="text-foreground font-medium">
              {request.animalName}
            </span>
            <span className="mx-1.5">·</span>
            {new Date(request.createdAt).toLocaleDateString("uk-UA")}
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-medium shrink-0">{request.phone}</p>
    </button>
  );
}
