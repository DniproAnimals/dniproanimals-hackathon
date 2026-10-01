export type AnimalColorOption = {
  value: string;
  hex: string;
};

export const OTHER_ANIMAL_COLOR_VALUE = "__other__";

export const ANIMAL_COLORS: readonly AnimalColorOption[] = [
  { value: "Білий", hex: "#FFFFFF" },
  { value: "Чорний", hex: "#1A1A1A" },
  { value: "Сірий", hex: "#9E9E9E" },
  { value: "Коричневий", hex: "#6D4C2E" },
  { value: "Рудий", hex: "#C45E1A" },
  { value: "Бежевий", hex: "#D8C3A5" },
  { value: "Золотистий", hex: "#D4A017" },
  { value: "Кремовий", hex: "#F5DEB3" },
];

export const DEFAULT_ANIMAL_COLOR_HEX = "#ced48c";
export const CUSTOM_ANIMAL_COLOR_PREFIX = "custom:";

const ANIMAL_COLOR_HEX_BY_NAME: Record<string, string> = Object.fromEntries(
  ANIMAL_COLORS.map((c) => [c.value.toLowerCase(), c.hex]),
);

type CustomAnimalColor = {
  name: string;
  hex: string;
};

export function createCustomAnimalColor(name: string, hex: string): string {
  return `${CUSTOM_ANIMAL_COLOR_PREFIX}${hex}|${encodeURIComponent(name.trim())}`;
}

export function parseCustomAnimalColor(
  color: string | null | undefined,
): CustomAnimalColor | null {
  if (!color?.startsWith(CUSTOM_ANIMAL_COLOR_PREFIX)) return null;

  const [hex, encodedName] = color
    .slice(CUSTOM_ANIMAL_COLOR_PREFIX.length)
    .split("|", 2);

  if (!hex || !encodedName || !isValidHexColor(hex)) return null;

  try {
    return { hex, name: decodeURIComponent(encodedName) };
  } catch {
    return null;
  }
}

export function getAnimalColorHex(color: string | null | undefined): string {
  if (!color) return DEFAULT_ANIMAL_COLOR_HEX;

  const customColor = parseCustomAnimalColor(color);
  if (customColor) return customColor.hex;

  return (
    ANIMAL_COLOR_HEX_BY_NAME[color.toLowerCase().trim()] ??
    (isValidHexColor(color) ? color : DEFAULT_ANIMAL_COLOR_HEX)
  );
}

export function getAnimalColorLabel(color: string): string {
  return parseCustomAnimalColor(color)?.name ?? color;
}

export function isValidHexColor(value: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}
