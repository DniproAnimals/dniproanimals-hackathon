import type { ReactNode } from "react";

interface AnimalContactRowProps {
  icon: ReactNode;
  children: ReactNode;
}

export function AnimalContactRow({ icon, children }: AnimalContactRowProps) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      {icon}
      {children}
    </div>
  );
}
