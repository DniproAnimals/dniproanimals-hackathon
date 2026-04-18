import type { ReactNode } from "react";

interface LostAttributeRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

export function LostAttributeRow({
  icon,
  label,
  value,
}: LostAttributeRowProps) {
  return (
    <div className="flex items-center gap-2.5 py-2">
      {icon}
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm text-gray-medium ml-auto">{value}</span>
    </div>
  );
}
