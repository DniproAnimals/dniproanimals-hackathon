# `@dniproanimals/ui` — Label

## Import

```ts
import { Label } from "@dniproanimals/ui";
```

---

## Usage

```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

---

## Rules

- ✅ Always pair `Label` with a control using `htmlFor` and `id`.
- ❌ Do not use `Label` as a standalone heading.
