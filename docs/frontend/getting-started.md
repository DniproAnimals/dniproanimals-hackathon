# Getting started

This guide takes a fresh clone to a running `apps/web` dev server.

## Prerequisites

- **Node.js 18+** (root `package.json` declares `"engines": { "node": ">=18" }`).
- **npm 11+** (root declares `"packageManager": "npm@11.5.1"`; the lockfile is `package-lock.json` — do not introduce `yarn`/`pnpm`).
- **Docker** for local infra (Postgres + Redis + Mailpit), exposed via `docker-compose.yml`.
- **Git** with hooks enabled — Husky's pre-commit hook is installed by `npm install`.

## Repo layout

This is a Turborepo monorepo. The frontend lives in `apps/web`; everything `@dniproanimals/*` is a workspace package in `packages/`. See [structure.md](structure.md) for the package map.

```text
.
├── apps/
│   ├── web/         # Next.js frontend (this documentation)
│   ├── server/      # Backend API
│   └── storybook/   # Component playground
├── packages/        # @dniproanimals/* workspace packages
└── turbo.json       # Pipeline + globalEnv
```

## Install

From the repo root:

```bash
npm install
```

This installs every workspace, links internal packages, and runs `husky` to register `.husky/pre-commit`.

## Start local infrastructure

The backend needs Postgres, Redis, and Mailpit. Bring them up with:

```bash
npm run infra:up      # docker compose up -d
npm run infra:logs    # tail logs
npm run infra:down    # stop and remove
```

Mailpit UI: `npm run mail:studio` (opens `http://localhost:8025`).

## Configure environment

There is a single `.env` at the **repo root** consumed by every workspace via `@dniproanimals/env`. There is no `.env.example` checked in — copy values from a teammate or set them up by hand. The full variable list and the validation schema live in [env.md](env.md).

The Zod schema (`packages/env/src/schema.ts`) is the source of truth — boot fails fast on missing/invalid values, so configure `.env` before running anything.

## Run the dev server

From the repo root:

```bash
npm run dev                          # turbo: runs `dev` for every workspace
npm run dev -- --filter=@dniproanimals/web   # only the web app
```

Or directly inside the app:

```bash
cd apps/web
npm run dev
```

`apps/web` starts on `http://localhost:3000`. The backend (`apps/server`) defaults to `http://localhost:3001` (`SERVER_PORT`), and `NEXT_PUBLIC_API_URL` points the web client at it.

## First commit

The pre-commit hook runs (from `.husky/pre-commit`):

```bash
npm run type-check
npm run lint
npm run format
git add .
```

Each step uses Turbo's task pipeline to fan out across workspaces. To verify your machine works end-to-end, make a trivial change and commit:

```bash
git checkout -b chore/setup-test
echo "" >> README.md
git add README.md
git commit -m "chore: verify pre-commit"
```

If any step fails, **fix the underlying issue and create a new commit**. Do not bypass with `--no-verify` or `--amend` — the hook failure usually means the commit didn't happen, so amending would touch the wrong commit.

See [scripts.md](scripts.md) for every script and what Turbo runs.
