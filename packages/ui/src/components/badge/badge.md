# `@dniproanimals/ui` — Badge

## Import

```ts
import { Badge, badgeVariants } from "@dniproanimals/ui";
```

---

## Props

| Prop        | Type      | Default     | Description                                   |
| ----------- | --------- | ----------- | --------------------------------------------- |
| `variant`   | see below | `"default"` | Visual style                                  |
| `size`      | see below | `"md"`      | Padding + font size                           |
| `className` | `string`  | —           | Merged via `cn()`, safe to pass extra classes |

All standard `<span>` HTML attributes are forwarded.

---

## Variants

| Value      | When to use                                  |
| ---------- | -------------------------------------------- |
| `default`  | Generic neutral label                        |
| `brand`    | Primary brand highlight                      |
| `soft`     | Low-emphasis positive / green tint           |
| `outline`  | Bordered, no fill                            |
| `success`  | Positive status (active, healthy, completed) |
| `warning`  | Cautionary status (pending, needs attention) |
| `danger`   | Negative status (error, rejected, critical)  |
| `info`     | Informational label                          |
| `reserved` | Animal reservation status — yellow with blur |
| `adopted`  | Animal adoption status — green with blur     |
| `dark`     | High-contrast label on light backgrounds     |

---

## Sizes

| Value | Font size | Use case                    |
| ----- | --------- | --------------------------- |
| `xs`  | 10px      | Dense tables, compact lists |
| `sm`  | 10px      | Inline labels, tags         |
| `md`  | 12px      | Default                     |
| `lg`  | 14px      | Prominent status labels     |

---

## Usage

**Basic:**

```tsx
<Badge>Default</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="danger">Rejected</Badge>
```

**Animal status:**

```tsx
<Badge variant="reserved" size="sm">Зарезервовано</Badge>
<Badge variant="adopted" size="sm">Adopted</Badge>
```

**With icon:**

```tsx
import { IconCircleCheck } from "@dniproanimals/icons";

<Badge variant="success">
  <IconCircleCheck /> Verified
</Badge>;
```

**Using `badgeVariants` outside Badge** (e.g. on a custom element):

```tsx
import { badgeVariants } from "@dniproanimals/ui";

<div className={badgeVariants({ variant: "info", size: "sm" })}>
  Custom element
</div>;
```

---

## Rules

- ✅ Use `reserved` and `adopted` specifically for animal status — they include `backdrop-blur-sm` and are designed to overlay images.
- ✅ Icons inside Badge are automatically sized to `size-3` via `[&_svg]:size-3`.
- ❌ Don't add a new variant in `apps/web` — extend `packages/ui/src/components/badge/badge.tsx` instead.
- ❌ Don't use Badge for interactive actions — it renders as a `<span>`. Use `Button` for clickable elements.
