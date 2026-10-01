// TODO: candidate to move server-side (DB table + admin CRUD).
// See AGENTS.md §7.2: editable business data belongs on the server.

export const DOG_BREEDS = [
  "Німецька вівчарка",
  "Лабрадор",
  "Золотистий ретривер",
  "Стаффордширський тер'єр",
  "Хаскі",
  "Бульдог",
  "Французький бульдог",
  "Такса",
  "Чихуахуа",
  "Коргі",
  "Мопс",
  "Бігль",
  "Ротвейлер",
  "Доберман",
  "Джек-рассел-тер'єр",
  "Йоркширський тер'єр",
  "Шпіц",
] as const;

export const CAT_BREEDS = [
  "Європейська короткошерста",
  "Британська короткошерста",
  "Шотландська висловуха",
  "Сіамська",
  "Мейн-кун",
  "Сфінкс",
  "Бенгальська",
  "Персидська",
  "Ангора",
  "Абіссинська",
] as const;

export const MIXED_BREED = "Мікс";

export const CUSTOM_BREED = "__custom__";

export const DOG_BREEDS_WITH_MIX: readonly string[] = [
  ...DOG_BREEDS,
  MIXED_BREED,
];

export const CAT_BREEDS_WITH_MIX: readonly string[] = [
  ...CAT_BREEDS,
  MIXED_BREED,
];

export const ALL_BREEDS: readonly string[] = [
  ...DOG_BREEDS,
  ...CAT_BREEDS,
  MIXED_BREED,
];
