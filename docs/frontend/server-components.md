# Server vs Client Components

How `apps/web` uses Server and Client Components in the Next 16 App Router. The basics first, then the project-specific patterns: when each kind appears, the layout-chrome split, navigation, and the SSR prefetch handoff to React Query.

## State of play in this app

Most pages in `apps/web` are **client-rendered** today (`"use client"` at the top of `page.tsx`). They read data through React Query, drive filters through `nuqs`, and rely on event handlers. This is intentional — the dashboard side is interactive, the public side will gradually move toward SSR + prefetch as SEO needs grow.

What that means in practice:

- A new dashboard route → start with `"use client"`, useQuery hooks, React Query.
- A new public route that needs to be indexable → server component with `await apiClient...` (or `getServerQueryClient()` + `<HydrationBoundary>`), with smaller `"use client"` islands inside.

## Decision tree

```text
Does this component need…
├── Hooks (useState, useEffect, useRouter, useQueryStates)?
│   └── Client Component ('use client')
├── Browser APIs (window, localStorage, IntersectionObserver)?
│   └── Client Component
├── Event handlers (onClick, onChange, onSubmit)?
│   └── Client Component
├── Direct database / cookies / headers access?
│   └── Server Component (default)
└── None of the above? Just rendering UI?
    └── Server Component (default — smaller bundle, no JS shipped)
```

## `'use client'` placement rules

- **Push `'use client'` as low in the tree as possible.** The directive marks **the boundary**: everything imported from a client module also runs on the client.
- **Server Components can import Client Components.** Pass them as `children` or props.
- **Client Components cannot import Server Components.** They can only receive them via props (typically `children`).
- A page or layout marked `'use client'` forces every descendant onto the client, ballooning the bundle.

## Server-only modules

The web app has very little server-only code today (almost everything goes through `apiClient`, which works equally on server and client). Things that _would_ be server-only:

- Anything using `cookies()` or `headers()` from `next/headers`.
- Database clients, secrets-bearing config.
- The `import "@dniproanimals/env/load"` line in `next.config.ts` (already correct — `next.config.ts` is server-only).

When you do introduce a server-only module, mark it explicitly:

```ts
import "server-only";

export const someServerOnlyHelper = () => {
  /* … */
};
```

This throws at build time if a client module imports it.

## Page params: `LayoutProps` / `PageProps` + `use(...)`

Next 16 makes `params` and `searchParams` `Promise<…>`. The project uses Next's typegen globals (`PageProps<"/...">`, `LayoutProps<"/...">`) for both server and client routes. Strategy:

- **Server route**: `await props.params`.
- **Client route**: `use(props.params)` (React 19's `use()` unwraps the promise, suspends until ready).

```tsx
// Server layout — async + await
// app/(dashboard)/dashboard/animals/[id]/edit/layout.tsx
import { notFound } from "next/navigation";

export default async function EditAnimalLayout({
  children,
  params,
}: LayoutProps<"/dashboard/animals/[id]/edit">) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId) || numericId <= 0) notFound();

  return (
    <div>
      {/* chrome */}
      {children}
    </div>
  );
}

// Client page — use()
// app/(dashboard)/dashboard/animals/[id]/edit/page.tsx
("use client");
import { use } from "react";

export default function EditAnimalPage(
  props: PageProps<"/dashboard/animals/[id]/edit">,
) {
  const { id } = use(props.params);
  // …
}
```

If TypeScript doesn't know `PageProps`/`LayoutProps`, run `npm run type-check` (which triggers `next typegen`) — see [types.md](types.md#nextjs-typegen-globals).

## Layout chrome pattern

For routes whose page is a `"use client"` form, **own the chrome (back button, heading, `notFound()` for invalid params, SSR prefetch) in `layout.tsx`**, and keep `page.tsx` as just the form/body. Saved feedback (`memory/feedback_layout_chrome_prefetch.md`).

Real example (animal edit):

```tsx
// layout.tsx — server, owns chrome + invalid-id guard
export default async function EditAnimalLayout({
  children,
  params,
}: LayoutProps<"/dashboard/animals/[id]/edit">) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId) || numericId <= 0) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <Button asChild variant="ghost" size="sm" className="mb-5 gap-2">
        <Link href="/dashboard/animals">
          <IconChevronLeft size={18} />
          Назад
        </Link>
      </Button>
      <h1 className="text-2xl font-bold mb-6">Редагувати тварину</h1>
      {children}
    </div>
  );
}

// page.tsx — client, only the form
("use client");
import { use } from "react";

export default function EditAnimalPage(
  props: PageProps<"/dashboard/animals/[id]/edit">,
) {
  const { id } = use(props.params);
  // …form…
}
```

Saved feedback (`memory/feedback_no_page_wrappers.md`): don't make `page.tsx` a one-liner that wraps an inner `<XxxPage />`. Inline the body.

## Don't wrap `page.tsx` with a one-liner

❌ **Don't:**

```tsx
// page.tsx
export default function Page() {
  return <AnimalsPage />;
}
```

✅ **Inline the body directly** in `page.tsx`. Use `<XxxPage />` only when there's a real reason to extract (Suspense boundary above, multiple consumers, etc.).

## Navigation in Server Components

Server components do **not** use `useRouter`/`usePathname`/`useSearchParams` — those are client hooks. Two correct patterns:

### `<Link>` for user navigation

Works in both Server and Client Components. Default choice for hyperlinks.

```tsx
import Link from "next/link";

<Link href="/dashboard">Дашборд</Link>;
```

### `redirect()` for conditional server-side redirects

For auth checks, permission gates, post-mutation navigation:

```tsx
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const me = await apiClient.auth.me();
  if (!me) redirect("/auth/signin");
  return <Profile user={me} />;
}
```

Note: client routes guard auth differently — see `<RequiredAuth>` in `src/shared/components/RequiredAuth/` for the client-side pattern (`useMeQuery` + `router.replace`).

## SSR prefetch handoff

When you want a server component to prefetch data and a client child to consume it through `useXxxQuery` without a second fetch, use `getServerQueryClient` + `<HydrationBoundary>`:

```tsx
// page.tsx (server)
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { apiClient } from "@/shared/api-client";
import { endpoints } from "@dniproanimals/endpoints";
import { getServerQueryClient } from "@/shared/providers/getServerQueryClient";
import { AnimalsList } from "./AnimalsList";

export default async function Page() {
  const queryClient = getServerQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [endpoints.animals.list(), {}],
    queryFn: () => apiClient.animals.list({}),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AnimalsList /> {/* "use client" — uses useAnimalsQuery, hydrated */}
    </HydrationBoundary>
  );
}
```

Details in [data-fetching.md](data-fetching.md#server-side-prefetch).

## `useQueryStates` requires a `<Suspense>` boundary

The `nuqs` library follows the same rule as `useSearchParams`: a client component reading URL state must sit under a `<Suspense>` boundary to avoid breaking static prerender for the parts of the page that don't depend on it.

```tsx
// page.tsx (server)
import { Suspense } from "react";
import { AnimalFilters } from "./AnimalFilters";

export default function Page() {
  return (
    <Suspense fallback={<FiltersSkeleton />}>
      <AnimalFilters />
    </Suspense>
  );
}

// AnimalFilters.tsx (client)
("use client");
import { useCatalogFilterState } from "../hooks/useCatalogFilterState";

export function AnimalFilters() {
  const [params] = useCatalogFilterState();
  // …
}
```

For Server Components, read the prop instead — it's a Promise:

```tsx
export default async function Page({ searchParams }: PageProps<"/animals">) {
  const sp = await searchParams;
  // …
}
```

## Server vs Client capability matrix

| Capability                                   | Server Component | Client Component |
| -------------------------------------------- | :--------------: | :--------------: |
| `<Link>`                                     |        ✅        |        ✅        |
| `redirect()` / `permanentRedirect()`         |        ✅        |        ❌        |
| `useRouter()`, `usePathname()`               |        ❌        |        ✅        |
| `useSearchParams()` / `useQueryStates`       |        ❌        |        ✅        |
| `searchParams` / `params` prop (Promise)     |     `await`      |     `use()`      |
| `cookies()`, `headers()` from `next/headers` |        ✅        |        ❌        |
| `async` function body                        |        ✅        |        ❌        |
| `useState` / `useEffect`                     |        ❌        |        ✅        |
| Event handlers (`onClick`, `onChange`)       |        ❌        |        ✅        |
| `'use client'` directive                     |        ❌        |        ✅        |

## Quick checklist

- [ ] Default to a Server Component. Add `'use client'` only when a hook, browser API, or event handler requires it.
- [ ] If you need `'use client'`, place it on the smallest leaf possible.
- [ ] Server params: `async ... { await params }`. Client params: `use(props.params)`.
- [ ] Use `LayoutProps<"/...">` / `PageProps<"/...">` from typegen — don't hand-roll the params type.
- [ ] Layout owns chrome (back button, heading, `notFound()`, SSR prefetch); page owns the body.
- [ ] No `<XxxPage />` one-liner wrappers in `page.tsx` — inline the body.
- [ ] `<Link>` or `redirect()` for navigation in server code; `useRouter` only in client code.
- [ ] Wrap client components reading `nuqs` URL state under `<Suspense>` from a server parent.
- [ ] When SSR-prefetching, use `getServerQueryClient()` (request-scoped via `cache()`) and `<HydrationBoundary>`.
