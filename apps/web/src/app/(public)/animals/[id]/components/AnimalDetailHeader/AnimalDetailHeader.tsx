import type { Animal } from "@dniproanimals/contracts";
import { cn } from "@dniproanimals/ui";
import { AdoptButton } from "../AdoptButton";
import { AnimalAdminActions } from "../AnimalAdminActions";
import { AnimalStatusBadge } from "../AnimalStatusBadge";
import { FavoriteToggle } from "../FavoriteToggle";

export function AnimalDetailHeader({ animal }: { animal: Animal }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-1">
      <div className="flex items-center gap-2.5">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {animal.name}
        </h1>
        {animal.sex && (
          <span
            className={cn(
              "text-xl",
              animal.sex === "male" ? "text-blue-400" : "text-pink-400",
            )}
          >
            {animal.sex === "male" ? "♂" : "♀"}
          </span>
        )}
        <FavoriteToggle animalId={animal.id} />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <AnimalAdminActions animalId={animal.id} />
        {animal.status === "available" && <AdoptButton />}
        <AnimalStatusBadge status={animal.status} />
      </div>
    </div>
  );
}
