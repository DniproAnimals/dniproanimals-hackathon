# Best practices

Cross-cutting rules and contrasting examples (❌/✅) for every topic in this documentation. The other files describe **how** this project works; this one shows **what to avoid and what to do instead**, organized by topic.

For the prose behind each rule, see the linked file.

## Rules at a glance

### Monorepo & tooling

- npm + Turborepo. The lockfile is `package-lock.json` — don't introduce `yarn`/`pnpm`.
- Pre-commit hook runs `type-check`, `lint`, `format`. If it fails, **fix and create a new commit** — don't `--no-verify`, don't `--amend`.
- There is no Vitest, no `@next/bundle-analyzer`, no `react-doctor`. Don't reference scripts that don't exist.

### Where things live

- Shared/reusable code goes into a workspace package (`packages/*`), not into `apps/web/src/shared/`.
- UI primitives → `@dniproanimals/ui`. Icons → `@dniproanimals/icons`. Domain types → `@dniproanimals/contracts`. Date utils → `@dniproanimals/dayjs`. Env → `@dniproanimals/env`. URL builder → `@dniproanimals/endpoints`.
- App layout: `apps/web/src/` has only `app/` and `shared/`. No `features/`, no top-level `components/`/`hooks/`.
- React Query hooks live in `src/shared/query-hooks/{queries,mutations,infinite-queries}/`.

### Next.js

- Default to Server Components. `'use client'` only when needed, placed at the smallest leaf possible.
- Most pages in this app are currently `'use client'` — that's fine for the dashboard side; the public side should migrate to server components when SEO matters.
- Use `LayoutProps<"/...">` / `PageProps<"/...">` from Next typegen. Run `npm run type-check` if those types are missing.
- Server params: `await props.params`. Client params: `use(props.params)`.
- `<Link>` for navigation, `redirect()` for conditional server redirects. Server components don't use `useRouter`.
- Layout owns chrome (back button, heading, `notFound()`, SSR prefetch); page is the body.
- Don't wrap `page.tsx` in a one-liner that renders `<XxxPage />` — inline the body.

### React

- Don't memoize by default. Reach for `useMemo` / `useCallback` only when measured.
- Derive during render — don't sync via `useEffect`.
- Effects are an escape hatch for external systems.
- Stable `key` props from real IDs (or `useFieldArray`'s `field.id`), never array index.
- Refs for non-rendering values (timers, focus targets); never read/write during render.
- Composition with `children` over prop drilling and boolean flags.

### Data layer

- No `fetch` in components. Go through `apiClient` from `@/shared/api-client`.
- Add the URL to `@dniproanimals/endpoints`, the typed method to `@dniproanimals/api-client`, the schema to `@dniproanimals/contracts`, the React Query hook to `apps/web/src/shared/query-hooks/`.
- Query key always starts with `endpoints.<module>.<action>()`.
- Read directly from React Query's `data` — don't mirror into `useState`.
- There is no global `onError` toast. If a mutation needs UI feedback, wire it explicitly.
- Filtering/sorting/search go through query params (`useQueryStates`), never client-side `array.filter()`.
- Search inputs debounced via `useDebouncedCallback` from `@/shared/hooks` (or use `SearchField`).

### Forms rules

- Schema in `Component/schema.ts` (sibling, **not** under `constants/`); type via `z.infer`; defaults typed against the inferred values.
- `useComponentForm` exports both the form hook and a typed `useFormContext` wrapper.
- Compose with `<Form>` + `<FormField>` + `<FormControl>` + `<FormLabel>` + `<FormMessage>` from `@dniproanimals/ui` — don't use raw `<Controller>`/`register` in app code.
- Form components take `defaultValues` + `onSubmit` only. Mutations live in the page (split `/add` and `/[id]/edit` routes).
- Per-field components read `useComponentFormContext()` directly — no `value`/`onChange` drilling from a top-level composer.

### Tailwind

- All styling through Tailwind classes, merged with `cn()` from `@dniproanimals/ui`.
- No `style={{}}` for static values. Reserve for runtime-computed values.
- Use semantic tokens (`bg-primary`, `text-foreground`, `text-gray-medium`) — never hex.
- Stock breakpoints: `sm/md/lg/xl/2xl`. There are no `mobile:`/`laptop:`/`monitor:` variants.
- Don't define new CVA variants in `apps/web` — extend the primitive in `packages/ui` instead.

### Icons & assets

- Icons come from `@dniproanimals/icons` (`@tabler/icons-react` + custom `PawIcon`). `lucide-react` is **not installed**.
- Custom SVGs go in `packages/icons/src/` once, not inline in JSX.
- `next/image` for raster, never raw `<img>` for content.
- Add new image hosts to `images.remotePatterns` in `apps/web/next.config.ts`.

### TypeScript

- `strict` is on. No opt-outs.
- No `any`. Use `unknown` and narrow.
- `interface` for object shapes, `type` for unions/intersections/aliases.
- Unsafe `as` requires a `// reason: ...` comment. `as const` is fine.
- `@dniproanimals/contracts` is the source of truth for domain types — derive via `z.infer`.
- Reuse Zod enum `.options` for `parseAsStringLiteral` / UI iteration — never duplicate the literal tuple.

### Process

- Run `npm run type-check && npm run lint` locally before pushing.
- Keep PRs small. One feature per PR.
- If pre-commit hooks fail, fix the issue and create a new commit. Don't `--no-verify` and don't `--amend`.

---

## Project structure

### Don't add `src/features/` / `src/components/` / `src/hooks/`

This app uses `app/` + `shared/` + workspace packages. No `features/`, no top-level `components/`, no top-level `hooks/`.

❌

```text
apps/web/src/
├── components/Button/...      # don't create
├── features/animals/...       # don't create
└── hooks/useFoo.ts            # don't create
```

✅ Use the existing layout:

```text
apps/web/src/
├── app/(public)/animals/components/...   # route-local
├── shared/components/AnimalCard/...      # cross-route
└── shared/hooks/useDebouncedCallback.ts  # cross-route, non-data
```

UI primitives belong in `packages/ui` (`@dniproanimals/ui`).

### Lift to a package, not just to `shared/`

If something is reusable beyond `apps/web` (or even just _might_ be), put it in a workspace package.

❌ Inventing a new icon inline:

```tsx
<svg viewBox="0 0 24 24" fill="currentColor">
  {/* … */}
</svg>
```

✅ Add it to `packages/icons/src/`:

```tsx
import { PawIcon } from "@dniproanimals/icons";
```

### Don't deep-import past a barrel

❌

```ts
import { Button } from "@dniproanimals/ui/src/components/button";
import { OrganizationForm } from "@/shared/components/OrganizationForm/OrganizationForm";
```

✅

```ts
import { Button } from "@dniproanimals/ui";
import { OrganizationForm } from "@/shared/components/OrganizationForm";
```

### Keep `app/page.tsx` thin (no one-liner wrappers)

❌

```tsx
// page.tsx
export default function Page() {
  return <AnimalsPage />;
}
```

✅ Inline the body directly in `page.tsx`. Use `<XxxPage />` only when there's a real reason (e.g. a Suspense boundary above).

---

## Components

### Use primitives from `@dniproanimals/ui`

❌ Reimplementing `Button`, `Input`, `Dialog`, `Select`, `Tabs` in app code.

✅ Import from the package:

```tsx
import { Button, Input, Form, FormField, Dialog } from "@dniproanimals/ui";
```

If a primitive needs a new variant, add it inside `packages/ui` rather than forking it in the app.

### Extract large subcomponents

❌ A 200-line subcomponent inlined in the parent.

✅ Pull it into `Component/components/SubComponent/` with its own folder + barrel.

### Don't pre-create empty folders

❌

```text
Component/
├── Component.tsx
├── hooks/        # empty
└── index.ts
```

✅ Create the folder when there is something to put in it.

### Disable async buttons + show indicator

❌ Button-state via label only — user can spam-click.

✅

```tsx
<Button disabled={isPending} aria-busy={isPending}>
  {isPending ? <Spinner className="mr-2 h-4 w-4" /> : null}
  {isPending ? "Збереження..." : "Зберегти"}
</Button>
```

---

## Styling

### Use `cn()` from `@dniproanimals/ui`

❌

```ts
import { cn } from "@/shared/utils/cn"; // doesn't exist
```

✅

```ts
import { cn } from "@dniproanimals/ui";
```

### Use semantic tokens, not hex

❌ `text-[#0061fe]`.

✅ `text-primary`, `text-foreground`, `text-gray-medium`.

If you genuinely need a new color, add the token to `packages/ui/styles/theme.css` first.

### No inline styles for static values

❌ `<div style={{ padding: 8 }} />`.

✅ `<div className="p-2" />`.

`style={{}}` is reserved for runtime-computed values (transforms, virtualized positions).

### Stock breakpoints only

❌

```tsx
<div className="grid mobile:grid-cols-2 desktop:grid-cols-3" />   {/* not configured */}
```

✅

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
```

---

## Data fetching

### Read directly from the query

❌

```tsx
const { data } = useAnimalsQuery(params);
const [items, setItems] = useState<Animal[]>([]);
useEffect(() => {
  if (data) setItems(data);
}, [data]);
```

✅

```tsx
const { data: items = [] } = useAnimalsQuery(params);
```

### Use `apiClient`, not raw `fetch`

❌

```tsx
useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/animals`).then(setData);
}, []);
```

✅ A query hook from `@/shared/query-hooks` that calls `apiClient.animals.list(...)`.

### Use the endpoint builder as the query-key prefix

❌ `queryClient.invalidateQueries({ queryKey: ["animals"] });`

✅ `queryClient.invalidateQueries({ queryKey: [endpoints.animals.list()] });`

### Show spinner only when there's no data

❌ `if (isLoading) return <Spinner />;` — flashes on every refetch.

✅ `if (isLoading && !data) return <Spinner />;`

### Server-side filtering

❌

```ts
const dogs = animals.filter((a) => a.type === "dog");
```

✅

```ts
useAnimalsQuery({ type: "dog" });
```

### Use `Promise.all` for independent fetches

❌

```ts
const animals = await apiClient.animals.list({});
const orgs = await apiClient.organizations.list({});
```

✅

```ts
const [animals, orgs] = await Promise.all([
  apiClient.animals.list({}),
  apiClient.organizations.list({}),
]);
```

### Server-side prefetch

❌ Server component fetches data, client child re-fetches the same thing through `useQuery`.

✅ Prefetch into a request-scoped `QueryClient` and hand off via `<HydrationBoundary>`:

```tsx
const queryClient = getServerQueryClient();
await queryClient.prefetchQuery({
  queryKey: [endpoints.animals.list(), {}],
  queryFn: () => apiClient.animals.list({}),
});
return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <AnimalsList />
  </HydrationBoundary>
);
```

---

## Forms

### Single source of truth for form types

❌ Separate type and schema:

```ts
interface OrganizationForm {
  name: string;
}
const schema = z.object({ name: z.string() });
```

✅

```ts
const organizationFormSchema = z.object({ name: z.string().min(1) });
type OrganizationFormValues = z.infer<typeof organizationFormSchema>;
```

### Schema is a sibling, not under `constants/`

❌ `Component/constants/schema.ts`.

✅ `Component/schema.ts`.

### Use `<Form>` + `<FormField>`, not raw RHF

❌

```tsx
<form onSubmit={form.handleSubmit(onSubmit)}>
  <Controller control={form.control} name="email" render={…} />
</form>
```

✅

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <EmailField /> {/* uses <FormField> + <FormControl> + <Input> internally */}
  </form>
</Form>
```

### Form takes `defaultValues` + `onSubmit` only

❌ Form fetches data, runs the mutation, redirects.

✅ Page owns the mutation; form is a controlled view:

```tsx
<OrganizationForm
  defaultValues={values}
  onSubmit={mutate}
  submitting={isPending}
  submitLabel="…"
/>
```

### Add and edit are separate routes

❌ Single `/dashboard/animals/[id]?` route that branches internally.

✅ `/dashboard/animals/add` + `/dashboard/animals/[id]/edit`, both reusing the same form component.

### Per-field components read context

❌ `<NameField value={...} onChange={...} />` drilled from a parent.

✅ `<NameField />` reads `useOrganizationFormContext()` itself.

### Disable submit while pending

❌

```tsx
<Button onClick={form.handleSubmit(submit)}>Save</Button>
```

✅

```tsx
<Button type="submit" disabled={isPending}>
  {isPending ? "Збереження..." : "Зберегти"}
</Button>
```

---

## Hooks

### `useDebouncedCallback`, not a hand-rolled hook

❌ A bespoke debounce hook in `Component/hooks/`.

✅

```ts
import { useDebouncedCallback } from "@/shared/hooks";
```

`usehooks-ts` is **not** a dependency of `apps/web`. If you want a generic utility hook, propose adding the lib first.

### Keep route-scoped hooks under the route

❌ `src/shared/hooks/useCatalogFilterState.ts` — only used by `/animals`.

✅ `app/(public)/animals/hooks/useCatalogFilterState.ts`.

### One hook per file

❌

```ts
// hooks.ts
export const useFoo = () => {
  /*…*/
};
export const useBar = () => {
  /*…*/
};
```

✅

```text
hooks/
├── useFoo.ts
└── useBar.ts
```

### Return a named object for 3+ values

❌ `return [value, setValue, reset, error] as const;`

✅ `return { value, setValue, reset, error };`

### Don't put React Query hooks in `src/shared/hooks/`

❌ `src/shared/hooks/useAnimalsQuery.ts`.

✅ `src/shared/query-hooks/queries/useAnimalsQuery.ts`.

---

## State management

### URL state via `nuqs` for shareable filters

❌

```tsx
const [page, setPage] = useState(1);
const [search, setSearch] = useState("");
```

✅

```ts
// app/(public)/animals/hooks/useCatalogFilterState.ts
export const useCatalogFilterState = () =>
  useQueryStates({
    type: parseAsStringLiteral(animalTypeSchema.options),
    q: parseAsString,
    sort: parseAsStringLiteral(listAnimalsSortSchema.options).withDefault(
      "newest",
    ),
  });
```

### Reuse Zod `.options` for URL parsers

❌ Re-typing the literal tuple:

```ts
parseAsStringLiteral(["dog", "cat", "other"] as const);
```

✅

```ts
parseAsStringLiteral(animalTypeSchema.options);
```

### Don't mirror server data into `useState`

❌ See data-fetching section above.

✅ Read from React Query.

### Dialogs don't own URL state

❌ Dialog reads `nuqs` to know what entity it's operating on.

✅ The trigger container (list, table, page) owns URL state. Dialog accepts props.

---

## Performance

### Use `next/image` for raster

❌ `<img src="/photo.jpg" alt="" />`.

✅ `<Image src="/photo.jpg" width={800} height={600} alt="" />`.

### Don't memoize by default

❌

```tsx
const onClick = useCallback(() => setOpen(true), []);
const config = useMemo(() => ({ size: "sm" }), []);
```

✅ Write the simple version; measure if there's a problem.

### Code-split heavy widgets

❌ Heavy chart imported at module top-level.

✅ `dynamic(() => import("./HeavyChart"), { ssr: false })`.

### Isolate ticking state

❌ Parent runs an interval; siblings re-render every tick.

✅ Move the interval into a `<Clock>` child.

---

## Types

### Domain types come from `@dniproanimals/contracts`

❌

```ts
// apps/web/src/shared/models/Animal.ts
interface Animal {
  id: number;
  name: string;
}
```

✅

```ts
import type { Animal } from "@dniproanimals/contracts";
```

### No `any` — type events properly

❌

```ts
const handler = (event: any) => setValue(event.target.value);
```

✅

```ts
const handler = (event: React.ChangeEvent<HTMLInputElement>) =>
  setValue(event.target.value);
```

### Validate at the boundary, don't assert

❌

```ts
const animal = response as Animal;
```

✅

```ts
const animal = animalSchema.parse(response);
```

### Keep small prop types inline

❌ `Component/types/ButtonProps.ts` for a 4-line interface used by exactly one consumer.

✅

```tsx
// Button.tsx
interface ButtonProps {
  variant?: "primary" | "outline";
}
```

---

## Conventions

### Comment WHY, not WHAT

❌

```ts
// increment counter
counter++;
```

✅

```ts
// cache() makes the QueryClient request-scoped on the server.
// Must be called only from server components — never imported by client code.
```

### Use `@/` alias, not relative paths

❌

```ts
import { cn } from "../../../shared/utils/cn";
```

✅

```ts
import { cn } from "@dniproanimals/ui";
```

### Named exports for components

❌

```tsx
export default function Button() {
  /*…*/
}
```

✅

```tsx
// Button.tsx
export function Button() {
  /*…*/
}
// index.ts
export * from "./Button";
```

Default exports are reserved for Next.js / tooling files (`page.tsx`, `layout.tsx`, `route.ts`, `next.config.ts`, …).

### Folder name matches the component

❌ `button/Button.tsx`.

✅ `Button/Button.tsx`.

---

## Setup & process

### npm + Turborepo (no yarn)

❌

```bash
yarn install
yarn dev
```

✅

```bash
npm install
npm run dev                                  # all workspaces
npm run dev -- --filter=@dniproanimals/web   # only web
```

### Don't commit `.env`

❌ Adding `.env` to git.

✅ `.env` stays git-ignored. There is no `.env.example` in this repo — share new variable names through the `packages/env/src/schema.ts` PR and a Slack message.

### Don't `--no-verify` — fix and recommit

❌

```bash
git commit --no-verify -m "skip checks"
```

✅

```bash
npm run type-check        # see the actual error
# fix it
git add .
git commit -m "feat: …"   # new commit, hook re-runs
```

### Don't `--amend` after a hook failure

If the hook failed, the commit didn't happen. `--amend` would touch the _previous_ commit and may destroy work. Make a new commit instead.
