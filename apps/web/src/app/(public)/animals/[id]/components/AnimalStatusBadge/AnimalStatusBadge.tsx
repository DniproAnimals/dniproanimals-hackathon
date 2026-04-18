import type { AnimalStatus } from "@dniproanimals/contracts";
import { Badge } from "@dniproanimals/ui";

const LABEL: Record<Exclude<AnimalStatus, "available">, string> = {
  adopted: "Прилаштовано",
  reserved: "Зарезервовано",
};

export function AnimalStatusBadge({ status }: { status: AnimalStatus }) {
  if (status === "available") return null;
  return (
    <Badge
      variant={status === "adopted" ? "soft" : "warning"}
      size="md"
      className="font-semibold"
    >
      {LABEL[status]}
    </Badge>
  );
}
