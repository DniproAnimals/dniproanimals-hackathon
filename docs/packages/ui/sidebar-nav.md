# `@dniproanimals/ui` — SidebarNavItem

## Import

```ts
import { SidebarNavItem } from "@dniproanimals/ui";
```

---

## Props

| Prop        | Type        | Default | Description           |
| ----------- | ----------- | ------- | --------------------- |
| `href`      | `string`    | —       | Destination URL       |
| `icon`      | `ReactNode` | —       | Optional icon element |
| `active`    | `boolean`   | —       | Active state styling  |
| `className` | `string`    | —       | Merged via `cn()`     |

All standard `next/link` props are forwarded.

---

## Usage

```tsx
<SidebarNavItem href="/animals" icon={<IconPaw />} active>
  Animals
</SidebarNavItem>
```

---

## Rules

- ✅ Provide `active` state based on the current route.
- ❌ Do not use for external links; use a plain anchor instead.
