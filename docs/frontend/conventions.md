# Conventions

File naming, imports, exports, comments. Keep these consistent so the codebase reads as a single voice.

## File naming

| Kind                     | Convention                                             | Example                                            |
| ------------------------ | ------------------------------------------------------ | -------------------------------------------------- |
| Component                | `PascalCase.tsx`                                       | `Button.tsx`, `AnimalCard.tsx`                     |
| Component folder         | `PascalCase/`                                          | `Button/`, `OrganizationForm/`                     |
| Component sibling schema | `schema.ts` (sibling, not in `constants/`)             | `OrganizationForm/schema.ts`                       |
| Hook                     | `useCamelCase.ts`                                      | `useDebouncedCallback.ts`, `useAnimalsQuery.ts`    |
| Utility                  | `camelCase.ts`                                         | `pluralize.ts`, `repeat.ts`                        |
| Constant file            | `kebab-case.ts` (file), `SCREAMING_SNAKE_CASE` exports | `animal-status.ts` exporting `ANIMAL_STATUS_LABEL` |
| Test (future)            | `PascalCase.test.tsx` / `camelCase.test.ts`            | `Button.test.tsx`, `pluralize.test.ts`             |
| Barrel                   | `index.ts`                                             | one per component or topic folder                  |

Notes:

- The test convention is **singular `.test.`**, not `.tests.` — but the project doesn't have a Vitest setup yet (see [scripts.md](scripts.md#things-that-dont-exist-yet)).
- `Component.variants.ts` and `Component.stories.tsx` are conventions used **inside `@dniproanimals/ui`** and `apps/storybook`. App-level components in `apps/web` rarely need them.
- Form schemas live as **siblings** of the component (`schema.ts`), not under `constants/`. This is the project pattern — see [forms.md](forms.md).

## Imports

- **Always use the `@/` alias inside `apps/web`.** It maps to `apps/web/src/` (configured in `apps/web/tsconfig.json`). Don't write `../../../shared/...`.
- **Workspace packages by name.** `@dniproanimals/ui`, `@dniproanimals/contracts`, `@dniproanimals/icons`, etc.
- **Prettier organizes imports automatically** via `prettier-plugin-organize-imports`. Don't hand-sort.
- **No deep imports past a barrel.** If a folder exposes an `index.ts`, import from the folder:

  ```ts
  // ✅
  import { OrganizationForm } from "@/shared/components/OrganizationForm";

  // ❌
  import { OrganizationForm } from "@/shared/components/OrganizationForm/OrganizationForm";
  ```

  The same rule applies to packages — don't import from inside `@dniproanimals/ui/src/components/...`. The package entry is the contract.

## Specific imports to remember

| What                                 | Where to import from                                     |
| ------------------------------------ | -------------------------------------------------------- |
| `cn`                                 | `@dniproanimals/ui` (not `@/shared/utils`)               |
| `Button`, `Input`, `Form`, `Dialog`… | `@dniproanimals/ui`                                      |
| Icons                                | `@dniproanimals/icons` (`IconSearch`, …, plus `PawIcon`) |
| `dayjs`                              | `@dniproanimals/dayjs` (never the bare `dayjs`)          |
| `env`                                | `@dniproanimals/env`                                     |
| Domain types/schemas                 | `@dniproanimals/contracts`                               |
| URL builder                          | `@dniproanimals/endpoints`                               |
| `apiClient`                          | `@/shared/api-client` (the configured instance)          |
| Query hooks                          | `@/shared/query-hooks`                                   |

## Default vs named exports

| Kind                                                                                          | Export style                          | Why                           |
| --------------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------- |
| `app/page.tsx`, `app/layout.tsx`, `app/route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx` | **Default**                           | Required by Next.js           |
| `next.config.ts`, `postcss.config.mjs`                                                        | **Default**                           | Required by tooling           |
| Components                                                                                    | **Named**, re-exported via `index.ts` | Searchable, refactor-friendly |
| Hooks                                                                                         | **Named**                             | Same reason                   |
| Utilities                                                                                     | **Named**                             | Same reason                   |
| Constants                                                                                     | **Named**                             | Same reason                   |

## Barrel exports (`index.ts`)

Barrels exist at three levels in this project:

1. **Component folder level.** Every component folder ends with `index.ts` that re-exports the component:

   ```ts
   // Button/index.ts
   export * from "./Button";
   ```

2. **Topic folder level.** Folders that group hooks, query-hooks, constants, or utilities export an aggregate `index.ts`:

   ```ts
   // src/shared/query-hooks/index.ts
   export * from "./infinite-queries";
   export * from "./mutations";
   export * from "./queries";
   ```

3. **Workspace package entry.** Each `@dniproanimals/*` package has a single `src/index.ts` that defines its public surface — never import from inside the package's `src/`.

`src/shared/utils/index.ts` does exist in this project, but it's small and intentional. Don't grow it into a monolithic re-export of everything in `shared/` — keep it scoped to a handful of related utilities.

## Folder/file casing

- Component folder name **matches** the component name exactly: `Button/Button.tsx`.
- Route segments are kebab-case (`(public)/animals`, `(dashboard)/dashboard/animals/[id]/edit`).
- Workspace package names are kebab-case (`@dniproanimals/api-client`, `@dniproanimals/typescript-config`).
- Utility-grouping folders inside `shared/` are kebab-case (`api-client/`, `query-hooks/`).

## Comment style

Comments document **why**, never **what**. The code already says what it does. A comment earns its place when it captures something the reader cannot infer:

- A subtle invariant.
- A workaround for a specific bug or library quirk.
- A constraint imposed from outside (browser behavior, server contract, regulatory).
- A surprising decision someone might be tempted to "fix" later.

Real example (`apps/web/src/shared/providers/getServerQueryClient.ts`):

```ts
// Server-only factory: cache() makes the QueryClient request-scoped on the server.
// Must be called only from server components (layouts/pages) — never imported by client code.
```

Don't write JSDoc on internal components — it duplicates the type signature. **Do** write JSDoc with `@example` on utilities exported from packages or `src/shared/utils/`, since they're consumed broadly.

## Quick rules

- `@/` for in-app imports, `@dniproanimals/*` for workspace packages, no relative `..` paths.
- `cn` from `@dniproanimals/ui`. Icons from `@dniproanimals/icons`. Date utils from `@dniproanimals/dayjs`.
- Form schema is a sibling `schema.ts`, never under `constants/`.
- Default exports only for Next.js / tooling files; everything else is named.
- Barrel `index.ts` per component and per topic; don't deep-import past it.
- Comments explain _why_, not _what_.
