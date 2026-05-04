# Environment variables

Env handling is centralized in the **`@dniproanimals/env`** workspace package. There is one `.env` at the repo root, validated once with Zod at boot. Missing/invalid values fail the build and the dev server, so configure `.env` before running anything.

## Where things live

| File                         | Purpose                                                    |
| ---------------------------- | ---------------------------------------------------------- |
| `.env` (repo root)           | Actual values. Git-ignored.                                |
| `packages/env/src/schema.ts` | Zod schema — single source of truth for shape and types    |
| `packages/env/src/parse.ts`  | Parses `process.env` and exports the typed `env` object    |
| `packages/env/src/load.ts`   | `dotenv` bootstrap; finds the nearest `.env` via `find-up` |
| `apps/web/next.config.ts`    | `import "@dniproanimals/env/load"` to load `.env` early    |
| `turbo.json` → `globalEnv`   | Vars Turbo invalidates the cache on                        |

There is **no `.env.example` checked in** — copy values from a teammate when onboarding.

## Variables

All variables are declared in `packages/env/src/schema.ts`. `NEXT_PUBLIC_*` cross the client boundary; the rest are server-only.

### Public (browser-safe)

| Variable                                       | Purpose                                      |
| ---------------------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL`                          | Base URL of the backend, used by `apiClient` |
| `NEXT_PUBLIC_SUPABASE_URL`                     | Supabase project URL (storage / public API)  |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase publishable (anon) key              |

### Server-only

| Variable                                                        | Purpose                                                           |
| --------------------------------------------------------------- | ----------------------------------------------------------------- |
| `NODE_ENV`                                                      | `development` \| `production` \| `test`                           |
| `DATABASE_URL`                                                  | Optional Postgres connection string                               |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`           | Postgres connection pieces (defaults to local docker)             |
| `REDIS_HOST`, `REDIS_PORT`                                      | Redis connection (sessions, queues)                               |
| `SESSION_SECRET`                                                | Session signing secret (≥ 10 chars; default is dev-only)          |
| `SERVER_PORT`                                                   | Backend HTTP port (default `3001`)                                |
| `WEB_ORIGIN`                                                    | Allowed CORS origin for the API (default `http://localhost:3000`) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Mail transport (Mailpit defaults locally)                         |

These are referenced for completeness — they are server-side and should never end up in `apps/web` code.

## Reading variables at runtime

Always import the typed `env` from `@dniproanimals/env`. Never read `process.env.NEXT_PUBLIC_*` directly — bypassing the package skips Zod validation and loses the inferred type.

```ts
// ✅ apps/web/src/shared/api-client/apiClient.ts
import { createApiClient } from "@dniproanimals/api-client";
import { env } from "@dniproanimals/env";

export const apiClient = createApiClient({ baseUrl: env.NEXT_PUBLIC_API_URL });
```

```ts
// ❌
const url = process.env.NEXT_PUBLIC_API_URL!;
```

## Adding a new variable

1. Add it to `packages/env/src/schema.ts` with the right Zod type (`z.string().url()`, `z.enum([...])`, `z.coerce.number()`).
2. Map it through `packages/env/src/parse.ts` so it's read from `process.env`.
3. If the variable is `NEXT_PUBLIC_*` and Turbo's cache should bust on it, add it to `globalEnv` in `turbo.json`.
4. Add the value to your local `.env`.
5. Document it in the table above.
6. Communicate the new variable to the team — there is no `.env.example` to commit.

## Why no `.env.example`?

Originally a deliberate omission to keep secrets and per-environment URLs out of git history. If/when this changes, the workflow will be:

```bash
echo "NEXT_PUBLIC_NEW_FLAG=" >> .env.example
git add .env.example
```

Until then, the schema in `packages/env/src/schema.ts` _is_ the contract — every required field there is something the team needs to provision.
