# Project structure

`apps/web` is one workspace inside a Turborepo monorepo. A meaningful chunk of what you might expect inside `apps/web/src/` actually lives in `packages/*` so it can be reused (by the storybook app, by future apps, by the API client). This file maps both — the **monorepo packages** and the **app's internal layout**.

## Monorepo packages

```text
packages/
├── api-client/         # Typed HTTP client (createApiClient → apiClient.animals.list(...))
├── contracts/          # Zod schemas + inferred TypeScript types (one module per domain)
├── database/           # Drizzle schema/migrations (server only)
├── dayjs/              # Configured dayjs (UA locale + plugins)
├── endpoints/          # Typed URL builder (endpoints.animals.get({ id }))
├── env/                # Zod-validated env access (single .env at repo root)
├── eslint-config/      # Shared ESLint preset
├── icons/              # Re-exports @tabler/icons-react + custom brand icons
├── tailwind/           # Shared PostCSS + Tailwind v4 config
├── typescript-config/  # Shared tsconfig presets (base, nextjs)
└── ui/                 # Shadcn-style UI primitives (Button, Form, Dialog, …)
```

Conventions:

- Anything that could be reused outside `apps/web` belongs in a package, not in `src/shared/`.
- Pull from packages as named imports: `import { Button, Form, FormField, cn } from "@dniproanimals/ui"`.
- The same applies to icons (`@dniproanimals/icons`), env (`@dniproanimals/env`), date utils (`@dniproanimals/dayjs`).

| Package                     | Use it for                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `@dniproanimals/ui`         | UI primitives: `Button`, `Input`, `Form`, `FormField`, `Dialog`, `Sheet`, `Select`, … |
| `@dniproanimals/icons`      | Icons: `IconSearch`, `IconChevronLeft`, …, plus the custom `PawIcon`                  |
| `@dniproanimals/contracts`  | Domain Zod schemas + inferred types (`Animal`, `CreateAnimalBody`, `animalSexSchema`) |
| `@dniproanimals/endpoints`  | URL builder used as React Query keys and inside `apiClient`                           |
| `@dniproanimals/api-client` | `createApiClient({ baseUrl })` — one entry, namespaced by module                      |
| `@dniproanimals/env`        | The typed `env` object (and `/load` for early dotenv load in `next.config.ts`)        |
| `@dniproanimals/dayjs`      | Pre-configured dayjs (UA locale, plugins) — never import `dayjs` directly             |
| `@dniproanimals/tailwind`   | Tailwind v4 PostCSS preset (re-exported via `apps/web/postcss.config.mjs`)            |

## `apps/web/src/` layout

```text
src/
├── app/         # Next.js App Router: pages, layouts, route-local components/hooks
└── shared/      # Cross-route code that doesn't belong in a workspace package
```

There is **no `src/features/`, `src/components/`, or top-level `src/hooks/`** in this app. Page-local code lives next to the page; cross-route code lives in `src/shared/`; truly reusable code lives in a package.

### `src/app/`

Owned by Next.js. Contains:

- Route groups: `(public)/`, `(dashboard)/`.
- `page.tsx`, `layout.tsx`, `route.ts`, `error.tsx`, `loading.tsx`, `not-found.tsx`.
- **Per-route subfolders**: `components/`, `hooks/`, `utils/`, `constants/` — alongside the route file. This is where page-specific code lives.

Real example:

```text
app/(public)/animals/
├── components/
│   ├── AnimalsCatalogHeader/
│   ├── AnimalsList/
│   ├── AnimalsListHeader/
│   └── FilterBar/
├── hooks/
│   └── useCatalogFilterState.ts
├── [id]/
│   ├── components/...
│   └── page.tsx
├── layout.tsx
└── page.tsx
```

When code at a route grows so big it needs its own subfolders, that's expected — keep it page-local. Only lift to `src/shared/` when a second consumer appears outside the route.

### `src/shared/`

Cross-route code that isn't a UI primitive (those go to `@dniproanimals/ui`) and isn't a domain schema (those go to `@dniproanimals/contracts`).

```text
src/shared/
├── api-client/   # The configured apiClient instance (wraps @dniproanimals/api-client)
├── components/   # Cross-route business components (AnimalCard, Header, OrganizationForm, …)
├── constants/    # Domain label maps (animal status, breeds, …)
├── hooks/        # Cross-route hooks not tied to React Query (useDebouncedCallback, useLogOut)
├── providers/    # ReactQueryProvider, getServerQueryClient
├── query-hooks/  # React Query wrappers, split by kind:
│   ├── queries/
│   ├── mutations/
│   └── infinite-queries/
├── types/        # Cross-route TS types (e.g. OmitQueryOptions / OmitMutationOptions)
└── utils/        # Pure utilities (pluralize, repeat, …)
```

Notes:

- `src/shared/api-client/apiClient.ts` is the **single configured instance** of the typed client — every query/mutation imports from `@/shared/api-client`.
- React Query wrappers live in `src/shared/query-hooks/`, **not** `src/shared/hooks/`. The split by `queries|mutations|infinite-queries` is the project convention.
- `src/shared/providers/` holds `ReactQueryProvider` (client) and `getServerQueryClient` (server, `cache()`-wrapped) — see [data-fetching.md](data-fetching.md).
- Domain models and Zod schemas **never** live in `src/shared/` — they belong in `@dniproanimals/contracts`. If you find yourself adding `src/shared/models/` or `src/shared/schemas/`, stop and put it in the package.

## Decision tree: where does this go?

```text
Is it a UI primitive (Button/Input/Dialog/...)?
└── Yes → @dniproanimals/ui

Is it a domain schema or Zod-derived type?
└── Yes → @dniproanimals/contracts

Is it a URL/endpoint?
└── Yes → @dniproanimals/endpoints (and apiClient method in @dniproanimals/api-client)

Is it a brand icon?
└── Yes → @dniproanimals/icons (only if not in @tabler/icons-react)

Is it used by exactly one route?
└── Yes → app/<route>/(components|hooks|utils|constants)/

Is it used by 2+ routes?
└── Yes → src/shared/<components|hooks|...>

Is it a React Query wrapper?
└── Yes → src/shared/query-hooks/<queries|mutations|infinite-queries>/
```

## Common pitfalls

- **Don't reach for `lucide-react`.** It's not installed. Icons come from `@dniproanimals/icons` (which re-exports `@tabler/icons-react`).
- **Don't add a `src/components/` or `src/features/` folder.** This app uses `app/` + `shared/` + packages.
- **Don't put React Query hooks in `src/shared/hooks/`.** They belong in `src/shared/query-hooks/`.
- **Don't import `cn` from `@/shared/utils`.** It comes from `@dniproanimals/ui`: `import { cn } from "@dniproanimals/ui"`.
- **Don't import `dayjs` directly.** Use `@dniproanimals/dayjs` so plugins and locale are loaded.
