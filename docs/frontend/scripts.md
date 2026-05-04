# Scripts

The repo runs on **npm + Turborepo**. Most scripts at the root fan out across workspaces via `turbo run <task>`. App-specific scripts (e.g. `next dev`) live inside `apps/web/package.json`.

## Root scripts (`package.json`)

| Command               | What it does                                                                                      | When to run                            |
| --------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `npm run dev`         | `turbo run dev` — starts every workspace's `dev` task in parallel (cache disabled, persistent).   | Daily development.                     |
| `npm run build`       | `turbo run build` — builds every workspace, respecting `dependsOn` so packages build before apps. | Before releasing or to reproduce CI.   |
| `npm run lint`        | `turbo run lint` — ESLint per workspace.                                                          | Before a PR; also runs in pre-commit.  |
| `npm run type-check`  | `turbo run type-check` — `tsc --noEmit` per workspace (web also runs `next typegen` first).       | Before a PR; also runs in pre-commit.  |
| `npm run format`      | Prettier with organize-imports + tailwindcss plugins over `**/*.{ts,tsx,md}`.                     | Before a PR; also runs in pre-commit.  |
| `npm run prepare`     | Initializes Husky. Runs automatically after `npm install`.                                        | Never (runs automatically).            |
| `npm run infra:up`    | `docker compose up -d` — starts Postgres, Redis, Mailpit.                                         | Before booting the backend.            |
| `npm run infra:down`  | `docker compose down`.                                                                            | When done, or to reset infra.          |
| `npm run infra:logs`  | `docker compose logs -f`.                                                                         | Debugging infra.                       |
| `npm run mail:studio` | Opens Mailpit UI at `http://localhost:8025`.                                                      | Inspecting outgoing mail in dev.       |
| `npm run db:generate` | Drizzle: regenerate types / migration artifacts.                                                  | After changing the DB schema.          |
| `npm run db:migrate`  | Drizzle: apply pending migrations.                                                                | After pulling new migrations.          |
| `npm run db:push`     | Drizzle: push schema directly (dev only).                                                         | Quick iterations on the schema.        |
| `npm run db:reset`    | Drop and re-create the database.                                                                  | Wiping local state.                    |
| `npm run db:studio`   | Open Drizzle Studio (persistent task).                                                            | Browsing local data.                   |
| `npm run db:seed`     | Seed the database.                                                                                | After a reset.                         |
| `npm run db:drop`     | Drop the database.                                                                                | Hard reset.                            |
| `npm run storybook`   | `turbo run start --filter=@dniproanimals/storybook`.                                              | Developing UI primitives in isolation. |

To target a single workspace, append a Turbo filter:

```bash
npm run dev -- --filter=@dniproanimals/web
npm run lint -- --filter=@dniproanimals/ui
```

## App scripts (`apps/web/package.json`)

| Command              | What it does                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `npm run dev`        | `next dev` on `http://localhost:3000`.                                                            |
| `npm run build`      | `next build` (Next.js validates env via the package-level Zod schema in `@dniproanimals/env`).    |
| `npm run start`      | Production server against the previous `next build`.                                              |
| `npm run lint`       | `eslint` using `apps/web/eslint.config.mjs` (Next core-web-vitals + TypeScript presets).          |
| `npm run type-check` | `next typegen && tsc --noEmit` — typegen feeds the `PageProps<...>` / `LayoutProps<...>` globals. |

## Pre-commit pipeline

`.husky/pre-commit` runs:

```bash
npm run type-check
npm run lint
npm run format
git add .
```

In order:

1. **`type-check`** — fail fast on TypeScript errors before doing any other work.
2. **`lint`** — ESLint catches React, Next.js, and import-order issues.
3. **`format`** — Prettier rewrites files in place; the plugin chain organizes imports and sorts Tailwind classes.
4. **`git add .`** — re-stages files that `format` rewrote so the commit reflects formatted output.

If any step fails, the commit is aborted. **Fix the underlying problem and create a new commit.** Never bypass with `--no-verify` and never `--amend` after a hook failure (the failed commit doesn't exist — you'd modify the previous one).

## Things that don't exist (yet)

These often show up in similar projects, but are **not** wired here:

- **No `npm test`** — there is no Vitest/Jest setup in `apps/web`. Tests, when added, will need this section updated.
- **No `audit` / `react-doctor`** task.
- **No bundle analyzer** — `next.config.ts` does not pull in `@next/bundle-analyzer`.

If you reach for one of these, propose adding it before assuming it's there.

## Common combinations

Before opening a PR:

```bash
npm run type-check && npm run lint && npm run format
```

Reproducing a CI build locally:

```bash
npm run build
cd apps/web && npm run start
```

Resetting the dev environment:

```bash
rm -rf node_modules apps/*/node_modules apps/*/.next packages/*/node_modules
npm install
npm run dev
```
