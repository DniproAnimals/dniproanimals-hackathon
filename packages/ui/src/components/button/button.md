# `@dniproanimals/ui` — Button

## Import

```ts
import { Button, buttonVariants } from "@dniproanimals/ui";
```

---

## Props

| Prop        | Type                              | Default     | Description                                   |
| ----------- | --------------------------------- | ----------- | --------------------------------------------- |
| `variant`   | see below                         | `"primary"` | Visual style                                  |
| `size`      | see below                         | `"md"`      | Height + padding + icon size                  |
| `shape`     | `"default" \| "pill" \| "square"` | `"default"` | Border radius override                        |
| `asChild`   | `boolean`                         | `false`     | Renders as the child element via Radix `Slot` |
| `disabled`  | `boolean`                         | `false`     | Disables pointer events + reduces opacity     |
| `className` | `string`                          | —           | Merged via `cn()`, safe to pass extra classes |

All standard `<button>` HTML attributes are forwarded.

---

## Variants

| Value         | When to use                                   |
| ------------- | --------------------------------------------- |
| `primary`     | Main CTA — one per view                       |
| `secondary`   | Secondary action alongside primary            |
| `outline`     | Neutral action, bordered                      |
| `ghost`       | Toolbar / icon-adjacent action, no background |
| `link`        | Inline text-like action                       |
| `destructive` | Irreversible actions (delete, remove)         |
| `success`     | Confirm / complete actions                    |
| `soft`        | Low-emphasis positive action                  |
| `subtle`      | Low-emphasis neutral action                   |

---

## Sizes

| Value     | Height  | Use case                 |
| --------- | ------- | ------------------------ |
| `sm`      | 32px    | Dense UIs, table rows    |
| `md`      | 40px    | Default                  |
| `lg`      | 48px    | Forms, prominent actions |
| `xl`      | 56px    | Hero / landing CTAs      |
| `icon`    | 36×36px | Square icon-only button  |
| `icon-sm` | 28×28px | Compact icon button      |
| `icon-lg` | 44×44px | Large icon button        |

---

## Usage

**Basic:**

```tsx
<Button>Save</Button>
<Button variant="outline">Cancel</Button>
<Button variant="destructive">Delete</Button>
```

**With icon:**

```tsx
import { IconSearch } from "@dniproanimals/icons";

<Button variant="primary">
  <IconSearch /> Search
</Button>;
```

**Icon-only:**

```tsx
<Button size="icon" variant="ghost">
  <IconSearch />
</Button>
```

**As link (`asChild`):**

```tsx
import Link from "next/link";

<Button asChild variant="outline">
  <Link href="/animals">View all</Link>
</Button>;
```

**Using `buttonVariants` outside Button** (e.g. styling a plain `<a>`):

```tsx
import { buttonVariants } from "@dniproanimals/ui";

<a href="/back" className={buttonVariants({ variant: "ghost", size: "sm" })}>
  Go back
</a>;
```

---

## Rules

- ❌ Don't add a new variant in `apps/web` — extend `packages/ui/src/components/button/button.tsx` instead.
- ❌ Don't use `type="submit"` implicitly — Button defaults to `type="button"`. Set `type="submit"` explicitly on form submit buttons.
- ✅ Use `asChild` + Next.js `<Link>` for navigation buttons to keep routing client-side.
- ✅ Icon-only buttons should always have an `aria-label` for accessibility.
