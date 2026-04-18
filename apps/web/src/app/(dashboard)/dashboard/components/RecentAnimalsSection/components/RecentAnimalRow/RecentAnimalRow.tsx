import {
  ANIMAL_STATUS_BADGE_VARIANT,
  ANIMAL_STATUS_LABEL,
  ANIMAL_TYPE_EMOJI,
} from "@/shared/constants";
import type { Animal } from "@dniproanimals/contracts";
import { IconClock } from "@dniproanimals/icons";
import { Badge } from "@dniproanimals/ui";
import { timeAgo } from "../../../../utils/timeAgo";

interface RecentAnimalRowProps {
  animal: Animal;
}

export function RecentAnimalRow({ animal }: RecentAnimalRowProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs shrink-0">
        {ANIMAL_TYPE_EMOJI[animal.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {animal.name}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-medium">
          <IconClock size={10} />
          {timeAgo(animal.createdAt)}
        </div>
      </div>
      <Badge variant={ANIMAL_STATUS_BADGE_VARIANT[animal.status]} size="sm">
        {ANIMAL_STATUS_LABEL[animal.status]}
      </Badge>
    </div>
  );
}
