"use client";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import { useDonateFormContext } from "../../hooks/useDonateForm";

const PRESET_AMOUNTS = [100, 500, 1000] as const;

export function DonateAmountField() {
  const { control } = useDonateFormContext();

  return (
    <FormField
      control={control}
      name="amount"
      render={({ field }) => (
        <FormItem className="relative z-10 mb-6">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {PRESET_AMOUNTS.map((val) => (
              <Button
                key={val}
                type="button"
                variant={field.value === val ? "primary" : "outline"}
                onClick={() => field.onChange(val)}
                className="py-4 h-auto text-xl font-bold rounded-2xl border-2"
              >
                {val} ₴
              </Button>
            ))}
          </div>
          <FormControl>
            <Input
              type="number"
              min="1"
              placeholder="Або введіть свою суму..."
              value={Number.isFinite(field.value) ? field.value : ""}
              onChange={(e) => {
                const raw = e.target.value;
                field.onChange(raw === "" ? undefined : Number(raw));
              }}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl h-auto py-4 pl-4 pr-6 text-xl"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
