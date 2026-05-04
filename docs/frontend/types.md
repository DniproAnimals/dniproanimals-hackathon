# Types

How TypeScript is organized in `apps/web`: where types live, when to extract them, and the small set of rules around `any`, `as`, and Zod inference.

## TypeScript is `strict`

The base config (`@dniproanimals/typescript-config/nextjs.json`) enables `strict: true`. The web app extends it and only relaxes one thing:

```json
// apps/web/tsconfig.json
{
  "extends": "@dniproanimals/typescript-config/nextjs.json",
  "compilerOptions": {
    "noUncheckedIndexedAccess": false,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

Code that doesn't type-check is rejected by `npm run type-check` (also enforced in pre-commit). Run it before pushing — `next typegen` runs first and refreshes the `PageProps`/`LayoutProps` globals (see below).

## Where types live

| Location                              | What goes there                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------- |
| `packages/contracts/src/modules/<m>/` | Domain Zod schemas + their inferred types (`Animal`, `CreateAnimalBody`, `animalSexSchema`) |
| `packages/contracts/src/shared/`      | Cross-domain Zod helpers (pagination, IDs, …)                                               |
| `apps/web/src/shared/types/`          | Cross-route TS helpers not derivable from Zod (e.g. `OmitQueryOptions`)                     |
| `Component/schema.ts`                 | Form-only Zod schema + inferred type (form values, defaults)                                |
| Inline in `Component.tsx`             | Component prop interfaces (`interface ComponentProps { ... }`)                              |

The web app has **no** `src/shared/models/` or `src/shared/schemas/` folders — domain types come from `@dniproanimals/contracts`, never from the app.

## `@dniproanimals/contracts` is the source of truth

For any data crossing the network — request bodies, response shapes, URL query params — the schema in `@dniproanimals/contracts` is canonical. The TypeScript type is **derived** from it:

```ts
// packages/contracts/src/modules/animals/schemas/createAnimal.schema.ts
import { z } from "zod";

export const createAnimalBodySchema = z.object({
  name: z.string().min(1),
  type: animalTypeSchema,
  // …
});

export type CreateAnimalBody = z.infer<typeof createAnimalBodySchema>;
```

Consumers always pull from the package:

```ts
import type {
  Animal,
  CreateAnimalBody,
  ListAnimalsQuery,
} from "@dniproanimals/contracts";
```

Never declare a parallel `interface Animal` next to the schema — that's two sources of truth that will drift.

### Reusing Zod enum tuples

The single-source-of-truth rule extends to enum tuples. Don't duplicate the literal options anywhere — read them off the schema:

```ts
// packages/contracts: declared once
export const animalTypeSchema = z.enum(["dog", "cat", "other"]);

// apps/web: parseAsStringLiteral + UI iteration reuse the same tuple
parseAsStringLiteral(animalTypeSchema.options)
animalTypeSchema.options.map((t) => …)
```

This pattern (saved as `feedback_zod_enum_single_source.md`) means a new enum value added to the schema flows automatically to URL state, dropdowns, validators — nothing else needs editing.

## Form schemas live with the form

UI-only schemas (form values that never go to the network as-is) live next to the component, in a sibling `schema.ts`. See [forms.md](forms.md) for the pattern. Don't put form schemas in `packages/contracts` — they're an app concern.

## Prop types live with the component

Prop interfaces are part of a component's contract. Put them at the top of `Component.tsx`:

```tsx
interface AnimalCardProps {
  animal: Animal;
  index?: number;
}

export function AnimalCard({ animal, index = 0 }: AnimalCardProps) {
  // …
}
```

Move them to `Component/types/Foo.ts` only when the interface itself grows (~20+ lines, or it's reused by sibling subcomponents).

## React Query option helpers

`apps/web/src/shared/types/react-query.d.ts` defines two helpers that every query/mutation hook uses to keep types tight while still allowing callers to pass overrides:

```ts
import type {
  UndefinedInitialDataOptions,
  UseMutationOptions,
} from "@tanstack/react-query";

export type OmitQueryOptions<
  QueryFn extends (...args: never[]) => unknown,
  Keys extends string,
> = Omit<UndefinedInitialDataOptions<Awaited<ReturnType<QueryFn>>>, Keys>;

export type OmitMutationOptions<
  MutationFn extends (...args: never[]) => unknown,
  Keys extends string,
> = Omit<
  UseMutationOptions<
    Awaited<ReturnType<MutationFn>>,
    Error,
    Parameters<MutationFn>[0]
  >,
  Keys
>;
```

Use them as:

```ts
options: OmitQueryOptions<
  typeof apiClient.animals.list,
  "queryKey" | "queryFn"
> = {};
options: OmitMutationOptions<typeof apiClient.animals.create, "mutationFn"> =
  {};
```

This is the project's standard shape — see [data-fetching.md](data-fetching.md).

## Next.js typegen globals

`apps/web` uses Next 16's `next typegen` to expose `PageProps<"/...">` and `LayoutProps<"/...">` as ambient globals (see `npm run type-check` which runs `next typegen` first). Pages and layouts use them directly:

```tsx
// app/(dashboard)/dashboard/animals/[id]/edit/page.tsx
"use client";
import { use } from "react";

export default function EditAnimalPage(
  props: PageProps<"/dashboard/animals/[id]/edit">,
) {
  const { id } = use(props.params);
  // …
}

// app/(dashboard)/dashboard/animals/[id]/edit/layout.tsx
export default async function EditAnimalLayout({
  children,
  params,
}: LayoutProps<"/dashboard/animals/[id]/edit">) {
  const { id } = await params;
  // …
}
```

These globals only exist after typegen runs. If you're seeing "Cannot find name 'PageProps'", run `npm run type-check` (which triggers `next typegen`) or `npx next typegen` directly.

## `interface` vs `type`

- **`interface`** — for object shapes (props, options, models). Allows declaration merging, plays nicely with extension.
- **`type`** — for unions, intersections, mapped/conditional types, function signatures, aliases.

```ts
interface ButtonProps {
  variant?: "primary" | "outline";
  onClick?: () => void;
}

type Variant = "primary" | "outline";
type Handler<T> = (value: T) => void;
```

## `any` and `as`

- **No `any`.** Use `unknown` and narrow with type guards or Zod parsing.
- **`as` only when justified.** Acceptable: `as const` for literal narrowing, or asserting a value the compiler can't infer after a runtime check (Zod parse, type guard). Always pair an unsafe `as` with a `// reason: ...` comment.

```ts
// ✅ as const for literal narrowing
const STATUSES = ["available", "reserved", "adopted"] as const;
type Status = (typeof STATUSES)[number];

// ✅ trust runtime check, then assert
if (!isAnimal(value)) throw new Error("invalid");
return value as Animal;

// ❌ unsafe assertion to "make TS happy"
const animal = response as Animal;
```

For external data, prefer parsing through the relevant Zod schema in `@dniproanimals/contracts` over assertions.

## Quick rules

- Domain types come from `@dniproanimals/contracts`. Never rewrite them in `apps/web`.
- Form schemas live in `Component/schema.ts`, type via `z.infer`.
- Cross-route TS helpers go in `apps/web/src/shared/types/`. Don't add `models/` or `schemas/` folders.
- Prop interfaces stay inline in `Component.tsx` until they grow (~20 lines).
- `interface` for shapes, `type` for unions/intersections/aliases.
- No `any`. `as` only with `as const` or after a runtime check.
- Reuse Zod enum `.options` everywhere — never duplicate literal tuples.
- Run `npm run type-check` before pushing — typegen feeds `PageProps`/`LayoutProps`.
