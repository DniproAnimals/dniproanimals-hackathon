import {
  ADOPTION_STATUS_BADGE_VARIANT,
  ADOPTION_STATUS_LABEL,
} from "@/shared/constants";
import type { AdoptionRequestWithAnimal } from "@dniproanimals/contracts";
import { Badge } from "@dniproanimals/ui";

interface RequestDetailHeaderProps {
  request: AdoptionRequestWithAnimal;
}

export function RequestDetailHeader({ request }: RequestDetailHeaderProps) {
  return (
    <div className="p-5 pb-0 flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-green-secondary">
          {request.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">{request.name}</h2>
            <Badge
              variant={ADOPTION_STATUS_BADGE_VARIANT[request.status]}
              size="md"
            >
              {ADOPTION_STATUS_LABEL[request.status]}
            </Badge>
          </div>
          <p className="text-xs text-gray-medium mt-0.5">
            {new Date(request.createdAt).toLocaleDateString("uk-UA")}
          </p>
        </div>
      </div>
    </div>
  );
}
