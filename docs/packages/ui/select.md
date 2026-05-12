# `@dniproanimals/ui` — Select

## Import

```ts
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@dniproanimals/ui";
```

---

## Usage

```tsx
<Select defaultValue="dog">
  <SelectTrigger>
    <SelectValue placeholder="Choose animal" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Animals</SelectLabel>
      <SelectItem value="dog">Dog</SelectItem>
      <SelectItem value="cat">Cat</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

---

## Rules

- ✅ Use `SelectValue` for placeholder text.
- ✅ Keep item labels short to avoid overflow.
- ❌ Do not nest form controls inside `SelectContent`.
