# Data fetching

Three layers, each in its own workspace package, plus a thin wiring file in the app:

| Layer                      | Where                                                                   | Responsibility                                         |
| -------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------ |
| URL builder                | `@dniproanimals/endpoints`                                              | Typed endpoint paths (`endpoints.animals.get({ id })`) |
| Typed HTTP client          | `@dniproanimals/api-client`                                             | `createApiClient({ baseUrl })` → namespaced services   |
| Configured client instance | `apps/web/src/shared/api-client/apiClient.ts`                           | Reads `env.NEXT_PUBLIC_API_URL`, exports `apiClient`   |
| React Query wrappers       | `apps/web/src/shared/query-hooks/{queries,mutations,infinite-queries}/` | One hook per endpoint                                  |

Components never call `fetch` directly. They call query-hooks; query-hooks call `apiClient.<module>.<method>(...)`.

## The configured `apiClient`

```ts
// apps/web/src/shared/api-client/apiClient.ts
import { createApiClient } from "@dniproanimals/api-client";
import { env } from "@dniproanimals/env";

export const apiClient = createApiClient({ baseUrl: env.NEXT_PUBLIC_API_URL });
```

`createApiClient` returns an object namespaced by module:

```ts
apiClient.animals.list(query);
apiClient.animals.get(id);
apiClient.animals.create(body);
apiClient.animals.update(id, body);
apiClient.auth.me();
apiClient.favorites.toggle({ animalId });
// auth, animals, organizations, adoption, lost, favorites,
// volunteers, notifications, superadmin, upload
```

The underlying transport is `fetch` with `credentials: "include"` (cookie-based session — no `Authorization` header to set manually). Errors are normalized into a thrown `Error` with the server's `error`/`message`. See `packages/api-client/src/utils/createHttp.ts`.

## Adding a new endpoint

1. **Add the URL** in `packages/endpoints/src/endpoints.ts`:

   ```ts
   export const endpoints = createTypedEndpoints({
     // …
     animals: {
       list: "/animals",
       get: "/animals/:id",
       favorite: "/animals/:id/favorite", // ← new
     },
   });
   ```

2. **Add the request/response Zod schema** in `packages/contracts/src/modules/<module>/schemas/`, then re-export from the module's `index.ts`. Types come from `z.infer<typeof schema>` — see [types.md](types.md).

3. **Add the typed service method** in `packages/api-client/src/services/<module>.ts`:

   ```ts
   import type { ToggleFavoriteResponse } from "@dniproanimals/contracts";
   // …
   favorite: (id: number) =>
     http<ToggleFavoriteResponse>({
       endpoint: endpoints.animals.favorite({ id }),
       method: "POST",
     }),
   ```

4. **Wrap it in a React Query hook** in `apps/web/src/shared/query-hooks/queries/` (or `mutations/`):

   ```ts
   // useFavoriteAnimalMutation.ts
   "use client";
   import { apiClient } from "@/shared/api-client";
   import type { OmitMutationOptions } from "@/shared/types/react-query";
   import { useMutation } from "@tanstack/react-query";

   export const useFavoriteAnimalMutation = (
     options: OmitMutationOptions<
       typeof apiClient.animals.favorite,
       "mutationFn"
     > = {},
   ) =>
     useMutation({
       mutationFn: apiClient.animals.favorite,
       ...options,
     });
   ```

5. Export it from `query-hooks/{queries|mutations}/index.ts` so consumers can import via `@/shared/query-hooks`.

## Canonical query hook

Real example from `apps/web/src/shared/query-hooks/queries/useAnimalsQuery.ts`:

```ts
"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import type { ListAnimalsQuery } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useAnimalsQuery = (
  query: ListAnimalsQuery = {},
  options: OmitQueryOptions<
    typeof apiClient.animals.list,
    "queryKey" | "queryFn"
  > = {},
) =>
  useQuery({
    queryKey: [endpoints.animals.list(), query],
    queryFn: () => apiClient.animals.list(query),
    ...options,
  });
```

Conventions:

- **`"use client"`** on every React Query hook file. They run in client components only.
- **`queryKey: [endpoints.<module>.<action>(), params]`** — the endpoint string is a stable, predictable prefix that lets you invalidate by namespace.
- **`queryFn: () => apiClient.<module>.<method>(args)`** — never inline a `fetch` call.
- **`options` parameter** typed via `OmitQueryOptions<typeof apiClient.x.y, "queryKey" | "queryFn">` so callers can override `enabled`, `select`, `staleTime`, etc. without losing inference.
- **No `select: ({ data }) => data`** — the API client already returns parsed JSON. Whatever the service method returns is what the hook returns.

For mutations, `OmitMutationOptions` plays the same role:

```ts
// useCreateAnimalMutation.ts
import type { OmitMutationOptions } from "@/shared/types/react-query";

export const useCreateAnimalMutation = (
  options: OmitMutationOptions<
    typeof apiClient.animals.create,
    "mutationFn"
  > = {},
) =>
  useMutation({
    mutationFn: apiClient.animals.create,
    ...options,
  });
```

When the mutation needs structured input (more than the service method's signature), define the args type explicitly:

```ts
// useUpdateAnimalMutation.ts
type UpdateAnimalArgs = { id: number; body: UpdateAnimalBody };

export const useUpdateAnimalMutation = (
  options: Omit<
    UseMutationOptions<UpdateAnimalResponse, Error, UpdateAnimalArgs>,
    "mutationFn"
  > = {},
) =>
  useMutation({
    mutationFn: ({ id, body }: UpdateAnimalArgs) =>
      apiClient.animals.update(id, body),
    ...options,
  });
```

## Provider setup

```tsx
// apps/web/src/shared/providers/ReactQueryProvider.tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

Defaults to know:

- **`retry: 1`** — one retry on failure. Don't override globally; tweak per-query if needed.
- **`refetchOnWindowFocus: false`** — switching tabs doesn't trigger refetches.
- **`staleTime: 60_000`** — one minute. Override with longer values for rarely-changing data.

The provider wraps `<NuqsAdapter>` in `app/layout.tsx`, so URL-state hooks (`useQueryStates`) and React Query coexist.

> **There is no global `onError` toast.** Failed mutations don't toast automatically. Surface errors per-mutation when you need to (`onError: () => toast.error(...)`), or rely on UI fallbacks like keeping the form open.

## Server-side prefetch

For pages that should arrive with data already populated (SEO, perceived performance), use `getServerQueryClient` from `shared/providers`:

```ts
// apps/web/src/shared/providers/getServerQueryClient.ts
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const getServerQueryClient = cache(
  () => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } }),
);
```

`cache()` makes the `QueryClient` request-scoped on the server, so multiple server components in the same RSC render share state without leaking across requests.

Pattern (server component):

```tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getServerQueryClient } from "@/shared/providers/getServerQueryClient";
import { apiClient } from "@/shared/api-client";
import { endpoints } from "@dniproanimals/endpoints";

export default async function Page() {
  const queryClient = getServerQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [endpoints.animals.list(), {}],
    queryFn: () => apiClient.animals.list({}),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientChild />
    </HydrationBoundary>
  );
}
```

`getServerQueryClient` must only be imported from server components. Never import it from a `"use client"` module — it ships server-only code.

## Invalidation by endpoint prefix

Because every query key starts with the endpoint URL, invalidation is predictable:

```ts
// invalidates every cached call to /animals (any params)
queryClient.invalidateQueries({ queryKey: [endpoints.animals.list()] });

// just one specific query:
queryClient.invalidateQueries({
  queryKey: [endpoints.animals.list(), { type: "dog" }],
});
```

Example after a create mutation:

```ts
const queryClient = useQueryClient();
const createMutation = useCreateAnimalMutation({
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [endpoints.animals.list()] });
  },
});
```

## Polling

For live data, set `refetchInterval`:

```ts
useQuery({
  queryKey: [endpoints.notifications.list(), {}],
  queryFn: () => apiClient.notifications.list(),
  refetchInterval: 10_000,
});
```

## Loading, empty, error states

Every async UI must handle four states. The rule:

> **Show a loading indicator only when there's no data to display.** Background refetches must not flash spinners over content already on screen.

```tsx
const { data, isLoading, error, refetch } = useAnimalsQuery(params);

if (error) return <ErrorState error={error} onRetry={refetch} />;
if (isLoading && !data) return <AnimalsListSkeleton />;
if (!data?.length) return <AnimalsListEmpty />;

return <AnimalsList animals={data} />;
```

Skeletons live as siblings of the list/page (`AnimalsListSkeleton.tsx`); empty states use the `EmptyState` primitive from `@dniproanimals/ui`.

## Server-side filtering, never client-side

**Don't write `filterX()` helpers that subset arrays in the browser.** Filtering, sorting, search go through query params:

```ts
// ✅ URL params drive the request
useAnimalsQuery({ type: "dog", q: search, sort: "newest" });

// ❌ client-side filter helper
const dogs = animals.filter((a) => a.type === "dog");
```

URL params live in a single `useQueryStates` hook per page — see [state-management.md](state-management.md). Reuse the Zod enum's `.options` for `parseAsStringLiteral` so the schema is the single source of truth (`useCatalogFilterState.ts` is the canonical example).

## Search inputs are debounced

Every server-triggering search input is debounced via the shared `useDebouncedCallback` from `@/shared/hooks`. The `SearchField` component in `src/shared/components/SearchField/` already wraps this — use it instead of writing your own.

## Quick checklist

- [ ] No `fetch` in components — go through `apiClient`.
- [ ] No new service code in `apps/web/src/shared/api-client/` beyond the configured instance — service definitions belong in `@dniproanimals/api-client`.
- [ ] Query keys start with `endpoints.<module>.<action>()`.
- [ ] React Query hooks live in `src/shared/query-hooks/{queries|mutations|infinite-queries}/`.
- [ ] Read directly from `data` — don't mirror it into `useState`.
- [ ] Filtering/sorting/search through URL params + `useXxxQuery({...})`, not array helpers.
- [ ] Search inputs debounced via `useDebouncedCallback` (or `SearchField`).
- [ ] Loading spinner only when `isLoading && !data`.
- [ ] Server-side prefetch via `getServerQueryClient()` + `<HydrationBoundary>`.
