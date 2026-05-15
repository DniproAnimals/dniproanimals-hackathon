# State management

The project uses four kinds of state. The right kind for the job avoids most bugs that look like "state management problems".

## The four kinds

| Kind             | Library / API             | Lifetime                                    | Shareable across users? |
| ---------------- | ------------------------- | ------------------------------------------- | ----------------------- |
| **URL state**    | `nuqs` (search params)    | Tied to the URL                             | Yes (copy the URL)      |
| **Server state** | TanStack React Query      | Cached client-side, owned by the server     | No                      |
| **Local state**  | `useState` / `useReducer` | Component lifetime                          | No                      |
| **Ref state**    | `useRef`                  | Component lifetime, doesn't trigger renders | No                      |

Cross-tree config (the React Query client, `nuqs` adapter) is plumbed through React Context. Context is **not** a state manager — it's a delivery mechanism for values that rarely change.

There is no Redux/Zustand/Jotai in this project. If you find yourself reaching for "a global store", revisit the matrix below — the answer is almost always URL state, server state, or a parent component holding the state and passing it down.

## Decision matrix

```text
Does the value live on the server?
├── Yes → React Query (src/shared/query-hooks/...)
└── No
    │
    Should the user be able to share or bookmark this state?
    ├── Yes → URL state (nuqs, useQueryStates in app/<route>/hooks/)
    └── No
        │
        Does it need to trigger a re-render when it changes?
        ├── Yes → useState / useReducer (kept close to the consumer)
        └── No  → useRef
```

## URL state with `nuqs`

For filters, pagination, sort order, opened tabs — anything where "share this URL and see what I see" should work.

Group related URL params behind a single `useQueryStates` hook in `app/<route>/hooks/`. This keeps parsers next to each other, makes the URL contract reusable, and atomically updates multiple params in one history entry. Saved feedback (`memory/feedback_hooks_location_nuqs.md`).

The canonical project example is `app/(public)/animals/hooks/useCatalogFilterState.ts` — note how it reuses Zod enum `.options` for `parseAsStringLiteral`, which keeps the URL contract in lock-step with the schema in `@dniproanimals/contracts`:

```ts
"use client";
import {
  animalSexSchema,
  animalSizeSchema,
  animalTypeSchema,
  listAnimalsSortSchema,
} from "@dniproanimals/contracts";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";

export function useCatalogFilterState() {
  return useQueryStates({
    type: parseAsStringLiteral(animalTypeSchema.options),
    sex: parseAsStringLiteral(animalSexSchema.options),
    size: parseAsStringLiteral(animalSizeSchema.options),
    breed: parseAsArrayOf(parseAsString).withDefault([]),
    color: parseAsArrayOf(parseAsString).withDefault([]),
    vaccinated: parseAsBoolean,
    sterilized: parseAsBoolean,
    trained: parseAsBoolean,
    q: parseAsString,
    sort: parseAsStringLiteral(listAnimalsSortSchema.options).withDefault(
      "newest",
    ),
  });
}
```

In the page (or any descendant), read the tuple:

```tsx
const [params, setParams] = useCatalogFilterState();
useAnimalsQuery(params); // hand straight to the query
setParams({ type: "dog" }); // partial update; preserves other params
```

Saved feedback (`memory/feedback_autonomous_subcomponents.md`): page-scoped sub-components (filters, search field, status tabs) call the page hook directly — don't drill `value`/`onChange` from a top-level filter composer.

`<NuqsAdapter>` is set up once in `app/layout.tsx`, sandwiched between `ReactQueryProvider` and `children`.

### Dialogs and URL state

Saved feedback (`memory/feedback_dialogs_props_not_nuqs.md`): the URL state lives on the **trigger container** (list, table, page), not inside the dialog. Dialogs themselves accept `Omit<DialogProps, "children">`-shaped props and don't read `nuqs`. This keeps dialogs reusable across screens.

## Server state with React Query

Anything that comes from the server lives in React Query. Don't copy it into `useState`.

```tsx
const { data: animals = [], isLoading } = useAnimalsQuery(params);
```

`animals` is the source of truth. If you mutate it, use a mutation hook and let the query invalidate (see [data-fetching.md](data-fetching.md)).

## Local state

For ephemeral UI state — whether a tooltip/dialog is open, transient animations, mobile-filter drawer visibility:

```tsx
const [showMobileFilters, setShowMobileFilters] = useState(false);
```

Lift state **up** when two siblings need it. Lift it **out** to URL state when the user might want to share it. Don't reach for context as a substitute for prop drilling unless 3+ levels are actually involved.

## Ref state

For values you need to remember across renders but that shouldn't trigger one — timers, focus targets, mutable third-party objects:

```tsx
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
```

Use a ref:

- For interval/timeout handles that you `clearInterval`/`clearTimeout` on cleanup.
- For "previous value" tracking inside an effect.
- For focusing inputs (`ref={inputRef}` + `inputRef.current?.focus()`).

Don't read or write `ref.current` during render — that's the rule that distinguishes refs from state.

## Context

Context delivers values, it doesn't manage state. The app uses it for:

- The React Query client (`ReactQueryProvider`).
- The `nuqs` adapter (`<NuqsAdapter>` in `app/layout.tsx`).
- React Hook Form context per form (`<Form {...form}>` from `@dniproanimals/ui` is itself a `FormProvider`).

Don't put rapidly-changing values in a custom context — every consumer re-renders on every change. If you find yourself splitting a context to "fix" re-renders, the value probably belongs in URL or server state.

## What this project doesn't use

- **No Redux / Zustand / Jotai / Recoil.** If you think you need a global store, propose adding it before reaching for one — the URL/server/local split has covered everything so far.
- **No `next-themes`.** Dark mode tokens exist in CSS but theme switching isn't wired (see [styling.md](styling.md#theming)).
- **No Context-based dialog/toast registries.** `Dialog` from `@dniproanimals/ui` is a per-instance Radix component; toasts aren't installed at all.

## Quick rules

- Server data → React Query, never `useState`.
- Shareable filters/pagination → `useQueryStates` in `app/<route>/hooks/`.
- One `useQueryStates` call per page, grouping all related params.
- Reuse Zod enum `.options` for `parseAsStringLiteral` — single source of truth.
- Sub-components read page hooks directly — no value/onChange drilling.
- Dialogs don't own URL state — the trigger container does.
- `useRef` for non-rendering values (timers, focus, third-party handles).
- `useState` for ephemeral UI flags lifted to the closest common ancestor.
