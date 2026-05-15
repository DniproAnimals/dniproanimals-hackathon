# Hooks

Where custom hooks live, what counts as a hook, and the conventions for shape and naming.

## Where hooks live

| Location                                            | What goes there                                                                              |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `apps/web/src/shared/query-hooks/queries/`          | React Query `useXxxQuery` wrappers                                                           |
| `apps/web/src/shared/query-hooks/mutations/`        | React Query `useXxxMutation` wrappers                                                        |
| `apps/web/src/shared/query-hooks/infinite-queries/` | React Query `useXxxInfiniteQuery` wrappers                                                   |
| `apps/web/src/shared/hooks/`                        | Cross-route hooks that aren't data fetching (`useDebouncedCallback`, `useLogOut`)            |
| `apps/web/src/app/<route>/hooks/`                   | Route-local hooks (e.g. `useCatalogFilterState` for `/animals`)                              |
| `Component/hooks/`                                  | Hooks coupled to one component (e.g. `useOrganizationForm` + typed `useFormContext` wrapper) |

There is **no `apps/web/src/hooks/`** — global hooks live in `src/shared/hooks/`. Don't add a top-level `hooks/` folder.

Decision tree:

```text
Is the hook a thin React Query wrapper?
└── Yes → src/shared/query-hooks/{queries|mutations|infinite-queries}/

Is it used by a single page or route?
└── Yes → app/<route>/hooks/

Is it used by a single component?
└── Yes → Component/hooks/

Used in 2+ places, not data-fetching?
└── Yes → src/shared/hooks/
```

## Naming

- **File** — `useFoo.ts`. camelCase, always starts with `use`.
- **Function** — `useFoo`, named export.
- **One hook per file.** If two hooks are tightly related (e.g. a `useForm` plus its `useFormContext` wrapper), they may share a file — but prefer separate files unless they truly belong together.
- **Don't prefix `use*` unless the function actually calls hooks.** A pure helper is a util, not a hook.

## What to import (and what's not installed)

`apps/web` does **not** depend on `usehooks-ts`. The project uses a small set of hand-rolled hooks instead:

| Need                     | Use                                                                           |
| ------------------------ | ----------------------------------------------------------------------------- |
| Debounce a callback      | `useDebouncedCallback` from `@/shared/hooks`                                  |
| Log out the current user | `useLogOut` from `@/shared/hooks`                                             |
| Read URL state           | `useQueryStates` from `nuqs` — see [state-management.md](state-management.md) |
| Stable IDs               | `useId` from React                                                            |
| Server data              | A query/mutation hook from `@/shared/query-hooks`                             |

If you want a generic utility hook (`useToggle`, `useCopyToClipboard`, …) — first propose adding `usehooks-ts` to `apps/web`. Don't write a one-off implementation just to avoid the dependency conversation.

## Shape of a custom hook

Pulled from the real `useDebouncedCallback`:

```ts
"use client";
import { useCallback, useEffect, useRef } from "react";

type AnyFn = (...args: never[]) => unknown;

export function useDebouncedCallback<T extends AnyFn>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay],
  );
}
```

Conventions:

- **`"use client"`** on every file with a hook. Hooks run on the client.
- **Named export.** Default exports for hooks make project-wide search painful.
- **Explicit return type** when the hook returns more than one value.
- **Options as a single object** when the hook takes 2+ parameters. Easier to extend without breaking call sites.
- **Return a named object for 3+ values**, not a tuple. Tuples become positional and brittle:

  ```ts
  return { value, setValue, reset, error }; // ✅
  return [value, setValue, reset, error] as const; // ❌
  ```

## Page-scoped state hooks (`useQueryStates`)

URL-backed filter state lives in a single hook per page, grouping all related params behind one `useQueryStates`. Reuse the Zod enum's `.options` for `parseAsStringLiteral` so the schema is the single source of truth.

```ts
// app/(public)/animals/hooks/useCatalogFilterState.ts
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

Saved feedback (`memory/feedback_zod_enum_single_source.md`): never duplicate the literal tuple. If you have a Zod enum, its `.options` is the tuple to feed into `parseAsStringLiteral`, UI iteration, etc.

## Avoid `useEffect` for derivable state

Most things people reach to `useEffect` for can be done in render or via state-reset patterns:

| Anti-pattern                                                       | Use instead                                            |
| ------------------------------------------------------------------ | ------------------------------------------------------ |
| Mirror props/state into a new piece of state via `useEffect`       | Compute during render                                  |
| Reset child state via `useEffect(() => setX(initial), [parentId])` | Pass `key={parentId}` so React mounts a fresh instance |
| Sync server data into `useState`                                   | Read directly from React Query's `data`                |
| Manual fetch + race-guard cleanup                                  | A query hook (`useXxxQuery`) — it handles cancellation |

Effects are an escape hatch for external systems (timers, subscriptions, third-party libs). Most app code doesn't need one.

## Quick rules

- One hook per file. File name matches the function: `useFoo.ts` → `useFoo`.
- React Query wrappers go in `src/shared/query-hooks/{queries|mutations|infinite-queries}/`.
- Cross-route hooks go in `src/shared/hooks/`. **Not** `src/hooks/` (doesn't exist).
- Page-local URL state lives in `app/<route>/hooks/use<Page>FilterState.ts` via `useQueryStates`.
- No `usehooks-ts` — use `useDebouncedCallback` for debounce.
- Return named objects for 3+ values; tuples only for 2-tuples that read like `[state, setter]`.
