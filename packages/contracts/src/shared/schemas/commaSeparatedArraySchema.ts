import { z } from "zod";

export function commaSeparatedArraySchema<
  T extends z.ZodType<string, z.ZodTypeDef, string> = z.ZodString,
>(itemSchema?: T) {
  return z
    .string()
    .or(z.string().array())
    .transform((val) => {
      if (Array.isArray(val)) {
        return val;
      }
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    })
    .pipe(z.array(itemSchema ?? (z.string() as unknown as T)));
}
