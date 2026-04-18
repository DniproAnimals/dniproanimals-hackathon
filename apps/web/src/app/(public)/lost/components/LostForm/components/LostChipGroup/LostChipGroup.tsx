import { cn } from "@dniproanimals/ui";

export interface ChipOption<V extends string> {
  value: V;
  label: string;
}

interface LostChipGroupProps<V extends string> {
  options: readonly ChipOption<V>[];
  value: V | "";
  onChange: (next: V) => void;
  className?: string;
}

export function LostChipGroup<V extends string>({
  options,
  value,
  onChange,
  className,
}: LostChipGroupProps<V>) {
  return (
    <div className={cn("grid gap-2 grid-cols-3", className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "py-2 rounded-xl text-sm font-medium transition-all border",
            value === opt.value
              ? "bg-red-50 border-red-300 text-red-700"
              : "bg-white border-gray-border hover:border-red-200",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
