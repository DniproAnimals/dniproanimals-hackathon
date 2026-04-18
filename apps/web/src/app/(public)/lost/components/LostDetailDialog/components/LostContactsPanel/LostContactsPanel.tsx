import type { LostAnimal } from "@dniproanimals/contracts";
import { IconPhone, IconUser } from "@dniproanimals/icons";

export function LostContactsPanel({ item }: { item: LostAnimal }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-2">
        Контакти
      </p>
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 text-sm">
          <IconUser size={15} className="text-gray-400" />
          <span className="font-medium">{item.contactName}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <IconPhone size={15} className="text-gray-400" />
          <a href={`tel:${item.contactPhone}`} className="hover:underline">
            {item.contactPhone}
          </a>
        </div>
      </div>
    </div>
  );
}
