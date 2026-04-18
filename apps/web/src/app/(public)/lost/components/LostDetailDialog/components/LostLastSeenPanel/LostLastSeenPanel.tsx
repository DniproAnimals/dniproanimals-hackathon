import type { LostAnimal } from "@dniproanimals/contracts";
import { IconCalendar, IconEye } from "@dniproanimals/icons";

export function LostLastSeenPanel({ item }: { item: LostAnimal }) {
  if (!item.lastSeenLocation && !item.lastSeenDate) return null;

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-2">
        Востаннє бачили
      </p>
      <div className="bg-red-50 rounded-xl p-3 space-y-1.5">
        {item.lastSeenLocation && (
          <div className="flex items-center gap-2 text-sm">
            <IconEye size={14} className="text-red-400" />
            <span>{item.lastSeenLocation}</span>
          </div>
        )}
        {item.lastSeenDate && (
          <div className="flex items-center gap-2 text-sm">
            <IconCalendar size={14} className="text-red-400" />
            <span>
              {new Date(item.lastSeenDate).toLocaleDateString("uk-UA")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
