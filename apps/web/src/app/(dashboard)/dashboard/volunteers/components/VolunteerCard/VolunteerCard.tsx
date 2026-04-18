import type { Volunteer } from "@dniproanimals/contracts";
import { IconPhoneFilled } from "@dniproanimals/icons";
import { VolunteerAvatar } from "../VolunteerAvatar";
import { VolunteerStatusChip } from "../VolunteerStatusBadge";

export function VolunteerCard({
  volunteer,
  onClick,
}: {
  volunteer: Volunteer;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-border p-4 text-left hover:border-primary transition-all flex gap-4"
    >
      <VolunteerAvatar volunteer={volunteer} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-semibold text-sm truncate">
            {volunteer.name}
            {volunteer.surname ? ` ${volunteer.surname}` : ""}
          </p>
          <VolunteerStatusChip active={!!volunteer.userId} />
        </div>
        {volunteer.description && (
          <p className="text-xs text-gray-medium line-clamp-1 mb-1">
            {volunteer.description}
          </p>
        )}
        {volunteer.phone && (
          <div className="flex items-center gap-2 text-[11px] text-gray-medium">
            <span className="flex items-center gap-0.5">
              <IconPhoneFilled size={10} />
              {volunteer.phone}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
