// TODO: candidate to move server-side (DB table + admin CRUD).
// See AGENTS.md §7.2: editable business data belongs on the server.

export const DOG_BREEDS = [
  "Німецька вівчарка",
  "Лабрадор",
  "Стаффордширський тер'єр",
  "Хаскі",
  "Бульдог",
  "Такса",
  "Чихуахуа",
  "Коргі",
  "Мопс",
] as const;

export const CAT_BREEDS = [
  "Європейська короткошерста",
  "Сіамська",
  "Ангорська",
  "Мейн-кун",
  "Сфінкс",
  "Бенгальська",
] as const;

export const MIXED_BREED = "Мікс";

export const ALL_BREEDS: readonly string[] = [
  ...DOG_BREEDS,
  ...CAT_BREEDS,
  MIXED_BREED,
];

export const DOG_BREEDS_WITH_MIX: readonly string[] = [
  ...DOG_BREEDS,
  MIXED_BREED,
];

export const CAT_BREEDS_WITH_MIX: readonly string[] = [
  ...CAT_BREEDS,
  MIXED_BREED,
];
