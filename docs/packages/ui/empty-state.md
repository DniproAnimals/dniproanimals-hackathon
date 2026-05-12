# `@dniproanimals/ui` — EmptyState

## Import

```ts
import { EmptyState } from "@dniproanimals/ui";
```

---

## Props

| Prop          | Type        | Default | Description             |
| ------------- | ----------- | ------- | ----------------------- |
| `icon`        | `ReactNode` | —       | Optional icon element   |
| `title`       | `ReactNode` | —       | Heading text or element |
| `description` | `ReactNode` | —       | Supporting text         |
| `action`      | `ReactNode` | —       | Action button/link      |
| `className`   | `string`    | —       | Merged via `cn()`       |

All standard `div` props are forwarded.

---

## Usage

```tsx
<EmptyState
  icon={<IconPaw />}
  title="No animals yet"
  description="Start by adding your first animal to the shelter database."
  action={<Button>Add animal</Button>}
/>
```

---

## Rules

- ✅ Keep descriptions short (1–2 lines).
- ✅ Use `action` for the primary next step.
- ❌ Do not place large forms inside `EmptyState`.
