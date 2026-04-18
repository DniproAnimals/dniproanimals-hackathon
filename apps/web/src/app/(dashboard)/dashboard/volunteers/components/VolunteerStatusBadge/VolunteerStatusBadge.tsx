import { IconCircleCheckFilled, IconClockFilled } from "@dniproanimals/icons";
import { Badge } from "@dniproanimals/ui";

export function VolunteerStatusChip({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-green-600">
        <IconCircleCheckFilled size={10} />
        Активний
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-yellow-600">
      <IconClockFilled size={10} />
      Очікує
    </span>
  );
}

export function VolunteerStatusBadge({ active }: { active: boolean }) {
  return active ? (
    <Badge variant="success" size="sm">
      Активний
    </Badge>
  ) : (
    <Badge variant="warning" size="sm">
      Очікує
    </Badge>
  );
}
