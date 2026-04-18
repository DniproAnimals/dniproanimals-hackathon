import {
  ADOPTION_STATUS_BADGE_VARIANT,
  ADOPTION_STATUS_LABEL,
} from "@/shared/constants";
import type { AdoptionRequestWithAnimal } from "@dniproanimals/contracts";
import { Badge } from "@dniproanimals/ui";

interface RecentRequestRowProps {
  request: AdoptionRequestWithAnimal;
}

export function RecentRequestRow({ request }: RecentRequestRowProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div className="size-8 rounded-full bg-orange-50 flex items-center justify-center text-xs font-bold text-orange-500 shrink-0">
        {request.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {request.name}
        </p>
        <p className="text-[10px] text-gray-medium truncate">
          хоче усиновити{" "}
          <span className="text-foreground">{request.animalName}</span>
        </p>
      </div>
      <Badge variant={ADOPTION_STATUS_BADGE_VARIANT[request.status]} size="sm">
        {ADOPTION_STATUS_LABEL[request.status]}
      </Badge>
    </div>
  );
}
