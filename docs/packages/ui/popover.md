# `@dniproanimals/ui` — Popover

## Import

```ts
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "@dniproanimals/ui";
```

---

## Props

| Component        | Custom props          | Description                   |
| ---------------- | --------------------- | ----------------------------- |
| `PopoverContent` | `align?: string`      | Content alignment             |
| `PopoverContent` | `sideOffset?: number` | Gap between trigger and panel |

All other props are forwarded to the Radix Popover primitives.

---

## Usage

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Filters</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="space-y-2">Popover content</div>
  </PopoverContent>
</Popover>
```

---

## Rules

- ✅ Keep content width small; use forms for simple controls.
- ❌ Do not place long, scrollable content inside popovers.
