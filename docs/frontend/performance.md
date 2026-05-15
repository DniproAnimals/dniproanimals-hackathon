# Performance

The defaults in this stack are fast. Most performance work is **avoiding common mistakes**, not adding optimizations.

## Don't memoize by default

`useMemo` and `useCallback` are not free. Each one adds a closure, a dependency-array comparison, and reading a value through a ref. The React 19 compiler handles most reuse cases automatically.

Reach for memoization only when:

- You have **measured** a perf problem (React DevTools Profiler shows the render is slow).
- The work being memoized is genuinely expensive — a heavy computation, a large object built from props.
- The dependency list is genuinely stable; otherwise the memo is recomputed every render and you only added overhead.

Memoizing a `<div>` or `() => setOpen(true)` is noise.

## Don't mirror server data into `useState`

This is the single biggest source of stale UIs:

```tsx
// ❌ duplicates the source of truth
const { data } = useAnimalsQuery(params);
const [items, setItems] = useState<Animal[]>([]);
useEffect(() => {
  if (data) setItems(data);
}, [data]);

// ✅ read directly from the query
const { data: items = [] } = useAnimalsQuery(params);
```

Background refetches and invalidations propagate through `data` automatically. Mirroring breaks that.

## `next/image` for raster

Always use `next/image` for content images. It handles responsive sizing, lazy loading, format negotiation (AVIF/WebP), and prevents layout shift via `width`/`height`.

```tsx
import Image from "next/image";

<Image src="/photo.jpg" width={800} height={600} alt="" />;
```

`next.config.ts` allowlists remote hosts via `images.remotePatterns` (currently `images.unsplash.com` and the Supabase storage bucket). Adding a new host = updating that list.

For SVG icons, use `@dniproanimals/icons` — `<Image>` only matters for raster.

## `next/dynamic` for heavy client-only widgets

Charts, maps, rich editors, anything that pulls in significant JS and renders client-side — code-split with `next/dynamic`:

```tsx
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./HeavyChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
```

This keeps the route's initial bundle small.

## `loading.tsx` and Suspense

Co-locate a `loading.tsx` next to a route's `page.tsx` to render a skeleton while the page is being fetched. Wrap streaming components in `<Suspense>` so slow data doesn't block the rest of the page.

```tsx
// app/<route>/loading.tsx
export default function Loading() {
  return <FooListSkeleton />;
}
```

Note: as of today, `apps/web` only ships one `loading.tsx` (`app/(dashboard)/dashboard/animals/[id]/edit/loading.tsx`). Most pages render their own skeleton inside the page (`AnimalsListSkeleton`, `AnimalDetailSkeleton`). Both patterns are fine; `loading.tsx` is the lighter option when the entire page is loading.

## Isolate ticking state

When a component holds state that updates on a timer (clocks, animation counters, polling indicators), keep that state inside a small child component. Otherwise the parent — and all of its siblings — re-render on every tick.

```tsx
function Clock() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{tick}s</span>;
}

interface DashboardProps {
  items: Item[];
}

function Dashboard({ items }: DashboardProps) {
  return (
    <>
      <Clock />
      <ExpensiveList items={items} />
    </>
  );
}
```

## Eliminate waterfalls

A waterfall is a chain of awaits where the second can't start until the first finishes. Each link adds round-trip latency. Two main fixes:

- **Parallel independent fetches** — wrap them in `Promise.all` so they run together.
- **Start early, await late** — kick off a Promise at the top of the function, await it only where the value is needed.

In Server Components, prefer co-locating a fetch with the component that uses it and wrap each in `<Suspense>`. Each branch streams independently — see [data-fetching.md](data-fetching.md).

## Bundle hygiene

A few patterns that reliably keep the JS shipped to the browser small:

- **Don't deep-import past package barrels.** `import { X } from "@dniproanimals/ui"` is fine — the package's entry is `src/index.ts` and it's small. Don't `import { X } from "@dniproanimals/ui/src/components/foo"` either; that bypasses the public API and can include neighbors.
- **`next/dynamic` for heavy client-only modules** — see above.
- **Defer third-party scripts** with `<Script strategy="afterInteractive">` or `lazyOnload`. The current `app/layout.tsx` uses `afterInteractive` for the analytics script.

This project does **not** currently ship a bundle analyzer (`@next/bundle-analyzer` is not installed). If you need to inspect bundles, add it temporarily and remove before merging, or run a one-off build with `--profile`.

## Core Web Vitals

Targets to hit:

| Metric                              | Target  | Drives                                     |
| ----------------------------------- | ------- | ------------------------------------------ |
| **LCP** (Largest Contentful Paint)  | < 2.5s  | Loading speed — image/font/HTML delivery   |
| **INP** (Interaction to Next Paint) | < 200ms | Interactivity — JS work on the main thread |
| **CLS** (Cumulative Layout Shift)   | < 0.1   | Visual stability — sized media and fonts   |

Levers per metric:

- **LCP** — `next/image` with `priority` on the hero image (the `AnimalCard` already does this for the first photo); server-render content above the fold (don't mark public landing pages as `'use client'`).
- **INP** — convert client components to server components where you can; defer non-critical work with `useTransition` / `useDeferredValue`; trim third-party JS.
- **CLS** — always set `width`/`height` (or `fill` + `sizes`) on images; reserve skeleton heights that match the loaded content; use `next/font` (already wired with Geist) so font swaps don't cause shift.

## Re-render hygiene

- **Lift state down.** A component holding state high in the tree re-renders everything below. Keep state as close to the consumer as possible.
- **Don't pass new object/array literals as props** unless you need to. `<Foo style={{ color: "red" }} />` creates a new object every render. If `Foo` is memoized, the memo never hits.
- **Subscribe to derived booleans, not raw values.** `count > 0` flips less often than `count` and triggers fewer re-renders.

## Long lists

If a list reaches a few hundred rows and scrolling/typing in the page lags, virtualization is the answer. The project does **not** currently depend on `@tanstack/react-virtual`, but it's the right tool — propose adding it before re-rolling a viewport observer manually.

## What this project doesn't have (yet)

- **No `@tanstack/react-virtual`** — virtualization isn't wired anywhere.
- **No `@next/bundle-analyzer`** — `ANALYZE=true npm run build` won't do anything until you add it.
- **No `react-doctor` / audit script** — see [scripts.md](scripts.md#things-that-dont-exist-yet).
- **No `next-themes`** — no dark-mode toggle code path to optimize.

If you reach for any of these, propose adding it as a dep before assuming it's there.

## Quick rules

- Default to no memoization. Measure before reaching for `useMemo`/`useCallback`/`memo`.
- Don't mirror React Query data into `useState`.
- `next/image` for raster, `@dniproanimals/icons` for SVG.
- `next/dynamic({ ssr: false })` for heavy client-only widgets.
- `<Suspense>` boundaries to stream slow parts independently.
- `Promise.all` for independent server-side fetches.
- Ticking state lives in a small child component.
- Keep state low in the tree.
