import type { Volunteer } from "@dniproanimals/contracts";
import { cn } from "@dniproanimals/ui";

interface TeamMemberChipProps {
  volunteer: Volunteer;
}

export function TeamMemberChip({ volunteer }: TeamMemberChipProps) {
  const isActive = !!volunteer.userId;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-gray-border/40">
      <div
        className={cn(
          "size-6 rounded-full flex items-center justify-center text-[10px] font-bold",
          isActive
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-medium",
        )}
      >
        {volunteer.name.charAt(0)}
      </div>
      <span className="text-xs font-medium text-foreground">
        {volunteer.name}
        {volunteer.surname ? ` ${volunteer.surname.charAt(0)}.` : ""}
      </span>
    </div>
  );
}
