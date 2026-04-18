import { cn } from "@dniproanimals/ui";

export interface ChipOption<V extends string> {
  value: V;
  label: string;
}

interface AnimalChipGroupProps<V extends string> {
  options: readonly ChipOption<V>[];
  value: V | "";
  onChange: (next: V) => void;
  columns?: 2 | 3;
}

export function AnimalChipGroup<V extends string>({
  options,
  value,
  onChange,
  columns = 3,
}: AnimalChipGroupProps<V>) {
  const gridCls = columns === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className={cn("grid gap-2", gridCls)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "py-2.5 rounded-xl text-sm font-medium transition-all border",
            value === opt.value
              ? "bg-primary border-primary"
              : "bg-white border-gray-border hover:border-primary",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
