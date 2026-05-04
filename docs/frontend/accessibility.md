# Accessibility

A11y rules that cover most ground in this project. Most low-level patterns (focus traps, escape handling, ARIA wiring for dialogs/tabs/popovers) come "for free" from `@dniproanimals/ui` because the primitives are built on Radix. The rules below are what's still on you.

## Use primitives, not raw DOM

Radix-backed primitives in `@dniproanimals/ui` already do the right thing for keyboard navigation, focus management, ARIA roles, and screen readers:

| Pattern              | Use                                                                         |
| -------------------- | --------------------------------------------------------------------------- |
| Modal / dialog       | `Dialog` from `@dniproanimals/ui`                                           |
| Side drawer          | `Sheet` from `@dniproanimals/ui`                                            |
| Dropdown menu        | `DropdownMenu` from `@dniproanimals/ui`                                     |
| Combobox / select    | `Select` from `@dniproanimals/ui`                                           |
| Popover              | `Popover` from `@dniproanimals/ui`                                          |
| Tabs                 | `Tabs` from `@dniproanimals/ui`                                             |
| Tooltip              | `Tooltip` from `@dniproanimals/ui`                                          |
| Switch               | `Switch` from `@dniproanimals/ui`                                           |
| Checkbox             | `Checkbox` from `@dniproanimals/ui`                                         |
| Radio group          | `RadioGroup` from `@dniproanimals/ui`                                       |
| Form labels + errors | `Form` + `FormField` + `FormLabel` + `FormMessage` from `@dniproanimals/ui` |

If you find yourself building any of these from scratch with `<div>` + `useState`, stop — there's a primitive. If a primitive doesn't fit a need, propose extending it inside `packages/ui` rather than rolling a one-off in the app.

## Semantic HTML first

Always use the correct semantic element before reaching for ARIA attributes.

| Need             | Use                      | Not                                                                     |
| ---------------- | ------------------------ | ----------------------------------------------------------------------- |
| Action button    | `<button>`               | `<div onClick>`                                                         |
| Link/navigation  | `<a href>` (or `<Link>`) | `<span onClick>`                                                        |
| List             | `<ul>` / `<ol>`          | `<div>` with items                                                      |
| Heading          | `<h1>`–`<h6>`            | `<div className="title">`                                               |
| Page nav         | `<nav>`                  | `<div className="nav">`                                                 |
| Main content     | `<main>`                 | `<div>` (already in `(public)/layout.tsx` and `(dashboard)/layout.tsx`) |
| Form input label | `<label htmlFor>`        | placeholder text only                                                   |
| Table data       | `<table>`                | `<div>` grid layout                                                     |

## Buttons vs links

- **Button** — triggers an action (submit, toggle, open modal).
- **Link** — navigates to a URL or page section. Use Next's `<Link>`.

The project's "asChild + Link" pattern (Radix `Slot`) is the right way to render a styled `Button` that's actually a navigation link:

```tsx
<Button asChild variant="ghost" size="sm">
  <Link href="/dashboard/animals">Назад</Link>
</Button>
```

That gives you `<a href="…">` with button styling — keyboard nav, screen readers, and middle-click all work as users expect.

## Forms a11y (handled by `<Form>` / `<FormField>`)

The shadcn-style `Form` primitive in `@dniproanimals/ui` wires up label/control/error association automatically. Each `<FormItem>` generates a stable `id`; `<FormLabel>` sets `htmlFor`; `<FormControl>` (a Radix `Slot`) injects `id`, `aria-describedby`, `aria-invalid` onto its child. As long as you use this stack, you don't need to wire ARIA by hand:

```tsx
<FormField
  control={control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" {...field} />
      </FormControl>
      <FormMessage /> {/* role-equivalent of aria-live for the field error */}
    </FormItem>
  )}
/>
```

Things still on you:

- Mark required fields visually (e.g. `*` in the label) and via Zod (`.min(1)`).
- For multi-step or grouped forms, use `<fieldset>` + `<legend>` to group inputs semantically.
- For non-text fields (file pickers, custom selects), make sure the wrapped primitive has `aria-label` or visible label text.

## Images

- Decorative images: `alt=""`. Don't omit `alt` entirely — empty string tells screen readers to skip.
- Content images: descriptive `alt`. The animal-card image is `alt={animal.name}`, which is right.
- Always set `width`/`height` (or `fill` + `sizes`) on `next/image` to prevent layout shift — see [performance.md](performance.md#core-web-vitals).

## Keyboard navigation

- All interactive elements are keyboard accessible (Tab to reach, Enter/Space to activate). Native `<button>` and `<a href>` give you this for free.
- Focus order should follow visual order. Don't rely on `tabIndex={N}` to "fix" focus order — fix the DOM order instead.
- Don't suppress focus outlines. The Radix primitives ship visible focus rings via the `data-[state]` selectors and `:focus-visible` — keep them.

## Live regions

For toast-like ephemeral status (form submission, async result), wrap the message in `role="status"` (polite) or `role="alert"` (assertive):

```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  {status}
</div>
```

The project doesn't currently have a toast system — when you add one, prefer `role="status"` for non-critical messages and `role="alert"` only for errors that interrupt the user.

## Color and contrast

- Minimum contrast ratio: **4.5:1** for normal text, **3:1** for large text (WCAG AA).
- The project's tokens (`text-foreground`, `bg-card`, `text-gray-medium`, …) are designed to meet this. If you reach for raw colors, double-check.
- Don't convey information through color alone. The animal status badges combine color **and** label text.
- Test with a contrast checker (DevTools' built-in one is enough).

## Motion preferences

Respect `prefers-reduced-motion`. The project uses `motion` (Framer Motion) for entrance animations — for any new animation, wrap it so it respects user prefs:

```tsx
// In Tailwind:
<div className="transition-transform motion-reduce:transition-none motion-reduce:transform-none" />
```

```css
/* In globals.css for app-wide rules: */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Skip-to-content (target)

Not currently in the layout. When/if it's added, the pattern:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-card focus:rounded-md"
>
  До основного вмісту
</a>
<main id="main-content" tabIndex={-1}>{children}</main>
```

## Review checklist

### Structure

- [ ] Semantic HTML (`<main>`, `<nav>`, `<article>`, …) used instead of generic `<div>`.
- [ ] Heading hierarchy is logical (`h1` → `h2` → `h3`, no skipping levels).
- [ ] Page has a descriptive `<title>` (set via `metadata` — see [seo.md](seo.md)).

### Interactive elements

- [ ] Use a `@dniproanimals/ui` primitive when one fits; don't rebuild it.
- [ ] Buttons trigger actions; links navigate. Use `Button asChild` + `Link` for "button-styled link".
- [ ] No `<div onClick>`. Native `<button>` if it's a button.
- [ ] Focus indicators are visible (don't kill `:focus-visible` styles).
- [ ] No keyboard traps in custom UI.

### Forms

- [ ] Built with `<Form>` + `<FormField>` from `@dniproanimals/ui` — labels, error wiring, `aria-invalid` are automatic.
- [ ] Required fields marked visually and validated via Zod.
- [ ] Grouped inputs use `<fieldset>` + `<legend>`.
- [ ] Custom controls (selects, file pickers) carry an accessible name.

### Images and media

- [ ] All `<Image>` calls set `alt` (empty string for decorative).
- [ ] Width/height (or `fill` + `sizes`) set to prevent layout shift.

### Dynamic content

- [ ] Async status messages use `role="status"` / `aria-live="polite"`.
- [ ] Error messages use `role="alert"` when critical.
- [ ] Animations respect `prefers-reduced-motion` (Tailwind `motion-reduce:` or CSS media query).
