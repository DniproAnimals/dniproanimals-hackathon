import type { ReactNode } from "react";

interface AnimalAttributeRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

export function AnimalAttributeRow({
  icon,
  label,
  value,
}: AnimalAttributeRowProps) {
  return (
    <div className="flex items-center [&_svg]:size-4 [&_svg]:text-gray-400 [&_svg]:shrink-0 gap-2.5 py-3">
      {icon}
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="text-sm text-gray-medium ml-auto">{value}</span>
    </div>
  );
}
