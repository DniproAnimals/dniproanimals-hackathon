# `@dniproanimals/ui` — Separator

## Import

```ts
import { Separator } from "@dniproanimals/ui";
```

---

## Props

| Prop          | Type          | Default     | Description               |
| ------------- | ------------- | ----------- | ------------------------- | ---------------- |
| `orientation` | `"horizontal" | "vertical"` | "horizontal"              | Layout direction |
| `decorative`  | `boolean`     | `true`      | Hides from screen readers |

All standard Radix Separator props are forwarded.

---

## Usage

```tsx
<div className="space-y-4">
  <div>Section A</div>
  <Separator />
  <div>Section B</div>
</div>
```

---

## Rules

- ✅ Set `decorative={false}` when the separator conveys meaning.
- ❌ Do not use separators as borders for whole sections.
