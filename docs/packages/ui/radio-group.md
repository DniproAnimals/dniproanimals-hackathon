# `@dniproanimals/ui` — RadioGroup

## Import

```ts
import { RadioGroup, RadioGroupItem } from "@dniproanimals/ui";
```

---

## Usage

```tsx
<RadioGroup defaultValue="dog">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="dog" id="dog" />
    <Label htmlFor="dog">Dog</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="cat" id="cat" />
    <Label htmlFor="cat">Cat</Label>
  </div>
</RadioGroup>
```

---

## Rules

- ✅ Always pair items with a label for accessibility.
- ✅ Keep `value` unique inside the group.
- ❌ Do not use radio groups for multi-select; use `Checkbox` instead.
