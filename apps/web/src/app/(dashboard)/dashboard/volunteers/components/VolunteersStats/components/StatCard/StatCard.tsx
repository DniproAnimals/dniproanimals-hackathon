import { Card, cn } from "@dniproanimals/ui";
import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  colorCls: string;
  value: number;
  label: string;
}

export function StatCard({ icon, colorCls, value, label }: StatCardProps) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div
        className={cn(
          "size-10 rounded-xl flex items-center justify-center",
          colorCls,
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-[11px] text-gray-medium">{label}</p>
      </div>
    </Card>
  );
}
