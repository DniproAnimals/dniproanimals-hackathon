// TODO: candidate to move server-side (DB table + admin CRUD).
// See AGENTS.md §7.2: editable business data belongs on the server.

export type AnimalColorOption = { value: string; hex: string };

export const ANIMAL_COLORS: readonly AnimalColorOption[] = [
  { value: "Білий", hex: "#ffffff" },
  { value: "Чорний", hex: "#1a1a1a" },
  { value: "Сірий", hex: "#9e9e9e" },
  { value: "Рудий", hex: "#c45e1a" },
  { value: "Коричневий", hex: "#6d4c2e" },
  { value: "Золотистий", hex: "#d4a017" },
  { value: "Кремовий", hex: "#f5deb3" },
  { value: "Тигровий", hex: "#8B6914" },
];

export const DEFAULT_ANIMAL_COLOR_HEX = "#ced48c";

const ANIMAL_COLOR_HEX_BY_NAME: Record<string, string> = Object.fromEntries(
  ANIMAL_COLORS.map((c) => [c.value.toLowerCase(), c.hex]),
);

export function getAnimalColorHex(color: string | null | undefined): string {
  if (!color) return DEFAULT_ANIMAL_COLOR_HEX;
  return (
    ANIMAL_COLOR_HEX_BY_NAME[color.toLowerCase().trim()] ??
    DEFAULT_ANIMAL_COLOR_HEX
  );
}
