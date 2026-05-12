# `@dniproanimals/ui` — Switch

## Import

```ts
import { Switch } from "@dniproanimals/ui";
```

---

## Usage

```tsx
<div className="flex items-center gap-2">
  <Switch id="notifications" />
  <Label htmlFor="notifications">Notifications</Label>
</div>
```

---

## Rules

- ✅ Pair with a label for accessibility.
- ✅ Use for binary on/off preferences only.
- ❌ Do not use for immediate destructive actions.
