# `@dniproanimals/ui` — FilterChip

## Import

```ts
import { FilterChip } from "@dniproanimals/ui";
```

---

## Props

| Prop        | Type         | Default   | Description                            |
| ----------- | ------------ | --------- | -------------------------------------- | -------- | ------------------- | ------------ |
| `variant`   | `"default"   | "outline" | "active"                               | "muted"` | "default"           | Visual style |
| `size`      | `"sm"        | "md"      | "lg"`                                  | "md"     | Padding + font size |
| `count`     | `number`     | —         | Optional badge count                   |
| `onRemove`  | `() => void` | —         | Shows remove icon and invokes callback |
| `className` | `string`     | —         | Merged via `cn()`                      |

All standard `<button>` props are forwarded.

---

## Usage

```tsx
<FilterChip variant="active">Dogs</FilterChip>
<FilterChip variant="outline" count={3}>Cats</FilterChip>
<FilterChip onRemove={() => remove("age")}>
  Age: 2-5
</FilterChip>
```

---

## Rules

- ✅ Use `onRemove` for removable filters only.
- ✅ Keep labels short to avoid overflow.
- ❌ Do not use FilterChip as the primary CTA.
