# `@dniproanimals/ui` — InputWithIcon

## Import

```ts
import { InputWithIcon } from "@dniproanimals/ui";
```

---

## Props

| Prop           | Type        | Default  | Description       |
| -------------- | ----------- | -------- | ----------------- | -------------- |
| `icon`         | `ReactNode` | —        | Icon element      |
| `iconPosition` | `"left"     | "right"` | "left"            | Icon placement |
| `className`    | `string`    | —        | Merged via `cn()` |

All standard `div` props are forwarded.

---

## Usage

```tsx
<InputWithIcon icon={<IconSearch />}>
  <Input placeholder="Search" />
</InputWithIcon>
```

---

## Rules

- ✅ Use with `Input` or `Textarea` children only.
- ✅ Keep icons small (16px) to match spacing.
- ❌ Do not use for interactive icons; this wrapper is decorative.
