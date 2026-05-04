# Styling

Tailwind CSS v4 + `cn()` from `@dniproanimals/ui`. Variants inside primitives use `class-variance-authority` (`cva`). No CSS-in-JS, no CSS modules, no inline styles for static values.

## Tailwind v4

Tailwind v4 uses a CSS-based config — there is no `tailwind.config.{ts,js}`. The setup spans three files:

| File                           | Purpose                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------- |
| `apps/web/postcss.config.mjs`  | Re-exports the shared preset from `@dniproanimals/tailwind/postcss`.          |
| `packages/ui/styles/theme.css` | `@import "tailwindcss"`, `@source "../src"`, `:root` tokens, `@theme inline`. |
| `apps/web/src/app/globals.css` | `@import "@dniproanimals/ui/theme.css"` + scrollbar/keyframe overrides.       |

The `@source "../src"` directive in `theme.css` tells Tailwind to scan `packages/ui/src` for class names. Adding a new utility-using component there does not require updating any config.

## Tokens

Defined as CSS variables in `:root` and exposed to Tailwind via `@theme inline`. Two layers:

**Brand tokens** (legacy, kept for migration): `green-primary`, `green-light`, `green-dark`, `green-accent`, `green-soft`, `green-secondary`, `brown-accent`, `gray-light`, `gray-border`, `gray-medium`.

**Shadcn semantic tokens**: `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`, `success`, `success-foreground`, `warning`, `warning-foreground`, `info`, `info-foreground`, `brand`, `brand-foreground`, `brown`, `border`, `input`, `ring`.

Use them as `bg-*`, `text-*`, `border-*`, `ring-*`:

```tsx
<div className="bg-card text-card-foreground border border-border" />
<button className="bg-primary text-primary-foreground hover:bg-primary/90" />
<p className="text-gray-medium" />        {/* legacy token, still in use */}
```

**No hex codes.** `text-[#0061fe]` is wrong unless the value is a runtime computed color. If a design needs a color that isn't a token, add the token to `theme.css` first.

Radii: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl` resolve to `--radius - 4px / 2px / 0 / +4px` from a single `--radius: 0.75rem` knob.

Fonts: `font-sans` and `font-mono` are wired to the Geist Sans / Geist Mono variables set up in `app/layout.tsx`. Don't load fonts manually from `public/`.

## `cn()` helper

`cn` is exported from `@dniproanimals/ui` (it composes `clsx` + `tailwind-merge`):

```tsx
import { cn } from "@dniproanimals/ui";

<div className={cn("px-4 py-2", isActive && "bg-primary", className)} />;
```

Use `cn()` whenever a class is conditional, comes from props, or merges with a `className` prop. Plain strings are fine when nothing dynamic is happening:

```tsx
<div className="rounded-md border bg-card p-4" />
```

## CVA: where it belongs

`class-variance-authority` is used **inside `@dniproanimals/ui`** for primitives like `Button`, `Badge`, `Input`. Variant files (`button.tsx` colocates its `cva` call) define the variant API; consumers just pass `variant="primary"`, `size="lg"`, etc.

App-level components in `apps/web` typically don't need their own `cva`. Compose primitives:

```tsx
<Button variant="primary" size="lg">Save</Button>
<Badge variant="reserved" size="sm">Зарезервовано</Badge>
```

If you find yourself needing a third variant of a primitive, **add it inside `packages/ui`** instead of forking the styles in the app.

## Theming

The CSS sets up dark-mode overrides via `@custom-variant dark (&:is(.dark *))`, but **dark mode is not currently wired** in `apps/web` (no `next-themes` provider, nothing toggles `class="dark"` on `<html>`). The `dark:` variant works the day someone adds a theme switcher; for now the app renders light-only.

If adding a theme switcher: drop `next-themes` into `apps/web`, wrap the layout in a `ThemeProvider`, set `attribute="class"`. Components don't need to change — they already use semantic tokens.

## Breakpoints

This project uses **stock Tailwind v4 breakpoints**. There are no custom names like `mobile:` / `laptop:` / `monitor:`.

| Variant | Min width |
| ------- | --------- |
| `sm:`   | 640px     |
| `md:`   | 768px     |
| `lg:`   | 1024px    |
| `xl:`   | 1280px    |
| `2xl:`  | 1536px    |

Default mobile-first; layer larger breakpoints on top:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
```

## Inline styles

Reserved for **runtime-computed values** (transform offsets, virtualized row positions, dynamic color picked at render time). Static spacing/colors always use Tailwind classes:

```tsx
<div style={{ padding: 8 }} />              {/* ❌ */}
<div className="p-2" />                     {/* ✅ */}

<div style={{ transform: `translateY(${y}px)` }} />   {/* ✅ runtime value */}
```

## Animations

The project uses two complementary tools:

- **Tailwind transitions** (`transition-all`, `duration-300`, `ease-out`) for simple state changes.
- **`motion` (Framer Motion)** for entrance/exit and orchestrated sequences — see usage in `app/(public)/animals/page.tsx` and `AnimalsList.tsx`.

`tw-animate-css` is included via `theme.css` and gives you helpers like `animate-in`, `fade-in`, `slide-in-from-*` for declarative micro-animations:

```tsx
<div className="animate-in fade-in slide-in-from-bottom-2 duration-200" />
```

The custom keyframes (`modal-overlay`, `modal-in`, `modal-success`) live in `globals.css` and are exposed as `animate-modal-*` utilities.

## Quick rules

- All styling through Tailwind classes, merged with `cn()` from `@dniproanimals/ui`.
- Use semantic tokens (`bg-primary`, `text-foreground`) — never hex codes.
- No `style={{}}` for static values; reserve for runtime-computed ones.
- Stock Tailwind breakpoints (`sm/md/lg/xl/2xl`), not custom names.
- App-level components don't define their own CVA — compose primitives from `@dniproanimals/ui`.
