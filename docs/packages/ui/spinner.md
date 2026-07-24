# `@dniproanimals/ui` — Spinner

## Import

```ts
import { Spinner } from "@dniproanimals/ui";
```

---

## Props

| Prop   | Type  | Default | Description |
| ------ | ----- | ------- | ----------- | ---- | ------------ |
| `size` | `"sm" | "md"    | "lg"`       | "md" | Spinner size |

All standard `div` props are forwarded.

---

## Usage

```tsx
<Spinner />
<Spinner size="lg" className="text-gray-medium" />
```

---

## Rules

- ✅ Use `aria-label` overrides if the context needs specificity.
- ❌ Do not pair with long text blocks; use an inline layout.
