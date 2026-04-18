import type { ReactNode } from "react";

interface ContactRowProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}

export function ContactRow({ icon, label, children }: ContactRowProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="size-10 bg-primary/20 text-green-secondary rounded-full flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-1">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}
