# `@dniproanimals/ui` — Input

## Import

```ts
import { Input, inputVariants } from "@dniproanimals/ui";
```

---

## Props

| Prop        | Type     | Default | Description       |
| ----------- | -------- | ------- | ----------------- | ---- | ---------------- |
| `size`      | `"sm"    | "md"    | "lg"`             | "md" | Height + padding |
| `className` | `string` | —       | Merged via `cn()` |

All standard `<input>` props are forwarded.

---

## Usage

```tsx
<Input placeholder="Name" />
<Input size="lg" type="email" placeholder="Email" />
```

---

## Rules

- ✅ Use `InputWithIcon` when an icon is required.
- ❌ Do not override height with custom classes; use `size`.
