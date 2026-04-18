import { IconArrowRight } from "@dniproanimals/icons";
import { Card, cn } from "@dniproanimals/ui";
import Link from "next/link";
import type { ReactNode } from "react";

interface OverviewStatCardProps {
  icon: ReactNode;
  iconCls: string;
  value: number;
  label: string;
  subLabel?: string;
  subLabelCls?: string;
  href?: string;
}

export function OverviewStatCard({
  icon,
  iconCls,
  value,
  label,
  subLabel,
  subLabelCls,
  href,
}: OverviewStatCardProps) {
  const body = (
    <Card className="p-4 hover:shadow-sm transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div
          className={cn(
            "size-10 rounded-xl flex items-center justify-center",
            iconCls,
          )}
        >
          {icon}
        </div>
        {href && (
          <IconArrowRight
            size={16}
            className="text-gray-medium group-hover:text-foreground"
          />
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-gray-medium mt-0.5">{label}</p>
      {subLabel && (
        <p className={cn("text-[10px] mt-1", subLabelCls)}>{subLabel}</p>
      )}
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {body}
      </Link>
    );
  }

  return body;
}
