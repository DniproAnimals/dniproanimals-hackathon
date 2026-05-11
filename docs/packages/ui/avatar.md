# `@dniproanimals/ui` — Avatar

## Import

```ts
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarWithStatus,
} from "@dniproanimals/ui";
import type { AvatarSize, AvatarShape, AvatarStatus } from "@dniproanimals/ui";
```

---

## Components

The package exports two APIs:

- **Composable** — `Avatar` + `AvatarImage` + `AvatarFallback` for full control.
- **Convenience** — `AvatarWithStatus` wraps all three and adds a status dot.

In most cases `AvatarWithStatus` is what you want.

---

## `AvatarWithStatus` props

| Prop        | Type           | Default    | Description                                |
| ----------- | -------------- | ---------- | ------------------------------------------ |
| `src`       | `string`       | —          | Image URL; omit to show fallback only      |
| `alt`       | `string`       | —          | Alt text for the image                     |
| `fallback`  | `string`       | —          | Initials shown when image is absent/broken |
| `size`      | `AvatarSize`   | `"md"`     | See sizes table below                      |
| `shape`     | `AvatarShape`  | `"circle"` | See shapes table below                     |
| `status`    | `AvatarStatus` | —          | Renders a colored dot; omit to hide        |
| `className` | `string`       | —          | Applied to the inner `Avatar` root         |

All standard Radix `Avatar.Root` props are forwarded.

---

## Sizes

| Value | Size    |
| ----- | ------- |
| `xs`  | 24×24px |
| `sm`  | 32×32px |
| `md`  | 40×40px |
| `lg`  | 56×56px |
| `xl`  | 72×72px |
| `2xl` | 96×96px |

---

## Shapes

| Value     | Border radius  |
| --------- | -------------- |
| `circle`  | `rounded-full` |
| `rounded` | `rounded-lg`   |
| `slight`  | `rounded-sm`   |
| `square`  | `rounded-none` |

---

## Statuses

| Value     | Color  |
| --------- | ------ |
| `online`  | Green  |
| `busy`    | Red    |
| `away`    | Yellow |
| `offline` | Gray   |

Status dot size is `size-2` for `xs`/`sm` and `size-3` for all larger sizes.

---

## Usage

**With image + fallback:**

```tsx
<AvatarWithStatus
  src="https://example.com/photo.jpg"
  alt="John Doe"
  fallback="JD"
  size="lg"
/>
```

**Fallback only (no image):**

```tsx
<AvatarWithStatus fallback="MK" size="md" />
```

**With status indicator:**

```tsx
<AvatarWithStatus
  src="https://example.com/photo.jpg"
  fallback="JD"
  size="lg"
  status="online"
/>
```

**Custom shape:**

```tsx
<AvatarWithStatus fallback="MK" size="lg" shape="rounded" />
```

**Composable (full control):**

```tsx
<Avatar size="lg" shape="circle">
  <AvatarImage src={user.photo} alt={user.name} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>
```

---

## Rules

- ✅ Always provide `fallback` alongside `src` — it renders automatically if the image fails to load.
- ✅ Use `AvatarWithStatus` for all standard cases; drop to the composable API only when you need to inject custom children.
- ✅ Keep `fallback` to 1–2 characters (initials).
- ❌ Don't use `className` to override size or shape — use the `size` and `shape` props instead.
