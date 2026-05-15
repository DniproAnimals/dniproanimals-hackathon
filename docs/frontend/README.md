# Frontend documentation

This folder documents how to write frontend code in `apps/web`. Each file covers one topic and is meant to be readable in about a minute.

`apps/web` is one workspace inside a Turborepo monorepo. A meaningful chunk of what you might expect "in the app" actually lives in `packages/*` (UI primitives, contracts, icons, env, …) — see [structure.md](structure.md) first.

## Index

### Setup

| File                                     | What it covers                                              |
| ---------------------------------------- | ----------------------------------------------------------- |
| [getting-started.md](getting-started.md) | Prereqs, install, infra, `.env`, running the dev server     |
| [env.md](env.md)                         | `@dniproanimals/env`, variables list, adding a new variable |
| [scripts.md](scripts.md)                 | npm + Turborepo scripts and the pre-commit pipeline         |

### Architecture

| File                                         | What it covers                                                                         |
| -------------------------------------------- | -------------------------------------------------------------------------------------- |
| [structure.md](structure.md)                 | Monorepo packages, `src/app/` + `src/shared/` layout, decision tree                    |
| [components.md](components.md)               | Anatomy of a component folder, when to use primitives from `@dniproanimals/ui`         |
| [styling.md](styling.md)                     | Tailwind v4 tokens, `cn()` from `@dniproanimals/ui`, breakpoints, animations           |
| [server-components.md](server-components.md) | Server vs Client decision tree, typegen `LayoutProps`/`PageProps`, layout-chrome split |
| [data-fetching.md](data-fetching.md)         | `apiClient` + `endpoints` + `query-hooks/{queries,mutations,...}/`, SSR prefetch       |
| [forms.md](forms.md)                         | `react-hook-form` + Zod + shadcn `<Form>`/`<FormField>`, route split                   |
| [hooks.md](hooks.md)                         | Where hooks live, no `usehooks-ts`, page-scoped `useQueryStates`                       |
| [types.md](types.md)                         | `@dniproanimals/contracts` as source of truth, `OmitQueryOptions`, typegen globals     |
| [state-management.md](state-management.md)   | URL state (`nuqs`), server state (React Query), local state, refs                      |
| [seo.md](seo.md)                             | Metadata API, sitemap, robots, JSON-LD (current state vs. target)                      |

### Quality

| File                                   | What it covers                                                       |
| -------------------------------------- | -------------------------------------------------------------------- |
| [conventions.md](conventions.md)       | File/folder naming, imports, exports, comments                       |
| [best-practices.md](best-practices.md) | Cross-cutting rules + all ❌/✅ examples consolidated by topic       |
| [performance.md](performance.md)       | Memoization, `next/image`, `next/dynamic`, Suspense, Core Web Vitals |
| [accessibility.md](accessibility.md)   | Use Radix-backed primitives, semantic HTML, keyboard nav, forms a11y |
